using Domain.Entidades;
using GestionMicroEscolar.Domain.Entidades;
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
        public DbSet<Usuario> Usuarios => Set<Usuario>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar relación Micro -> Chicos (1:N)
            modelBuilder.Entity<Chico>()
                .HasOne(c => c.Micro)
                .WithMany(m => m.Chicos)
                .HasForeignKey(c => c.MicroPatente)
                .OnDelete(DeleteBehavior.SetNull);

            // Configurar relación Micro -> Chofer (1:1)
            modelBuilder.Entity<Micro>()
                .HasOne(m => m.Chofer)
                .WithOne(c => c.Micro)
                .HasForeignKey<Chofer>(c => c.MicroPatente)
                .OnDelete(DeleteBehavior.SetNull);

            // Configurar índice único para email de usuario
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}
