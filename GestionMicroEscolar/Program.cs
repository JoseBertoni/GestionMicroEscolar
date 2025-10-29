using Data;
using GestionMicroEscolar.Repository;
using GestionMicroEscolar.Repository.Interface;
using GestionMicroEscolar.Service;
using GestionMicroEscolar.Service.Interface;
using GestionMicroEscolar.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configurar los archivos de configuración según el entorno
if (builder.Environment.EnvironmentName == "Docker")
{
    builder.Configuration.AddJsonFile("appsettings.Docker.json", optional: false, reloadOnChange: true);
}

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        var allowedOrigins = new List<string> { "http://localhost:4200" };
        
        // Agregar orígenes específicos para Docker
        if (builder.Environment.EnvironmentName == "Docker")
        {
            allowedOrigins.AddRange(new[] { 
                "http://frontend:80", 
                "http://localhost:4200" 
            });
        }
        
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorios
builder.Services.AddScoped<IMicroRepository, MicroRepository>();
builder.Services.AddScoped<IChoferRepository, ChoferRepository>();
builder.Services.AddScoped<IChicoRepository, ChicoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Configuration.AddJsonFile("appsettings.Docker.json", optional: true);

// Servicios
builder.Services.AddScoped<MicroService>();
builder.Services.AddScoped<ChoferService>();
builder.Services.AddScoped<ChicoService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey no configurada");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Aplicar migraciones automáticamente en Docker
if (app.Environment.EnvironmentName == "Docker")
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    // Reintentar conexión hasta 60 segundos
    var maxRetries = 60;
    var retryCount = 0;
    
    while (retryCount < maxRetries)
    {
        try
        {
            logger.LogInformation("Intentando conectar a la base de datos... Intento {retryCount}/{maxRetries}", retryCount + 1, maxRetries);
            
            // Verificar si la base de datos puede ser alcanzada
            await context.Database.CanConnectAsync();
            
            // Aplicar migraciones pendientes
            logger.LogInformation("Aplicando migraciones de base de datos...");
            await context.Database.MigrateAsync();
            
            logger.LogInformation("Migraciones aplicadas exitosamente.");
            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            logger.LogWarning("Error al conectar con la base de datos. Reintentando en 1 segundo... ({retryCount}/{maxRetries}). Error: {error}", retryCount, maxRetries, ex.Message);
            
            if (retryCount >= maxRetries)
            {
                logger.LogError(ex, "No se pudo conectar a la base de datos después de {maxRetries} intentos.", maxRetries);
                // No lanzar excepción, permitir que la app inicie sin DB
                break;
            }
            
            await Task.Delay(1000); // Esperar 1 segundo antes del siguiente intento
        }
    }
}

// Middleware de manejo de errores (temporalmente comentado)
// app.UseMiddleware<ErrorHandlingMiddleware>();

// CORS debe ir ANTES de Authorization
app.UseCors("AllowAngular");

// Pipeline
if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "Docker")
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
