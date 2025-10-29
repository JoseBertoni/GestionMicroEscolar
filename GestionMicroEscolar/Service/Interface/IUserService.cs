using GestionMicroEscolar.Domain.DTO;

namespace GestionMicroEscolar.Service.Interface
{
    public interface IUserService
    {
        Task<IEnumerable<UserInfoDto>> GetAllUsersAsync();
        Task<UserInfoDto?> GetUserByIdAsync(int id);
        Task<bool> DeleteUserAsync(int id);
    }
}