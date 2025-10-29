# Gestión Micro Escolar - Docker Startup Script

Write-Host "Iniciando Gestión Micro Escolar con Docker..." -ForegroundColor Green

# Verificar que Docker esté disponible
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Verificar que Docker Compose esté disponible
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker Compose no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

Write-Host "Construyendo e iniciando los contenedores..." -ForegroundColor Yellow
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "¡Aplicación iniciada correctamente!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
    Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Base de datos: localhost:1433" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para ver los logs de los contenedores, usa:" -ForegroundColor Yellow
    Write-Host "docker-compose logs -f" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para detener la aplicación, usa:" -ForegroundColor Yellow
    Write-Host "docker-compose down" -ForegroundColor Gray
} else {
    Write-Host "Error al iniciar los contenedores" -ForegroundColor Red
    exit 1
}