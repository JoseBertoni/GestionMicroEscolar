namespace Domain.DTO
{
    public class MicroDto
    {
        public string Patente { get; set; } = default!;
        public ChoferDto? Chofer { get; set; }
        public List<ChicoDto> Chicos { get; set; } = new();
    }
}
