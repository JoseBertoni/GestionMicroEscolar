using Domain.Entidades;

namespace GestionMicroEscolar.Repository.Interface
{
    public interface IChicoRepository
    {
        Task<Chico?> GetByDniAsync(string dni);
        Task<List<Chico>> GetAllAsync();
        Task AddAsync(Chico chico);
        Task UpdateAsync(Chico chico);
        Task DeleteAsync(Chico chico);
    }
}
