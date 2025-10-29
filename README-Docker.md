# Gestión Micro Escolar - Docker Setup

Este proyecto está completamente containerizado utilizando Docker y Docker Compose para facilitar su despliegue y desarrollo.

## Estructura de Contenedores

El proyecto se divide en **3 contenedores**:

1. **Frontend** (`gestionmicroescolar-frontend`): Aplicación Angular con Nginx
2. **Backend** (`gestionmicroescolar-api`): API .NET 8.0 con JWT
3. **Base de Datos** (`gestionmicroescolar-db`): SQL Server 2022

## Prerequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y ejecutándose
- Al menos 4GB de RAM disponible para los contenedores
- Puertos 4200, 8080, 8081 y 1433 disponibles

## Inicio Rápido

### Opción 1: Scripts de PowerShell (Recomendado para Windows)

```powershell
# Iniciar la aplicación
.\start-docker.ps1

# Detener la aplicación
.\stop-docker.ps1
```

### Opción 2: Comandos Docker Compose

```bash
# Construir e iniciar todos los contenedores
docker-compose up --build -d

# Detener todos los contenedores
docker-compose down
```

## Acceso a la Aplicación

Una vez iniciados los contenedores:

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Swagger/OpenAPI**: http://localhost:8080/swagger
- **Base de Datos**: localhost:1433
  - Usuario: `sa`
  - Contraseña: `YourPassword123!`

## Gestión de Contenedores

### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f frontend
docker-compose logs -f api
docker-compose logs -f db
```

### Reiniciar un servicio específico
```bash
docker-compose restart frontend
docker-compose restart api
docker-compose restart db
```

### Reconstruir un servicio específico
```bash
docker-compose up --build frontend
docker-compose up --build api
```

### Acceder al contenedor de la API
```bash
docker exec -it gestionmicroescolar-api bash
```

### Acceder al contenedor de la base de datos
```bash
docker exec -it gestionmicroescolar-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword123!
```

## Estructura de Archivos Docker

```
├── docker-compose.yml              # Configuración de servicios
├── start-docker.ps1               # Script de inicio (PowerShell)
├── stop-docker.ps1                # Script de parada (PowerShell)
├── GestionMicroEscolar/
│   ├── Dockerfile                 # Imagen del backend
│   ├── .dockerignore             # Archivos ignorados por Docker
│   └── appsettings.Docker.json   # Configuración para Docker
├── frontend-microescolar/frontend-microescolar/
│   ├── Dockerfile                # Imagen del frontend
│   ├── nginx.conf               # Configuración de Nginx
│   └── .dockerignore           # Archivos ignorados por Docker
```

## Configuración del Entorno

### Variables de Entorno del Backend

El archivo `appsettings.Docker.json` contiene:
- Cadena de conexión a la base de datos
- Configuración JWT
- Configuración CORS para Docker

### Proxy del Frontend

El archivo `nginx.conf` está configurado para:
- Servir la aplicación Angular en el puerto 80
- Redirigir llamadas `/api/*` al backend en `http://api:8080`
- Soporte para aplicaciones SPA (Single Page Application)

## Migraciones de Base de Datos

Las migraciones se ejecutan automáticamente al iniciar el contenedor del backend por primera vez. El código en `Program.cs` se encarga de:

1. Verificar la conexión a la base de datos
2. Ejecutar migraciones pendientes
3. Crear la base de datos si no existe

## Troubleshooting

### Los contenedores no inician
```bash
# Verificar el estado de Docker
docker --version
docker-compose --version

# Ver logs detallados
docker-compose up --build
```

### El frontend no puede conectar con el backend
- Verificar que el contenedor `api` esté ejecutándose: `docker-compose ps`
- Revisar logs del frontend: `docker-compose logs frontend`
- Verificar configuración CORS en `appsettings.Docker.json`

### Problemas con la base de datos
```bash
# Reiniciar el contenedor de la base de datos
docker-compose restart db

# Verificar logs de la base de datos
docker-compose logs db

# Conectar manualmente a la base de datos
docker exec -it gestionmicroescolar-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword123!
```

### Limpiar datos y empezar desde cero
```bash
# Detener y eliminar contenedores, redes y volúmenes
docker-compose down -v

# Eliminar imágenes construidas
docker-compose down --rmi all

# Reiniciar desde cero
docker-compose up --build
```

## Desarrollo Local

Para desarrollo local, puedes ejecutar solo algunos servicios:

```bash
# Solo la base de datos
docker-compose up db

# Backend y base de datos
docker-compose up api db

# Todos excepto frontend (para desarrollo local del frontend)
docker-compose up api db
```

## Producción

Para usar en producción, considera:

1. Cambiar las contraseñas por defecto
2. Usar variables de entorno para secretos
3. Configurar volúmenes persistentes para datos
4. Usar un proxy reverso externo (Nginx, Traefik)
5. Configurar SSL/TLS

## Soporte

Para problemas relacionados con Docker:
1. Verificar logs con `docker-compose logs`
2. Revisar la documentación de Docker
3. Verificar que los puertos no estén ocupados
4. Asegurar suficiente espacio en disco y memoria