using Domain.DTO;
using GestionMicroEscolar.Service;
using Microsoft.AspNetCore.Mvc;

namespace GestionMicroEscolar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MicroController : ControllerBase
    {
        private readonly MicroService _service;
        public MicroController(MicroService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<MicroDto>>> Listar()
       => Ok(await _service.ListarAsync());

        [HttpGet("{patente}")]
        public async Task<ActionResult<MicroDto>> Obtener(string patente)
        {
            var micro = await _service.ObtenerAsync(patente);
            return micro is null ? NotFound() : Ok(micro);
        }

        [HttpPost]
        public async Task<IActionResult> Crear(string patente)
        {
            await _service.CrearAsync(patente);
            return Created($"api/micros/{patente}", new { patente });
        }

        [HttpDelete("{patente}")]
        public async Task<IActionResult> Eliminar(string patente)
        {
            await _service.EliminarAsync(patente);
            return NoContent();
        }

        [HttpPost("{patente}/asignar-chofer/{dniChofer}")]
        public async Task<IActionResult> AsignarChofer(string patente, string dniChofer)
        {
            await _service.AsignarChoferAsync(patente, dniChofer);
            return Ok();
        }

        [HttpPost("{patente}/agregar-chico/{dniChico}")]
        public async Task<IActionResult> AgregarChico(string patente, string dniChico)
        {
            await _service.AgregarChicoAsync(patente, dniChico);
            return Ok();
        }

        [HttpDelete("{patente}/desasignar-chofer")]
        public async Task<IActionResult> DesasignarChofer(string patente)
        {
            await _service.DesasignarChoferAsync(patente);
            return Ok();
        }

        [HttpDelete("chico/{dniChico}/desasignar")]
        public async Task<IActionResult> DesasignarChico(string dniChico)
        {
            await _service.DesasignarChicoAsync(dniChico);
            return Ok();
        }

        [HttpDelete("{patente}/desasignar-todos-chicos")]
        public async Task<IActionResult> DesasignarTodosLosChicos(string patente)
        {
            await _service.DesasignarTodosLosChicosAsync(patente);
            return Ok();
        }
    }
}
