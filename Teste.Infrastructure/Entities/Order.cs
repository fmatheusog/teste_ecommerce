using Teste.Shared.Enums;

namespace Teste.Infrastructure.Entities;

public sealed class Order : BaseEntity<Guid>
{
    public Guid OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal SubTotal { get; set; }
    public decimal Discounts { get; set; }
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; }

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;

    public IEnumerable<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
