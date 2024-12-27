using System.Text.Json.Serialization;

namespace Teste.Shared.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CustomerCategory
{
    // Cliente regular: 5% de desconto se o valor total da venda for maior que R$ 500,00
    REGULAR,
    // Cliente premium: 10% de desconto se o valor total da venda for maior que R$ 300,00
    PREMIUM,
    // Cliente VIP: 15% de desconto para qualquer valor de venda
    VIP,
}
