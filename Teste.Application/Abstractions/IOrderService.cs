using Teste.Shared.Args;
using Teste.Shared.Models;

namespace Teste.Application.Abstractions;

public interface IOrderService
{
    Task<IReadOnlyCollection<OrderModel>> GetOrdersAsync();
    Task<OrderModel> GetOrderByIdAsync(Guid id);
    Task<OrderModel> ProcessOrderAsync(ProcessOrderPostArgs args);
    Task<OrderModel> EditOrderAsync();
}
