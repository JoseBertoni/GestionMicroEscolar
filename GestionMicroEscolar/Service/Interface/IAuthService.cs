using GestionMicroEscolar.Domain.DTO;

namespace GestionMicroEscolar.Service.Interface
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    }
}