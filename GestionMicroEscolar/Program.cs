using Data;
using GestionMicroEscolar.Repository;
using GestionMicroEscolar.Repository.Interface;
using GestionMicroEscolar.Service;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

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
