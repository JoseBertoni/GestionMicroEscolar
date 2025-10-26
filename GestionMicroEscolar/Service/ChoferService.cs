using Domain.DTO;
using Domain.Entidades;
using GestionMicroEscolar.Repository.Interface;

namespace GestionMicroEscolar.Service
{
    public class ChoferService
    {

        private readonly IChoferRepository _repo;

        public ChoferService(IChoferRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ChoferDto>> ListarAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(c => new ChoferDto { Dni = c.Dni, Nombre = c.Nombre }).ToList();
        }

        public async Task<ChoferDto?> ObtenerAsync(string dni)
        {
            var c = await _repo.GetByDniAsync(dni);
            return c is null ? null : new ChoferDto { Dni = c.Dni, Nombre = c.Nombre };
        }

        public async Task CrearAsync(ChoferDto dto)
        {
            if (await _repo.GetByDniAsync(dto.Dni) is not null)
                throw new Exception("El chofer ya existe.");

            await _repo.AddAsync(new Chofer { Dni = dto.Dni, Nombre = dto.Nombre });
        }

        public async Task EliminarAsync(string dni)
        {
            var c = await _repo.GetByDniAsync(dni)
                ?? throw new Exception("El chofer no existe.");

            if (c.Micro is not null)
                throw new Exception("No se puede eliminar un chofer asignado a un micro.");

            await _repo.DeleteAsync(c);
        }
    }
}
