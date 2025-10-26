using Domain.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Micro> Micros => Set<Micro>();
        public DbSet<Chico> Chicos => Set<Chico>();
        public DbSet<Chofer> Choferes => Set<Chofer>();
    }
}
