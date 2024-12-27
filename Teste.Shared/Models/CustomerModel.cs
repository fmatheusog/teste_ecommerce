using System.Text.Json.Serialization;
using Teste.Shared.Enums;

namespace Teste.Shared.Models;

public sealed class CustomerModel
{
    [JsonPropertyName("clienteId")]
    public Guid CustomerId { get; set; }
    [JsonPropertyName("nome")]
    public string Name { get; set; }
    [JsonPropertyName("cpf")]
    public string NationalDocument { get; set; }
    [JsonPropertyName("categoria")]
    public CustomerCategory Category { get; set; }
}
