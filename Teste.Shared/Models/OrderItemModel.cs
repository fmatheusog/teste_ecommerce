using System.Text.Json.Serialization;
using Teste.Shared.Enums;

namespace Teste.Shared.Models;

public sealed class OrderItemModel
{
    [JsonPropertyName("produtoId")]
    public int ItemId { get; set; }
    [JsonPropertyName("descricao")]
    public string Description { get; set; }
    [JsonPropertyName("quantidade")]
    public decimal Quantity { get; set; }
    [JsonPropertyName("precoUnitario")]
    public decimal UnitPrice { get; set; }
}
