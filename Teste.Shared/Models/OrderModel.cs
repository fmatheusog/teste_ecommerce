using System.Text.Json.Serialization;
using Teste.Shared.Enums;

namespace Teste.Shared.Models;

public sealed class OrderModel
{
    [JsonPropertyName("identificador")]
    public Guid OrderId { get; set; }
    [JsonPropertyName("dataVenda")]
    public DateTime OrderDate { get; set; }
    [JsonPropertyName("cliente")]
    public CustomerModel Customer { get; set; } = default!;
    [JsonPropertyName("itens")]
    public IEnumerable<OrderItemModel> OrderItems { get; set; } = default!;
    [JsonPropertyName("subtotal")]
    public decimal SubTotal { get; set; }

    [JsonPropertyName("desconto")]
    public decimal Discounts { get; set; }

    [JsonPropertyName("valorTotal")]
    public decimal Total { get; set; }

    [JsonPropertyName("status")]
    public OrderStatus Status { get; set; }

}
