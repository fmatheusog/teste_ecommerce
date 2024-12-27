using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Teste.Infrastructure.Entities;

namespace Teste.Infrastructure.EntitiesMapping;

internal sealed class CustomerEntityMapping : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.HasKey(c => c.Id);

        builder
            .Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder
            .Property(c => c.NationalDocument)
            .IsRequired()
            .HasMaxLength(14);

        builder
            .Property(c => c.Category)
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(30);
    }
}
