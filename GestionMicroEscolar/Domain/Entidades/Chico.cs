using System.ComponentModel.DataAnnotations;

namespace Domain.Entidades
{
    public class Chico
    {
        [Key] 
        public string Dni { get; set; } = default!;

        public string Nombre { get; set; } = default!;

        public string? MicroPatente { get; set; }
        public Micro? Micro { get; set; }
    }
}
