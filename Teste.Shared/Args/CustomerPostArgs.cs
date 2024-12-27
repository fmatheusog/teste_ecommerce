using FluentValidation;
using System.Text.Json.Serialization;
using Teste.Shared.Enums;

namespace Teste.Shared.Args;

public sealed class CustomerPostArgs
{
    [JsonPropertyName("clienteId")]
    public required Guid CustomerId { get; set; }
    [JsonPropertyName("nome")]
    public required string Name { get; set; }
    [JsonPropertyName("cpf")]
    public required string NationalDocument { get; set; }
    [JsonPropertyName("categoria")]
    public required CustomerCategory Category { get; set; }

    public class Validator : AbstractValidator<CustomerPostArgs>
    {
        public Validator()
        {
            RuleFor(c => c.CustomerId)
                .NotEmpty()
                .WithMessage("Id do cliente obrigatório");

            RuleFor(c => c.Name)
                .NotEmpty()
                .WithMessage("Nome do cliente obrigatório");

            RuleFor(c => c.NationalDocument)
                .NotEmpty()
                .WithMessage("CPF do cliente obrigatório");

            RuleFor(c => c.Category)
                .NotEmpty()
                .WithMessage("Categoria do cliente obrigatória")
                .IsInEnum()
                .WithMessage("Categoria inválida");
        }
    }
}
