﻿using Teste.Shared.Args;
using Teste.Shared.Models;

namespace Teste.Application.Abstractions;

public interface IOrderService
{
    Task<IReadOnlyCollection<OrderModel>> GetOrdersAsync();
    Task<IReadOnlyCollection<ReprocessOrderQueueItemModel>> GetReprocessQueueAsync();
    Task<OrderModel> GetOrderByIdAsync(Guid orderId);
    Task<OrderModel> ProcessOrderAsync(ProcessOrderPostArgs args);
    Task<OrderModel> ProcessOrderWithErrorAsync(ProcessOrderPostArgs args);
    Task<OrderModel> EditOrderAsync(Guid orderId, OrderPutArgs args);
    Task<CustomerModel> EditCustomerAsync(Guid orderId, CustomerPutArgs args);
    Task<OrderItemModel> EditOrderItemAsync(Guid orderId, int itemId, OrderItemPutArgs args);
    Task<OrderModel> ReprocessOrderAsync(Guid orderId);
}
