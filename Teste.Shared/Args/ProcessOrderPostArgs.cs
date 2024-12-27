using FluentValidation;
using System.Text.Json.Serialization;

namespace Teste.Shared.Args;

public sealed class ProcessOrderPostArgs
{
    [JsonPropertyName("identificador")]
    public required Guid OrderId { get; set; }
    [JsonPropertyName("dataVenda")]
    public required DateTime OrderDate { get; set; }
    [JsonPropertyName("cliente")]
    public required CustomerPostArgs Customer { get; set; }
    [JsonPropertyName("itens")]
    public IEnumerable<OrderItemPostArgs> Items { get; set; } = [];

    public class Validator : AbstractValidator<ProcessOrderPostArgs>
    {
        public Validator()
        {
            RuleFor(c => c.OrderId)
                .NotEmpty()
                .WithMessage("Identificador obrigatório");

            RuleFor(c => c.OrderDate)
                .NotEmpty()
                .WithMessage("Data da venda obrigatória");

            RuleFor(c => c.Customer)
                .NotNull()
                .WithMessage("Cliente é obrigatório");

            RuleFor(c => c.Items)
                .NotEmpty()
                .WithMessage("É necessário informar pelo menos um produto");
        }
    }
}
