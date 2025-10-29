# 🚌 Gestión Micro Escolar

Sistema integral de gestión para transporte escolar que permite administrar chicos, choferes y micros de manera eficiente y segura.

## 📋 Tabla de Contenidos

- [Descripción del Sistema](#-descripción-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Características de Seguridad](#-características-de-seguridad)
- [Desarrollo](#-desarrollo)
- [Solución de Problemas](#-solución-de-problemas)


## 🎯 Descripción del Sistema

**Gestión Micro Escolar** es una aplicación web completa diseñada para instituciones educativas que necesitan gestionar eficientemente su sistema de transporte escolar. El sistema permite:

### 👥 Gestión de Estudiantes (Chicos)
- Registro completo de estudiantes con datos personales
- Asignación a micros específicos
- Control de domicilios y datos de contacto
- Historial de cambios y actualizaciones

### 🚐 Gestión de Vehículos (Micros)
- Registro detallado de la flota de vehículos
- Control de capacidad y características técnicas
- Asignación de choferes responsables
- Seguimiento de estado y mantenimiento

### 👨‍💼 Gestión de Conductores (Choferes)
- Perfil completo de conductores
- Verificación de licencias y documentación
- Asignación de rutas y vehículos
- Control de experiencia y calificaciones

### 🔐 Sistema de Autenticación
- Registro seguro de usuarios
- Autenticación con JWT (JSON Web Tokens)
- Protección de rutas y recursos
- Gestión de sesiones

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 20.3.7** - Framework principal para SPA
- **Angular Material** - Biblioteca de componentes UI
- **TypeScript** - Lenguaje de programación tipado
- **RxJS** - Programación reactiva
- **HTML5 & CSS3** - Estructura y estilos
- **Nginx** - Servidor web para producción

### Backend
- **.NET 8.0** - Framework de desarrollo
- **ASP.NET Core Web API** - API RESTful
- **Entity Framework Core** - ORM para base de datos
- **JWT Bearer Authentication** - Autenticación segura
- **BCrypt** - Cifrado de contraseñas
- **AutoMapper** - Mapeo de objetos

### Base de Datos
- **SQL Server 2022** - Sistema de gestión de base de datos
- **Entity Framework Migrations** - Control de versiones de BD

### DevOps y Contenedores
- **Docker** - Containerización de aplicaciones
- **Docker Compose** - Orquestación de servicios
- **Multi-stage Docker Builds** - Optimización de imágenes

### Herramientas de Desarrollo
- **Visual Studio Code** - Editor de código
- **PowerShell** - Scripts de automatización
- **Git** - Control de versiones

## 🏗️ Arquitectura del Sistema

### Arquitectura General
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   FRONTEND      │    │     BACKEND     │    │   BASE DE       │
│   Angular +     │◄──►│   .NET Core     │◄──►│   DATOS         │
│   Material      │    │   Web API       │    │   SQL Server    │
│   (Puerto 4200) │    │   (Puerto 8080) │    │   (Puerto 1433) │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Arquitectura de Contenedores Docker
```
┌──────────────────────────────────────────────────────────────────┐
│                        Docker Compose                            │
├──────────────────┬─────────────────────┬─────────────────────────┤
│   Frontend       │      Backend        │     Base de Datos       │
│   Container      │      Container      │      Container          │
│                  │                     │                         │
│ ┌──────────────┐ │ ┌─────────────────┐ │ ┌─────────────────────┐ │
│ │   Angular    │ │ │  .NET 8.0 API   │ │ │   SQL Server 2022   │ │
│ │   Build      │ │ │                 │ │ │                     │ │
│ │      +       │ │ │   JWT Auth      │ │ │   Persistent        │ │
│ │   Nginx      │ │ │   EF Core       │ │ │   Volume            │ │
│ │   Proxy      │ │ │   Auto Migration│ │ │                     │ │
│ └──────────────┘ │ └─────────────────┘ │ └─────────────────────┘ │
│                  │                     │                         │
│ Puerto: 4200     │ Puerto: 8080       │ Puerto: 1433            │
└──────────────────┴─────────────────────┴─────────────────────────┘
```

### Flujo de Datos
```
Usuario Frontend ──► Nginx Proxy ──► API Backend ──► Entity Framework ──► SQL Server
     ▲                                      │                               │
     │                                      ▼                               │
     └──────────────── JWT Token ◄─── Auth Service ◄──────────────────────┘
```

## 📋 Requisitos Previos

### Para Ejecución con Docker (Recomendado)
- **Docker Desktop** instalado y ejecutándose
- **4GB RAM** mínimo disponible
- **10GB** espacio libre en disco
- **Puertos disponibles**: 4200, 8080, 8081, 1433

### Para Desarrollo Local
- **.NET 8.0 SDK**
- **Node.js 20+** y **npm**
- **Angular CLI** (`npm install -g @angular/cli`)
- **SQL Server 2022** o **SQL Server Express**
- **Visual Studio Code** (recomendado)

## 🚀 Instalación y Configuración

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/JoseBertoni/GestionMicroEscolar.git
cd GestionMicroEscolar
```

#### 2. Iniciar con Docker
```powershell
# Windows PowerShell
.\start-docker.ps1

# O manualmente
docker-compose up --build -d
```

#### 3. Verificar que los Servicios Estén Ejecutándose
```bash
docker-compose ps
```

#### 4. Acceder a la Aplicación
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Swagger/Documentación**: http://localhost:8080/swagger

## 🖥️ Uso del Sistema

### Primer Acceso

1. **Abrir la aplicación** en http://localhost:4200
2. **Crear una cuenta** usando el formulario de registro
3. **Iniciar sesión** con las credenciales creadas
4. **Navegar** por las diferentes secciones del sistema

### Funcionalidades Principales

#### 👥 Gestión de Estudiantes
- **Agregar**: Completar formulario con datos del estudiante
- **Listar**: Ver todos los estudiantes registrados
- **Editar**: Modificar información existente
- **Eliminar**: Dar de baja estudiantes (con confirmación)
- **Asignar**: Vincular estudiantes con micros específicos

#### 🚐 Gestión de Micros
- **Registrar**: Datos técnicos del vehículo (patente, capacidad, modelo)
- **Administrar**: Control de estado y disponibilidad
- **Asignar**: Vincular con choferes responsables
- **Reportes**: Estadísticas de uso y capacidad

#### 👨‍💼 Gestión de Choferes
- **Perfil**: Información personal y profesional
- **Licencias**: Control de validez y categorías
- **Asignaciones**: Vehículos y rutas asignadas
- **Evaluaciones**: Historial de desempeño

### Navegación
```
┌─── Header (Autenticación, Usuario) ───┐
│                                      │
├─── Sidebar Navigation ──┬─── Main ───┤
│   • Dashboard           │   Content  │
│   • Chicos              │   Area     │
│   • Choferes            │            │
│   • Micros              │            │
│   • Configuración       │            │
└─────────────────────────┴────────────┘
```

## 📁 Estructura del Proyecto

```
GestionMicroEscolar/
├── 📄 README.md                           # Documentación principal
├── 📄 README-Docker.md                    # Documentación Docker específica
├── 🐳 docker-compose.yml                 # Orquestación de servicios
├── 📜 start-docker.ps1                   # Script de inicio
├── 📜 stop-docker.ps1                    # Script de parada
│
├── 🗂️ GestionMicroEscolar/               # Backend .NET Core
│   ├── 📄 Program.cs                     # Punto de entrada de la aplicación
│   ├── 📄 appsettings.json               # Configuración desarrollo
│   ├── 📄 appsettings.Docker.json        # Configuración Docker
│   ├── 🐳 Dockerfile                     # Imagen Docker backend
│   │
│   ├── 🗂️ Controllers/                   # Controladores de API
│   │   ├── 📄 AuthController.cs          # Autenticación JWT
│   │   ├── 📄 ChicoController.cs         # CRUD Estudiantes
│   │   ├── 📄 ChoferController.cs        # CRUD Choferes
│   │   └── 📄 MicroController.cs         # CRUD Micros
│   │
│   ├── 🗂️ Domain/                        # Modelos de dominio
│   │   ├── 🗂️ Entidades/                 # Entidades principales
│   │   │   ├── 📄 Chico.cs               # Modelo Estudiante
│   │   │   ├── 📄 Chofer.cs              # Modelo Chofer
│   │   │   ├── 📄 Micro.cs               # Modelo Micro
│   │   │   └── 📄 Usuario.cs             # Modelo Usuario
│   │   └── 🗂️ DTO/                       # Objetos de transferencia
│   │       ├── 📄 ChicoDto.cs
│   │       ├── 📄 ChoferDto.cs
│   │       └── 📄 MicroDto.cs
│   │
│   ├── 🗂️ Data/                          # Contexto de base de datos
│   │   └── 📄 AppDbContext.cs            # EF Core DbContext
│   │
│   ├── 🗂️ Repository/                    # Patrón Repository
│   │   ├── 🗂️ Interface/                 # Contratos de repositorio
│   │   ├── 📄 ChicoRepository.cs
│   │   ├── 📄 ChoferRepository.cs
│   │   └── 📄 MicroRepository.cs
│   │
│   ├── 🗂️ Service/                       # Lógica de negocio
│   │   ├── 📄 ChicoService.cs
│   │   ├── 📄 ChoferService.cs
│   │   └── 📄 MicroService.cs
│   │
│   ├── 🗂️ Migrations/                    # Migraciones EF Core
│   └── 🗂️ Middleware/                    # Middleware personalizado
│       └── 📄 ErrorHandlingMiddleware.cs
│
└── 🗂️ frontend-microescolar/             # Frontend Angular
    └── 🗂️ frontend-microescolar/
        ├── 📄 package.json               # Dependencias npm
        ├── 📄 angular.json               # Configuración Angular
        ├── 🐳 Dockerfile                 # Imagen Docker frontend
        ├── 📄 nginx.conf                 # Configuración proxy
        │
        └── 🗂️ src/
            ├── 📄 index.html             # Página principal
            ├── 📄 main.ts                # Bootstrap de la app
            ├── 📄 styles.css             # Estilos globales
            │
            ├── 🗂️ environments/          # Configuraciones de entorno
            │   ├── 📄 environment.ts     # Desarrollo
            │   └── 📄 environment.prod.ts # Producción
            │
            └── 🗂️ app/
                ├── 📄 app.ts             # Componente raíz
                ├── 📄 app.routes.ts      # Configuración de rutas
                ├── 📄 app.config.ts      # Configuración de la app
                │
                ├── 🗂️ models/            # Modelos TypeScript
                │   ├── 📄 chico.model.ts
                │   ├── 📄 chofer.model.ts
                │   ├── 📄 micro.model.ts
                │   └── 📄 auth.model.ts
                │
                ├── 🗂️ services/          # Servicios Angular
                │   ├── 📄 chicos.service.ts
                │   ├── 📄 choferes.service.ts
                │   ├── 📄 micros.service.ts
                │   ├── 📄 auth.service.ts
                │   └── 📄 error-handler.service.ts
                │
                ├── 🗂️ pages/             # Páginas principales
                │   ├── 🗂️ chicos/        # Gestión estudiantes
                │   ├── 🗂️ choferes/      # Gestión choferes
                │   └── 🗂️ micros/        # Gestión micros
                │
                ├── 🗂️ shared/            # Componentes compartidos
                │   └── 🗂️ components/
                │
                └── 🗂️ shell/             # Layout principal
                    ├── 📄 shell.component.ts
                    ├── 📄 shell.component.html
                    └── 📄 shell.component.css
```

## 🔌 API Endpoints

### Autenticación
```http
POST /api/auth/register    # Registro de usuario
POST /api/auth/login       # Inicio de sesión
GET  /api/auth/profile     # Perfil del usuario (requiere JWT)
```

### Estudiantes (Chicos)
```http
GET    /api/Chico          # Listar todos los estudiantes
GET    /api/Chico/{id}     # Obtener estudiante por ID
POST   /api/Chico          # Crear nuevo estudiante
PUT    /api/Chico/{id}     # Actualizar estudiante
DELETE /api/Chico/{id}     # Eliminar estudiante
```

### Choferes
```http
GET    /api/Chofer         # Listar todos los choferes
GET    /api/Chofer/{id}    # Obtener chofer por ID
POST   /api/Chofer         # Crear nuevo chofer
PUT    /api/Chofer/{id}    # Actualizar chofer
DELETE /api/Chofer/{id}    # Eliminar chofer
```

### Micros
```http
GET    /api/Micro          # Listar todos los micros
GET    /api/Micro/{id}     # Obtener micro por ID
POST   /api/Micro          # Crear nuevo micro
PUT    /api/Micro/{id}     # Actualizar micro
DELETE /api/Micro/{id}     # Eliminar micro
```


## 🗃️ Base de Datos

### Modelo de Datos
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CHICOS    │     │   MICROS    │     │  CHOFERES   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ Id (PK)     │────►│ Id (PK)     │◄────│ Id (PK)     │
│ Nombre      │     │ Patente     │     │ Nombre      │
│ Apellido    │     │ Capacidad   │     │ Apellido    │
│ DNI         │     │ Modelo      │     │ DNI         │
│ Domicilio   │     │ ChoferAsig  │     │ Telefono    │
│ Telefono    │     │             │     │ Licencia    │
│ MicroId(FK) │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                              │
                              ▼
                    ┌─────────────┐
                    │  USUARIOS   │
                    ├─────────────┤
                    │ Id (PK)     │
                    │ Nombre      │
                    │ Email       │
                    │ Password    │
                    │ FechaCreac  │
                    │ Activo      │
                    └─────────────┘
```

### Relaciones
- **Chicos ← N:1 → Micros**: Un micro puede tener múltiples estudiantes
- **Micros ← 1:1 → Choferes**: Un chofer es asignado a un micro específico
- **Usuarios**: Tabla independiente para autenticación


## 🔐 Características de Seguridad

### Autenticación JWT
- **Tokens seguros** con firma HMAC
- **Expiración configurable** (24 horas por defecto)
- **Validación en cada request** protegido

### Cifrado de Contraseñas
- **BCrypt** para hash de contraseñas
- **Salt único** por contraseña
- **Verificación segura** en login

### Protección de API
- **Autorización Bearer** en headers
- **Validación de modelos** automática
- **Manejo de errores** centralizado
- **CORS configurado** para producción

## 💻 Desarrollo

### Comandos Útiles

#### Docker
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Reconstruir un servicio específico
docker-compose up --build frontend

# Detener todos los servicios
docker-compose down

# Limpiar volúmenes y reiniciar
docker-compose down -v
docker-compose up --build
```

#### Backend (.NET)
```bash
# Restaurar dependencias
dotnet restore

# Ejecutar en modo desarrollo
dotnet run

# Crear nueva migración
dotnet ef migrations add NombreMigracion

# Aplicar migraciones
dotnet ef database update

# Ejecutar tests
dotnet test
```

#### Frontend (Angular)
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve

# Build para producción
ng build --configuration production

# Ejecutar tests
ng test

# Analizar bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```


## 🔧 Solución de Problemas

### Problemas Comunes

#### Docker no inicia
```powershell
# Verificar Docker Desktop
docker --version
docker-compose --version

# Limpiar y reiniciar
docker system prune -f
docker-compose down -v
docker-compose up --build
```

#### Error de conexión a base de datos
```bash
# Verificar logs del contenedor
docker-compose logs db

# Reiniciar solo la base de datos
docker-compose restart db

# Conectar manualmente para debug
docker exec -it gestionmicroescolar-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword123!
```

#### Frontend no carga
```bash
# Verificar logs
docker-compose logs frontend

# Limpiar caché del navegador
# Usar modo incógnito

# Verificar proxy
curl http://localhost:4200/api/Chico
```

#### Errores de CORS
```csharp
// Verificar configuración en Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

### Estándares de Código

#### Backend (.NET)
- Segur convenciones de C#
- Usar `async/await` para operaciones asíncronas
- Implementar manejo de errores consistente
- Documentar métodos públicos con XML comments

#### Frontend (Angular)
- Segui Angular Style Guide
- Usar TypeScript estricto
- Implementar OnPush change detection cuando sea posible
- Escribir tests unitarios


**¡Gracias por usar Gestión Micro Escolar!** 🚌✨
