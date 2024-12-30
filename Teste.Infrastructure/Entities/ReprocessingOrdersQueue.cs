namespace Teste.Infrastructure.Entities;

public sealed class ReprocessingOrdersQueue : BaseEntity<Guid>
{
    public DateTime CreatedAt { get; set; }
    public Guid OrderId { get; set; }
    public int Retries { get; set; }
    public required string OrderData { get; set; }

}
