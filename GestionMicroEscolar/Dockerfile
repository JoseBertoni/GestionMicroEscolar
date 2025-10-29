# Dockerfile para el backend .NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["GestionMicroEscolar/GestionMicroEscolar.csproj", "GestionMicroEscolar/"]
RUN dotnet restore "GestionMicroEscolar/GestionMicroEscolar.csproj"
COPY . .
WORKDIR "/src/GestionMicroEscolar"
RUN dotnet build "GestionMicroEscolar.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "GestionMicroEscolar.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GestionMicroEscolar.dll"]