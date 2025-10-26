using Domain.Entidades;

namespace GestionMicroEscolar.Repository.Interface
{
    public interface IMicroRepository
    {
        Task<Micro?> GetByPatenteAsync(string patente);
        Task<List<Micro>> GetAllAsync();
        Task AddAsync(Micro micro);
        Task UpdateAsync(Micro micro);
        Task DeleteAsync(Micro micro);
    }
}
