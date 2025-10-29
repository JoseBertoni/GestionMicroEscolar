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

            // Desasignar automáticamente todos los chicos del micro
            foreach (var chico in micro.Chicos)
            {
                chico.MicroPatente = null;
                await _chicos.UpdateAsync(chico);
            }

            // Desasignar automáticamente el chofer del micro
            if (micro.Chofer is not null)
            {
                micro.Chofer.MicroPatente = null;
                await _choferes.UpdateAsync(micro.Chofer);
            }

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

            chofer.MicroPatente = patente;
            await _choferes.UpdateAsync(chofer);
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

        public async Task DesasignarChoferAsync(string patente)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new Exception("El micro no existe.");

            if (micro.Chofer is null)
                throw new Exception("Este micro no tiene chofer asignado.");

            micro.Chofer.MicroPatente = null;
            await _choferes.UpdateAsync(micro.Chofer);
        }

        public async Task DesasignarChicoAsync(string dniChico)
        {
            var chico = await _chicos.GetByDniAsync(dniChico)
                ?? throw new Exception("El chico no existe.");

            if (chico.MicroPatente is null)
                throw new Exception("Este chico no está asignado a ningún micro.");

            chico.MicroPatente = null;
            await _chicos.UpdateAsync(chico);
        }

        public async Task DesasignarTodosLosChicosAsync(string patente)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new Exception("El micro no existe.");

            if (micro.Chicos.Count == 0)
                throw new Exception("Este micro no tiene chicos asignados.");

            foreach (var chico in micro.Chicos)
            {
                chico.MicroPatente = null;
                await _chicos.UpdateAsync(chico);
            }
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
