# Gestión Micro Escolar - Docker Stop Script

Write-Host "Deteniendo Gestión Micro Escolar..." -ForegroundColor Yellow

# Verificar que Docker Compose esté disponible
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker Compose no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Detener los contenedores
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "Contenedores detenidos correctamente" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Para eliminar también los volúmenes de datos, usa:" -ForegroundColor Yellow
    Write-Host "docker-compose down -v" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para eliminar también las imágenes construidas, usa:" -ForegroundColor Yellow
    Write-Host "docker-compose down --rmi all" -ForegroundColor Gray
} else {
    Write-Host "Error al detener los contenedores" -ForegroundColor Red
    exit 1
}