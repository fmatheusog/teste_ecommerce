using FluentValidation;
using System.Text.Json.Serialization;

namespace Teste.Shared.Args;

public sealed class OrderItemPostArgs
{
    [JsonPropertyName("produtoId")]
    public required int ItemId { get; set; }
    [JsonPropertyName("descricao")]
    public required string Description { get; set; }
    [JsonPropertyName("quantidade")]
    public required decimal Quantity { get; set; }
    [JsonPropertyName("precoUnitario")]
    public required decimal UnitPrice { get; set; }

    public class Validator : AbstractValidator<OrderItemPostArgs>
    {
        public Validator()
        {
            RuleFor(c => c.ItemId)
                .NotEmpty()
                .WithMessage("Id do produto obrigatório");

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
