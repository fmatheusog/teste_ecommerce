using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Teste.Infrastructure.Entities;

namespace Teste.Infrastructure.EntitiesMapping;

internal sealed class OrderItemEntityMapping : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(i => i.Id);

        builder
            .Property(i => i.Description)
            .HasMaxLength(100)
            .IsRequired();

        builder
            .Property(i => i.Quantity)
            .HasColumnType("decimal(16,2)")
            .IsRequired();

        builder
            .Property(i => i.UnitPrice)
            .HasColumnType("decimal(16,2)")
            .IsRequired();

        builder
            .HasOne(i => i.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
