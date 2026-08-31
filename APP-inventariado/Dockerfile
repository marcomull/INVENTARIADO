# ==========================================
# Etapa 1: Compilación (Build)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm run build

# ==========================================
# Etapa 2: Servidor Nginx (Runtime)
# ==========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Eliminar archivos por defecto de Nginx
RUN rm -rf ./*

# Copiar los archivos estáticos construidos desde la etapa anterior
COPY --from=builder /app/dist .

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
