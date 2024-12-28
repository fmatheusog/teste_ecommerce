using Teste.Shared.Args;
using Teste.Shared.Models;

namespace Teste.Application.Abstractions;

public interface IOrderService
{
    Task<IReadOnlyCollection<OrderModel>> GetOrdersAsync();
    Task<OrderModel> GetOrderByIdAsync(Guid id);
    Task<OrderModel> ProcessOrderAsync(ProcessOrderPostArgs args);
    Task<OrderModel> EditOrderAsync(Guid orderId, OrderPutArgs args);
    Task<CustomerModel> EditCustomerAsync(Guid orderId, CustomerPutArgs args);
    Task<OrderItemModel> EditOrderItemAsync(Guid orderId, int itemId, OrderItemPutArgs args);
}
