using System.Text.Json.Serialization;
using Teste.Shared.Enums;

namespace Teste.Shared.Models;

public sealed class OrderModel
{
    [JsonPropertyName("identificador")]
    public Guid OrderId { get; set; }
    [JsonPropertyName("dataVenda")]
    public DateTime OrderDate { get; set; }
    [JsonPropertyName("cpf")]
    public CustomerModel Customer { get; set; } = default!;
    [JsonPropertyName("categoria")]
    public IEnumerable<OrderItemModel> OrderItems { get; set; } = default!;
}
