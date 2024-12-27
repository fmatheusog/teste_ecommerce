using System.Text.Json.Serialization;

public sealed class OrderSummaryItemPostArgs
{
    [JsonPropertyName("quantidade")]
    public decimal Quantity { get; set; }

    [JsonPropertyName("precoUnitario")]
    public decimal UnitPrice { get; set; }
}