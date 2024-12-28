using FluentValidation;
using System.Text.Json.Serialization;

namespace Teste.Shared.Args;

public sealed class OrderItemPutArgs
{
    [JsonPropertyName("descricao")]
    public required string Description { get; set; }
    [JsonPropertyName("quantidade")]
    public required decimal Quantity { get; set; }
    [JsonPropertyName("precoUnitario")]
    public required decimal UnitPrice { get; set; }

    public class Validator : AbstractValidator<OrderItemPutArgs>
    {
        public Validator()
        {
            RuleFor(c => c.Description)
                .NotEmpty()
                .WithMessage("Descrição obrigatória");

            RuleFor(c => c.Quantity)
                .NotEmpty()
                .WithMessage("Quantidade obrigatória");

            RuleFor(c => c.UnitPrice)
                .NotEmpty()
                .WithMessage("Preço unitário obrigatório");
        }
    }
}
