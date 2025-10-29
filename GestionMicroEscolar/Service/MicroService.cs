using Domain.DTO;
using Domain.Entidades;
using GestionMicroEscolar.Repository.Interface;
using GestionMicroEscolar.Exceptions;

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
                throw new MicroAlreadyExistsException(patente);

            var micro = new Micro { Patente = patente };
            await _micros.AddAsync(micro);
        }

        public async Task ActualizarAsync(string patente)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new MicroNotFoundException(patente);

            // Simplemente valida que el micro existe. 
            // Las asignaciones de chofer y chicos se manejan por endpoints específicos
            await _micros.UpdateAsync(micro);
        }

        public async Task EliminarAsync(string patente)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new MicroNotFoundException(patente);

            // Desasignar automáticamente todos los chicos del micro
            // Crear una copia de la lista para evitar problemas de concurrencia
            var chicosADesasignar = micro.Chicos.ToList();
            foreach (var chico in chicosADesasignar)
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
                ?? throw new MicroNotFoundException(patente);

            var chofer = await _choferes.GetByDniAsync(dniChofer)
                ?? throw new ChoferNotFoundException(dniChofer);

            // Verificar si el chofer ya está asignado a otro micro
            var microConChofer = (await _micros.GetAllAsync())
                .FirstOrDefault(m => m.Chofer?.Dni == dniChofer && m.Patente != patente);
            
            if (microConChofer is not null)
                throw new ChoferAlreadyAssignedException(dniChofer, microConChofer.Patente);

            chofer.MicroPatente = patente;
            await _choferes.UpdateAsync(chofer);
        }

        public async Task AgregarChicoAsync(string patente, string dniChico)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new MicroNotFoundException(patente);

            var chico = await _chicos.GetByDniAsync(dniChico)
                ?? throw new ChicoNotFoundException(dniChico);

            if (chico.MicroPatente is not null)
            {
                var microActual = await _micros.GetByPatenteAsync(chico.MicroPatente);
                throw new ChicoAlreadyAssignedException(dniChico, microActual!.Patente);
            }

            chico.MicroPatente = patente;
            await _chicos.UpdateAsync(chico);
        }

        public async Task DesasignarChoferAsync(string patente)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new MicroNotFoundException(patente);

            if (micro.Chofer is null)
                throw new ChoferNotAssignedException(patente);

            micro.Chofer.MicroPatente = null;
            await _choferes.UpdateAsync(micro.Chofer);
        }

        public async Task DesasignarChicoAsync(string dniChico)
        {
            var chico = await _chicos.GetByDniAsync(dniChico)
                ?? throw new ChicoNotFoundException(dniChico);

            if (chico.MicroPatente is null)
                throw new ChicoNotAssignedException(dniChico);

            chico.MicroPatente = null;
            await _chicos.UpdateAsync(chico);
        }

        public async Task DesasignarTodosLosChicosAsync(string patente)
        {
            var micro = await _micros.GetByPatenteAsync(patente)
                ?? throw new MicroNotFoundException(patente);

            if (micro.Chicos.Count == 0)
                throw new NoChildrenAssignedException(patente);

            // Crear una copia de la lista para evitar problemas de concurrencia
            var chicosADesasignar = micro.Chicos.ToList();
            
            foreach (var chico in chicosADesasignar)
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
