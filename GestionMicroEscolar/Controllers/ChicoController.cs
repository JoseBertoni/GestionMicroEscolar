using Domain.DTO;
using GestionMicroEscolar.Service;
using Microsoft.AspNetCore.Mvc;

namespace GestionMicroEscolar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChicoController : ControllerBase
    {
        private readonly ChicoService _service;

        public ChicoController(ChicoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ChicoDto>>> Listar()
            => Ok(await _service.ListarAsync());

        [HttpGet("{dni}")]
        public async Task<ActionResult<ChicoDto>> Obtener(string dni)
        {
            var chico = await _service.ObtenerAsync(dni);
            return chico is null ? NotFound() : Ok(chico);
        }

        [HttpPost]
        public async Task<IActionResult> Crear(ChicoDto dto)
        {
            await _service.CrearAsync(dto);
            return Created($"api/chicos/{dto.Dni}", dto);
        }

        [HttpPut("{dni}")]
        public async Task<IActionResult> Actualizar(string dni, ChicoDto dto)
        {
            if (dni != dto.Dni)
                return BadRequest("El DNI de la URL no coincide con el DNI del objeto.");

            await _service.ActualizarAsync(dto);
            return Ok(dto);
        }

        [HttpDelete("{dni}")]
        public async Task<IActionResult> Eliminar(string dni)
        {
            await _service.EliminarAsync(dni);
            return NoContent();
        }
    }
}
