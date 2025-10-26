using Data;
using Domain.Entidades;
using GestionMicroEscolar.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace GestionMicroEscolar.Repository
{
    public class ChicoRepository : IChicoRepository
    {
        private readonly AppDbContext _db;

        public ChicoRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Chico?> GetByDniAsync(string dni) =>
            await _db.Chicos
                .Include(c => c.Micro)
                .FirstOrDefaultAsync(c => c.Dni == dni);

        public async Task<List<Chico>> GetAllAsync() =>
            await _db.Chicos.ToListAsync();

        public async Task AddAsync(Chico chico)
        {
            _db.Chicos.Add(chico);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Chico chico)
        {
            _db.Chicos.Update(chico);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Chico chico)
        {
            _db.Chicos.Remove(chico);
            await _db.SaveChangesAsync();
        }
    }
}
