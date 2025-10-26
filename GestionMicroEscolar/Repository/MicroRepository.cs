using Data;
using Domain.Entidades;
using GestionMicroEscolar.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace GestionMicroEscolar.Repository
{
    public class MicroRepository : IMicroRepository
    {
        private readonly AppDbContext _db;

        public MicroRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Micro?> GetByPatenteAsync(string patente) =>
            await _db.Micros
                .Include(m => m.Chofer)
                .Include(m => m.Chicos)
                .FirstOrDefaultAsync(m => m.Patente == patente);

        public async Task<List<Micro>> GetAllAsync() =>
            await _db.Micros
                .Include(m => m.Chofer)
                .Include(m => m.Chicos)
                .ToListAsync();

        public async Task AddAsync(Micro micro)
        {
            _db.Micros.Add(micro);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Micro micro)
        {
            _db.Micros.Update(micro);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Micro micro)
        {
            _db.Micros.Remove(micro);
            await _db.SaveChangesAsync();
        }
    }
}
