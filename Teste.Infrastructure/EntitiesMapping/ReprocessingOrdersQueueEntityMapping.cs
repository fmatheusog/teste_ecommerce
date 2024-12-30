using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Teste.Infrastructure.Entities;

namespace Teste.Infrastructure.EntitiesMapping;

internal sealed class ReprocessingOrdersQueueEntityMapping : IEntityTypeConfiguration<ReprocessingOrdersQueue>
{
    public void Configure(EntityTypeBuilder<ReprocessingOrdersQueue> builder)
    {
        builder.HasKey(f => f.Id);

        builder
            .Property(f => f.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()")
                .IsRequired();

        builder
            .Property(f => f.OrderId)
            .IsRequired();

        builder
            .Property(f => f.Retries)
                .HasDefaultValue(0)
                .IsRequired();

        builder
            .Property(f => f.OrderData)
                .IsRequired();
    }
}
