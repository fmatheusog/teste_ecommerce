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

        conn.Append("Server=localhost,1433;");
        conn.Append("Database=teste_db;");
        conn.Append("User ID=sa;");
        conn.Append("Password=1q2w3e4r@#$;");
        conn.Append("Trusted_Connection=False;");
        conn.Append("Trust Server Certificate=True;");

        optionsBuilder.UseSqlServer(conn.ToString());

        return new AppDbContext(optionsBuilder.Options);
    }
}
