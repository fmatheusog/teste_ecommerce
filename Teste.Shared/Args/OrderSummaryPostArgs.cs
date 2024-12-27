using System.Text.Json.Serialization;

namespace Teste.Shared.Args;

public sealed class OrderSummaryPostArgs
{
    [JsonPropertyName("identificador")]
    public Guid OrderId { get; set; }

    [JsonPropertyName("subtotal")]
    public decimal SubTotal { get; set; }

    [JsonPropertyName("descontos")]
    public decimal Discounts { get; set; }

    [JsonPropertyName("valorTotal")]
    public decimal Total { get; set; }

    [JsonPropertyName("itens")]
    public IReadOnlyCollection<OrderSummaryItemPostArgs> OrderItems { get; set; }
}