using Domain.Entidades;

namespace GestionMicroEscolar.Repository.Interface
{
    public interface IChoferRepository
    {
        Task<Chofer?> GetByDniAsync(string dni);
        Task<List<Chofer>> GetAllAsync();
        Task AddAsync(Chofer chofer);
        Task UpdateAsync(Chofer chofer);
        Task DeleteAsync(Chofer chofer);
    }
}
