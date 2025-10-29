using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entidades
{
    public class Chofer
    {
        [Key]
        public string Dni { get; set; } = default!;
        public string Nombre { get; set; } = default!;

        [ForeignKey("Micro")]
        public string? MicroPatente { get; set; }

        public Micro? Micro { get; set; }
    }
}
