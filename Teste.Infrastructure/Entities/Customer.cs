using Teste.Shared.Enums;

namespace Teste.Infrastructure.Entities;

public sealed class Customer : BaseEntity<Guid>
{
    public Guid CustomerId { get; set; }
    public required string Name { get; set; }
    public required string NationalDocument { get; set; }
    public required CustomerCategory Category { get; set; }
}
