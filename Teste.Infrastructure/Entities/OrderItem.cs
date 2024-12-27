using System.Text.Json.Serialization;

namespace Teste.Infrastructure.Entities;

public sealed class OrderItem : BaseEntity<int>
{
    public int ItemId { get; set; }
    public required string Description { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total => Quantity * UnitPrice;

    public Guid OrderId { get; set; }
    [JsonIgnore]
    public Order Order { get; set; } = null!;
}
