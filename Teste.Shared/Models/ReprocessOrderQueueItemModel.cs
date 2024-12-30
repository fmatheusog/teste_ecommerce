using System.Text.Json.Serialization;

namespace Teste.Shared.Models;

public sealed class ReprocessOrderQueueItemModel
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    [JsonPropertyName("orderId")]
    public Guid OrderId { get; set; }
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    public int Retries { get; set; }
}
