using Domain.DTO;
using Domain.Entidades;
using GestionMicroEscolar.Repository.Interface;

namespace GestionMicroEscolar.Service
{
    public class ChicoService
    {
        private readonly IChicoRepository _repo;

        public ChicoService(IChicoRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ChicoDto>> ListarAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(c => new ChicoDto { Dni = c.Dni, Nombre = c.Nombre }).ToList();
        }

        public async Task<ChicoDto?> ObtenerAsync(string dni)
        {
            var c = await _repo.GetByDniAsync(dni);
            return c is null ? null : new ChicoDto { Dni = c.Dni, Nombre = c.Nombre };
        }

        public async Task CrearAsync(ChicoDto dto)
        {
            if (await _repo.GetByDniAsync(dto.Dni) is not null)
                throw new Exception("El alumno ya existe.");

            await _repo.AddAsync(new Chico { Dni = dto.Dni, Nombre = dto.Nombre });
        }

        public async Task EliminarAsync(string dni)
        {
            var c = await _repo.GetByDniAsync(dni)
                ?? throw new Exception("El alumno no existe.");

            if (c.Micro?.Patente is not null)
                throw new Exception("No se puede eliminar un alumno asignado a un micro.");

            await _repo.DeleteAsync(c);
        }
    }
}
