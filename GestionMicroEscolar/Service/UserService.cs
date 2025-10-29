using GestionMicroEscolar.Domain.DTO;
using GestionMicroEscolar.Repository.Interface;
using GestionMicroEscolar.Service.Interface;
using GestionMicroEscolar.Exceptions;

namespace GestionMicroEscolar.Service
{
    public class UserService : IUserService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UserService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<IEnumerable<UserInfoDto>> GetAllUsersAsync()
        {
            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.Select(u => new UserInfoDto
            {
                Id = u.Id,
                Nombre = u.Nombre,
                Email = u.Email
            });
        }

        public async Task<UserInfoDto?> GetUserByIdAsync(int id)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null || !usuario.Activo)
                return null;

            return new UserInfoDto
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email
            };
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null)
            {
                throw new BusinessException("USER_NOT_FOUND", "Usuario no encontrado");
            }

            return await _usuarioRepository.DeleteAsync(id);
        }
    }
}