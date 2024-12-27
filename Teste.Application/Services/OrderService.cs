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

namespace Teste.Application.Services;

public class OrderService(
    AppDbContext context,
    IMapper mapper,
    ILogger<OrderService> logger,
    HttpClient httpClient) : IOrderService
{
    public Task<OrderModel> EditOrderAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<OrderModel> GetOrderByIdAsync(Guid orderId)
    {
        var order = await context
            .Order
            .FirstOrDefaultAsync(o => o.Id == orderId);

        var orderModel = mapper.Map<OrderModel>(order);

        return orderModel;
    }

    public async Task<IReadOnlyCollection<OrderModel>> GetOrdersAsync()
    {
        var orders = await context
            .Order
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
            .ToListAsync();

        var ordersModel = mapper.Map<OrderModel[]>(orders);

        return ordersModel;
    }

    public async Task<OrderModel> ProcessOrderAsync(ProcessOrderPostArgs args)
    {
        try
        {
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

            var orderModel = mapper.Map<OrderModel>(order);

            return orderModel;
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
            logger.LogWarning(ex, "Não foi possível efetuar a venda. O serviço de faturamento pode estar indisponível no momento.");
        }
    }
}
