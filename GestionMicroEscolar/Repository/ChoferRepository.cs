using Data;
using Domain.Entidades;
using GestionMicroEscolar.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace GestionMicroEscolar.Repository
{
    public class ChoferRepository : IChoferRepository
    {
        private readonly AppDbContext _db;

        public ChoferRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Chofer?> GetByDniAsync(string dni) =>
            await _db.Choferes
                .Include(c => c.Micro)
                .FirstOrDefaultAsync(c => c.Dni == dni);

        public async Task<List<Chofer>> GetAllAsync() =>
            await _db.Choferes.ToListAsync();

        public async Task AddAsync(Chofer chofer)
        {
            _db.Choferes.Add(chofer);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Chofer chofer)
        {
            _db.Choferes.Update(chofer);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Chofer chofer)
        {
            _db.Choferes.Remove(chofer);
            await _db.SaveChangesAsync();
        }
    }
}
