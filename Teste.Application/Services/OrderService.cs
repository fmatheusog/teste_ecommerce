using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Teste.Application.Abstractions;
using Teste.Infrastructure.Context;
using Teste.Infrastructure.Entities;
using Teste.Shared;
using Teste.Shared.Args;
using Teste.Shared.Enums;
using Teste.Shared.Models;

namespace Teste.Application.Services;

public class OrderService(AppDbContext context, IMapper mapper, ILogger logger) : IOrderService
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

            order.Total = decimal.Round(subTotal - order.Discounts);

            await context.Database.BeginTransactionAsync();
            await context.AddAsync(order);
            await context.SaveChangesAsync();
            await context.Database.CommitTransactionAsync();

            var orderModel = mapper.Map<OrderModel>(order);

            return orderModel;
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
            await context.Database.RollbackTransactionAsync();
            throw;
        }
    }
}
