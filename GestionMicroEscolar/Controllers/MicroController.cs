using Domain.DTO;
using GestionMicroEscolar.Service;
using GestionMicroEscolar.Exceptions;
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

        [HttpPut("{patente}")]
        public async Task<IActionResult> Actualizar(string patente)
        {
            await _service.ActualizarAsync(patente);
            return Ok(new { patente });
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
            Console.WriteLine($"=== CONTROLADOR: Asignando chofer {dniChofer} al micro {patente} ===");
            try
            {
                await _service.AsignarChoferAsync(patente, dniChofer);
                Console.WriteLine("=== CONTROLADOR: Asignación exitosa ===");
                return Ok();
            }
            catch (ChoferAlreadyAssignedException ex)
            {
                Console.WriteLine($"=== CONTROLADOR: ChoferAlreadyAssignedException - {ex.UserMessage} ===");
                var response = new { message = ex.UserMessage };
                Console.WriteLine($"=== CONTROLADOR: Enviando respuesta: {System.Text.Json.JsonSerializer.Serialize(response)} ===");
                return Conflict(response);
            }
            catch (MicroNotFoundException ex)
            {
                Console.WriteLine($"=== CONTROLADOR: MicroNotFoundException - {ex.UserMessage} ===");
                return NotFound(new { message = ex.UserMessage });
            }
            catch (ChoferNotFoundException ex)
            {
                Console.WriteLine($"=== CONTROLADOR: ChoferNotFoundException - {ex.UserMessage} ===");
                return NotFound(new { message = ex.UserMessage });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"=== CONTROLADOR: Exception genérica - {ex.Message} ===");
                return StatusCode(500, new { message = "Error interno del servidor: " + ex.Message });
            }
        }

        [HttpPost("{patente}/agregar-chico/{dniChico}")]
        public async Task<IActionResult> AgregarChico(string patente, string dniChico)
        {
            try
            {
                await _service.AgregarChicoAsync(patente, dniChico);
                return Ok();
            }
            catch (ChicoAlreadyAssignedException ex)
            {
                return Conflict(new { message = ex.UserMessage });
            }
            catch (MicroNotFoundException ex)
            {
                return NotFound(new { message = ex.UserMessage });
            }
            catch (ChicoNotFoundException ex)
            {
                return NotFound(new { message = ex.UserMessage });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor: " + ex.Message });
            }
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
