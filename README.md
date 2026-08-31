# 📦 Sistema de Inventariado y Gestión de Personal (Full-Stack)

Plataforma integral de gestión de inventario, ventas, movimientos y administración de personal construida con arquitectura desacoplada y orquestada con **Docker Compose**.

---

## 🛠️ Stack Tecnológico

- **Frontend (APP-inventariado)**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI / Radix, Zustand, Lucide React, Nginx.
- **Backend (API-inventariado)**: Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JWT (JJWT), Spring Mail.
- **Bases de Datos & Caché**: MySQL 8.0 y Redis 7.
- **Contenedores**: Docker & Docker Compose.

---

## 🚀 Inicio Rápido con Docker

### 1. Clonar el repositorio y configurar variables de entorno
`ash
cp .env.example .env
`

### 2. Construir e iniciar todos los servicios
`ash
docker compose up --build -d
`

### 3. Acceder a los servicios
- 🌐 **Frontend (Web App)**: [http://localhost](http://localhost)
- 🔌 **Backend (API REST)**: [http://localhost:8082](http://localhost:8082)
- 🗄️ **MySQL Database**: localhost:3307 (Usuario: oot)
- ⚡ **Redis Caché**: localhost:6379

### 4. Ver registros (logs) en tiempo real
`ash
docker compose logs -f
`

### 5. Detener los servicios
`ash
docker compose down
`

---

## 💻 Desarrollo Local (Sin Docker para desarrollo activo)

### Backend (Spring Boot)
Requiere Java 17+ y Maven:
`ash
cd API-inventariado
./mvnw spring-boot:run
`

### Frontend (React + Vite)
Requiere Node.js 18+:
`ash
cd APP-inventariado
npm install
npm run dev
`
Acceso en modo desarrollo: [http://localhost:5173](http://localhost:5173)
