using System.ComponentModel.DataAnnotations;

namespace GestionMicroEscolar.Domain.DTO
{
    public class UpdateUserDto
    {
        [MaxLength(100)]
        public string? Nombre { get; set; }

        [EmailAddress]
        [MaxLength(255)]
        public string? Email { get; set; }
    }
}