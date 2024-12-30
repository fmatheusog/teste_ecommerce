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

    public async Task<IReadOnlyCollection<ReprocessOrderQueueItemModel>> GetReprocessQueueAsync()
    {
        var orders = await context
            .ReprocessingOrdersQueue
            .ToListAsync();

        return mapper.Map<ReprocessOrderQueueItemModel[]>(orders);
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

    public async Task<OrderModel> ProcessOrderWithErrorAsync(ProcessOrderPostArgs args)
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

            var queueItem = new ReprocessingOrdersQueue
            {
                OrderId = order.OrderId,
                OrderData = json,
            };

            context.ReprocessingOrdersQueue.Add(queueItem);

            await context.Database.BeginTransactionAsync();
            await context.AddAsync(order);
            await context.SaveChangesAsync();
            await context.Database.CommitTransactionAsync();

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

        context.Update(order);
        context.SaveChanges();

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

        return mapper.Map<CustomerModel>(order.Customer);
    }

    public async Task<OrderItemModel> EditOrderItemAsync(Guid orderId, int itemId, OrderItemPutArgs args)
    {
        new OrderItemPutArgs.Validator().ValidateAndThrow(args);

        var order = await context
            .Order
            .Include(o => o.OrderItems)
            .Include(o => o.Customer)
            .Where(o => o.Status == OrderStatus.PENDENTE)
            .FirstOrDefaultAsync(o => o.OrderId == orderId)
            ?? throw new InvalidOperationException("Pedido não encontrado ou já finalizado");

        var item = order.OrderItems.FirstOrDefault(i => i.ItemId == itemId)
            ?? throw new InvalidOperationException($"Item não encontrado no pedido: {orderId}");

        item.Description = args.Description;
        item.Quantity = args.Quantity;
        item.UnitPrice = args.UnitPrice;

        var subTotal = order.OrderItems.Sum(i => i.Quantity * i.UnitPrice);

        order.SubTotal = decimal.Round(subTotal, 2);
        order.Discounts = decimal.Round(order.Customer.Category.GetDiscountAmount(subTotal), 2);
        order.Total = decimal.Round(subTotal - order.Discounts, 2);

        context.Update(order);
        await context.SaveChangesAsync();

        return mapper.Map<OrderItemModel>(item);
    }

    public async Task<OrderModel> ReprocessOrderAsync(Guid orderId)
    {
        var order = await context
            .Order
            .Include(o => o.OrderItems)
            .Include(o => o.Customer)
            .Where(o => o.Status == OrderStatus.PENDENTE)
            .FirstOrDefaultAsync(o => o.OrderId == orderId)
            ?? throw new InvalidOperationException("Pedido não encontrado ou já finalizado");

        await ProcessExternalInvoicing(order);

        return mapper.Map<OrderModel>(order);
    }

    private async Task ProcessExternalInvoicing(Order order)
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

        try
        {
            var response = await httpClient.PostAsync("/api/vendas", content);

            if (!response.IsSuccessStatusCode)
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
            logger.LogWarning(ex, "Não foi possível efetuar a venda. O serviço de faturamento pode estar indisponível no momento. O pedido foi enviado para a fila de processamento.");

            var queueItem = new ReprocessingOrdersQueue
            {
                OrderId = order.OrderId,
                OrderData = json,
            };

            context.ReprocessingOrdersQueue.Add(queueItem);
            await context.SaveChangesAsync();
        }
    }
}
