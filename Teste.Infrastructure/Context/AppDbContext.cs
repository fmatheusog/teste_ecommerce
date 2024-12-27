using Microsoft.EntityFrameworkCore;
using Teste.Infrastructure.Entities;

namespace Teste.Infrastructure.Context;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<OrderItem> OrderItem { get; set; } = default!;
    public DbSet<Customer> Customer { get; set; } = default!;
    public DbSet<Order> Order { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(assembly: GetType().Assembly);
    }
}
