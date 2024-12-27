using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Teste.Infrastructure.Entities;

namespace Teste.Infrastructure.EntitiesMapping;

internal sealed class OrderEntityMapping : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder
            .Property(o => o.SubTotal)
            .HasColumnType("decimal(16,2)");

        builder
            .Property(o => o.Discounts)
            .HasColumnType("decimal(16,2)");

        builder
            .Property(o => o.Total)
            .HasColumnType("decimal(16,2)");

        builder
            .Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(30)
            .IsRequired();

        builder
            .HasOne(o => o.Customer)
            .WithMany()
            .HasForeignKey(c => c.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(o => o.OrderItems)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade); // Exclui os itens do pedido quando o pedido for excluído
    }
}