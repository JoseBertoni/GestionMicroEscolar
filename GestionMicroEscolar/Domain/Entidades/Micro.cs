using System.ComponentModel.DataAnnotations;

namespace Domain.Entidades
{
    public class Micro
    {
        [Key]
        public string Patente { get; set; } = default!;

        public Chofer? Chofer { get; set; }

        public List<Chico> Chicos { get; set; } = new();
    }
}
