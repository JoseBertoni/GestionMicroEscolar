using Data;
using GestionMicroEscolar.Repository;
using GestionMicroEscolar.Repository.Interface;
using GestionMicroEscolar.Service;
using GestionMicroEscolar.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorios
builder.Services.AddScoped<IMicroRepository, MicroRepository>();
builder.Services.AddScoped<IChoferRepository, ChoferRepository>();
builder.Services.AddScoped<IChicoRepository, ChicoRepository>();
builder.Configuration.AddJsonFile("appsettings.Docker.json", optional: true);

// Servicios
builder.Services.AddScoped<MicroService>();
builder.Services.AddScoped<ChoferService>();
builder.Services.AddScoped<ChicoService>();

var app = builder.Build();

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
app.UseAuthorization();
app.MapControllers();
app.Run();
