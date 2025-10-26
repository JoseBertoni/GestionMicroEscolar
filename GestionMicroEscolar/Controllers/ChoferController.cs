using Domain.DTO;
using GestionMicroEscolar.Service;
using Microsoft.AspNetCore.Mvc;

namespace GestionMicroEscolar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChoferController : ControllerBase
    {
        private readonly ChoferService _service;

        public ChoferController(ChoferService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ChoferDto>>> Listar()
            => Ok(await _service.ListarAsync());

        [HttpGet("{dni}")]
        public async Task<ActionResult<ChoferDto>> Obtener(string dni)
        {
            var chofer = await _service.ObtenerAsync(dni);
            return chofer is null ? NotFound() : Ok(chofer);
        }

        [HttpPost]
        public async Task<IActionResult> Crear(ChoferDto dto)
        {
            await _service.CrearAsync(dto);
            return Created($"api/choferes/{dto.Dni}", dto);
        }

        [HttpDelete("{dni}")]
        public async Task<IActionResult> Eliminar(string dni)
        {
            await _service.EliminarAsync(dni);
            return NoContent();
        }
    }
}
