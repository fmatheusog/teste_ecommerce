using System.Text.Json.Serialization;

namespace Teste.Shared.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum OrderStatus
{
    PENDENTE,
    CONCLUIDO,
    CANCELADO,
}
