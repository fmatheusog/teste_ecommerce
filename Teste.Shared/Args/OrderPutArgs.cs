using FluentValidation;
using System.Text.Json.Serialization;
using Teste.Shared.Enums;

namespace Teste.Shared.Args;

public sealed class OrderPutArgs
{
    [JsonPropertyName("dataVenda")]
    public required DateTime OrderDate { get; set; }

    public class Validator : AbstractValidator<OrderPutArgs>
    {
        public Validator()
        {
            RuleFor(o => o.OrderDate)
                .NotEmpty()
                .WithMessage("Data obrigatória")
                .Must(d => d <= DateTime.Now)
                .WithMessage("A data do pedido deve ser anterior a data de hoje");
        }
    }
}
