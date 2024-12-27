using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System.Text;

namespace Teste.Infrastructure.Context;

// Essa factory é necessária pois não temos acesso a connection string que está no projeto API
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

        StringBuilder conn = new();

        conn.Append("Host=localhost;");
        conn.Append("Port=5432;");
        conn.Append("Database=db_ecommerce;");
        conn.Append("Username=postgres;");
        conn.Append("Password=testesti3");

        optionsBuilder.UseNpgsql(conn.ToString());

        return new AppDbContext(optionsBuilder.Options);
    }
}
