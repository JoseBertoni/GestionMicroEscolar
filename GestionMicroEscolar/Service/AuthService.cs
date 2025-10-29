using GestionMicroEscolar.Domain.DTO;
using GestionMicroEscolar.Domain.Entidades;
using GestionMicroEscolar.Repository.Interface;
using GestionMicroEscolar.Service.Interface;
using GestionMicroEscolar.Exceptions;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace GestionMicroEscolar.Service
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUsuarioRepository usuarioRepository, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var usuario = await _usuarioRepository.GetByEmailAsync(loginDto.Email);
            
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, usuario.Password))
            {
                throw new BusinessException("AUTH_INVALID_CREDENTIALS", "Email o contraseña incorrectos");
            }

            if (!usuario.Activo)
            {
                throw new BusinessException("AUTH_USER_INACTIVE", "Usuario desactivado");
            }

            var token = GenerateJwtToken(usuario);
            var expiration = DateTime.UtcNow.AddHours(24);

            return new AuthResponseDto
            {
                Token = token,
                Expiration = expiration,
                User = new UserInfoDto
                {
                    Id = usuario.Id,
                    Nombre = usuario.Nombre,
                    Email = usuario.Email
                }
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            if (await _usuarioRepository.EmailExistsAsync(registerDto.Email))
            {
                throw new BusinessException("AUTH_EMAIL_EXISTS", "El email ya está registrado");
            }

            var usuario = new Usuario
            {
                Nombre = registerDto.Nombre,
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                FechaCreacion = DateTime.UtcNow,
                Activo = true
            };

            var usuarioCreado = await _usuarioRepository.CreateAsync(usuario);

            var token = GenerateJwtToken(usuarioCreado);
            var expiration = DateTime.UtcNow.AddHours(24);

            return new AuthResponseDto
            {
                Token = token,
                Expiration = expiration,
                User = new UserInfoDto
                {
                    Id = usuarioCreado.Id,
                    Nombre = usuarioCreado.Nombre,
                    Email = usuarioCreado.Email
                }
            };
        }

        private string GenerateJwtToken(Usuario usuario)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey no configurada");
            var issuer = jwtSettings["Issuer"] ?? throw new InvalidOperationException("JWT Issuer no configurado");
            var audience = jwtSettings["Audience"] ?? throw new InvalidOperationException("JWT Audience no configurado");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.Nombre),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}