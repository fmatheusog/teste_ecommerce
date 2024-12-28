using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text;
using Teste.Application.Abstractions;
using Teste.Infrastructure.Context;
using Teste.Infrastructure.Entities;
using Teste.Shared;
using Teste.Shared.Args;
using Teste.Shared.Enums;
using Teste.Shared.Models;
using FluentValidation;

namespace Teste.Application.Services;

public class OrderService(
    AppDbContext context,
    IMapper mapper,
    ILogger<OrderService> logger,
    HttpClient httpClient) : IOrderService
{
    public async Task<OrderModel> GetOrderByIdAsync(Guid orderId)
    {
        var order = await context
            .Order
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        return mapper.Map<OrderModel>(order);
    }

    public async Task<IReadOnlyCollection<OrderModel>> GetOrdersAsync()
    {
        var orders = await context
            .Order
            .Include(o => o.Customer)
            .ToListAsync();

        return mapper.Map<OrderModel[]>(orders);
    }

    public async Task<OrderModel> ProcessOrderAsync(ProcessOrderPostArgs args)
    {
        try
        {
            new ProcessOrderPostArgs.Validator().ValidateAndThrow(args);

            var alreadyExists = await GetOrderByIdAsync(args.OrderId);

            if (alreadyExists is not null) throw new InvalidOperationException("Já existe um pedido com esse Identificador");

            var customer = new Customer
            {
                CustomerId = args.Customer.CustomerId,
                Name = args.Customer.Name,
                NationalDocument = args.Customer.NationalDocument,
                Category = args.Customer.Category,
            };

            var orderItems = args
                .Items
                .Select(i => new OrderItem
                {
                    ItemId = i.ItemId,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    UnitPrice = decimal.Round(i.UnitPrice, 2),
                })
                .ToList();

            decimal subTotal = orderItems.Sum(i => i.Quantity * i.UnitPrice);

            var order = new Order
            {
                OrderId = args.OrderId,
                OrderDate = args.OrderDate,
                Customer = customer,
                OrderItems = orderItems,
                SubTotal = decimal.Round(subTotal, 2),
                Status = OrderStatus.PENDENTE,
                Discounts = decimal.Round(customer.Category.GetDiscountAmount(subTotal), 2),
            };

            order.Total = decimal.Round(subTotal - order.Discounts, 2);

            await context.Database.BeginTransactionAsync();
            await context.AddAsync(order);
            await context.SaveChangesAsync();
            await context.Database.CommitTransactionAsync();

            await ProcessExternalInvoicing(order);

            return mapper.Map<OrderModel>(order);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex.Message);
            throw;
        }
        catch (HttpRequestException ex)
        {
            logger.LogWarning(ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
            await context.Database.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderModel> EditOrderAsync(Guid orderId, OrderPutArgs args)
    {
        new OrderPutArgs.Validator().ValidateAndThrow(args);

        var order = await context
            .Order
            .Where(o => o.Status == OrderStatus.PENDENTE)
            .FirstOrDefaultAsync(o => o.OrderId == orderId)
            ?? throw new InvalidOperationException("Pedido não encontrado ou já finalizado");

        order.OrderDate = args.OrderDate;
        order.Status = args.Status;

        context.Update(order);
        context.SaveChanges();

        await ProcessExternalInvoicing(order);

        return mapper.Map<OrderModel>(order);
    }

    public async Task<CustomerModel> EditCustomerAsync(Guid orderId, CustomerPutArgs args)
    {
        new CustomerPutArgs.Validator().ValidateAndThrow(args);

        var order = await context
            .Order
            .Include(o => o.Customer)
            .Where(o => o.Status == OrderStatus.PENDENTE)
            .FirstOrDefaultAsync(o => o.OrderId == orderId)
            ?? throw new InvalidOperationException("Pedido não encontrado ou já finalizado");

        order.Customer.Name = args.Name;
        order.Customer.NationalDocument = args.NationalDocument;
        order.Customer.Category = args.Category;

        context.Update(order);
        context.SaveChanges();

        await ProcessExternalInvoicing(order);

        return mapper.Map<CustomerModel>(order.Customer);
    }

    public async Task<OrderItemModel> EditOrderItemAsync(Guid orderId, int itemId, OrderItemPutArgs args)
    {
        new OrderItemPutArgs.Validator().ValidateAndThrow(args);

        //var items = await context
        //    .Order
        //    .Include(o => o.OrderItems)
        //    .Where(o => o.Status == OrderStatus.PENDENTE)
        //    .Where(o => o.OrderId == orderId)
        //    .SelectMany(o => o.OrderItems)
        //    .ToListAsync();

        //var item = items
        //    .FirstOrDefault(i => i.ItemId == itemId)
        //    ?? throw new InvalidOperationException("Item não encontrado ou pedido já finalizado");

        var item = await context
            .OrderItem
            .Include(i => i.Order)
            .Where(i => i.OrderId == orderId)
            .Where(i => i.ItemId == itemId)
            .Where(i => i.Order.Status == OrderStatus.PENDENTE)
            .FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Item não encontrado ou pedido já finalizado");

        item.Description = args.Description;
        item.Quantity = args.Quantity;
        item.UnitPrice = args.UnitPrice;
        
        var subTotal = item.Order.OrderItems.Sum(i => i.Quantity * i.UnitPrice);

        item.Order.SubTotal = decimal.Round(subTotal, 2);
        item.Order.Discounts = decimal.Round(item
            .Order
            .Customer
            .Category
            .GetDiscountAmount(subTotal), 2);
        item.Order.Total = decimal.Round(subTotal - item.Order.Discounts, 2);

        context.Update(item);
        context.SaveChanges();

        await ProcessExternalInvoicing(item.Order);

        return mapper.Map<OrderItemModel>(item);
    }

    private async Task ProcessExternalInvoicing(Order order)
    {
        try
        {
            var summaryArgs = new OrderSummaryPostArgs
            {
                OrderId = order.OrderId,
                SubTotal = decimal.Round(order.SubTotal, 2),
                Discounts = decimal.Round(order.Discounts, 2),
                Total = decimal.Round(order.Total, 2),
                OrderItems = order.OrderItems.Select(i => new OrderSummaryItemPostArgs
                {
                    Quantity = i.Quantity,
                    UnitPrice = decimal.Round(i.UnitPrice, 2)
                }).ToList()
            };

            var json = JsonSerializer.Serialize(summaryArgs);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync("/api/vendas", content);

            if (response.IsSuccessStatusCode)
            {
                var msg = await response.Content.ReadAsStringAsync();
                throw new Exception(msg);
            }

            order.Status = OrderStatus.CONCLUIDO;

            context.Update(order);
            context.SaveChanges();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Não foi possível efetuar a venda. O serviço de faturamento pode estar indisponível no momento.");
        }
    }
}
