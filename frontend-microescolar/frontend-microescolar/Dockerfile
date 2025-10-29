# Dockerfile para el frontend Angular
# Etapa de construcción
FROM node:20-alpine AS build

WORKDIR /app

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación para producción
RUN ng build --configuration production

# Etapa de producción con Nginx
FROM nginx:alpine AS production

# Copiar archivos construidos desde la etapa anterior
COPY --from=build /app/dist/frontend-microescolar/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]