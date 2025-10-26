using System.ComponentModel.DataAnnotations;

namespace Domain.Entidades
{
    public class Chofer
    {
        [Key]
        public string Dni { get; set; } = default!;
        public string Nombre { get; set; } = default!;

        public Micro? Micro { get; set; }
    }
}
