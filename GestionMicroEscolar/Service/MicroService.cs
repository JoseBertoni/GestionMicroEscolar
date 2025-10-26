using Domain.DTO;
using Domain.Entidades;
using GestionMicroEscolar.Repository.Interface;

namespace GestionMicroEscolar.Service
{
    public class MicroService
    {
        private readonly IMicroRepository _micros;
        private readonly IChoferRepository _choferes;
        private readonly IChicoRepository _chicos;

        public MicroService(
                IMicroRepository micros,
                IChoferRepository choferes,
                IChicoRepository chicos)
        {
            _micros = micros;
            _choferes = choferes;
            _chicos = chicos;
        }
        public async Task<List<MicroDto>> ListarAsync()
        {
            var list = await _micros.GetAllAsync();
            return list.Select(m => Map(m)).ToList();
        }

        public async Task<MicroDto?> ObtenerAsync(string patente)
        {
            var micro = await _micros.GetByPatenteAsync(patente);
            return micro is null ? null : Map(micro);
        }

        public async Task CrearAsync(string patente)
        {
            if (await _micros.GetByPatenteAsync(patente) is not null)
                throw new Exception("Ya existe un micro con esa patente.");

            var micro = new Micro { Patente = patente };
            await _micros.AddAsync(micro);
        }

        public async Task EliminarAsync(string patente)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new Exception("El micro no existe.");

            if (micro.Chicos.Count > 0)
                throw new Exception("No se puede eliminar un micro con chicos asignados.");

            await _micros.DeleteAsync(micro);
        }

        public async Task AsignarChoferAsync(string patente, string dniChofer)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new Exception("El micro no existe.");

            var chofer = await _choferes.GetByDniAsync(dniChofer)
                ?? throw new Exception("El chofer no existe.");

            if ((await _micros.GetAllAsync()).Any(m => m.Chofer?.Dni == dniChofer && m.Patente != patente))
                throw new Exception("Este chofer ya está asignado a otro micro.");

            micro.ChoferDni = dniChofer;
            await _micros.UpdateAsync(micro);
        }

        public async Task AgregarChicoAsync(string patente, string dniChico)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new Exception("El micro no existe.");

            var chico = await _chicos.GetByDniAsync(dniChico)
                ?? throw new Exception("El chico no existe.");

            if (chico.MicroPatente is not null)
                throw new Exception("El chico ya está asignado a un micro.");

            chico.MicroPatente = patente;
            await _chicos.UpdateAsync(chico);
        }

        private MicroDto Map(Micro m) =>
            new MicroDto
            {
                Patente = m.Patente,
                Chofer = m.Chofer is null ? null : new ChoferDto { Dni = m.Chofer.Dni, Nombre = m.Chofer.Nombre },
                Chicos = m.Chicos.Select(c => new ChicoDto { Dni = c.Dni, Nombre = c.Nombre }).ToList()
            };
    }
}
