# 📦 Sistema de Inventariado y Gestión de Personal (Full-Stack)

Plataforma integral de gestión de inventario, ventas, movimientos y administración de personal construida con arquitectura desacoplada y orquestada con **Docker Compose**.

---

## 📁 Estructura del Proyecto

`	ext
INVENTARIADO/
├── backend/          <-- API REST (Java 17, Spring Boot 3, JPA, Security, JWT)
├── frontend/         <-- Web App (React 18, TypeScript, Vite, Tailwind CSS, Shadcn)
├── docker-compose.yml
├── .env.example
└── README.md
`

---

## 🛠️ Stack Tecnológico

- **Frontend (rontend)**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI / Radix, Zustand, Lucide React, Nginx.
- **Backend (ackend)**: Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JWT (JJWT), Spring Mail.
- **Bases de Datos & Caché**: MySQL 8.0 y Redis 7.
- **Contenedores**: Docker & Docker Compose.

---

## 🚀 Inicio Rápido con Docker

### 1. Configurar variables de entorno
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

## 💻 Desarrollo Local (Sin Docker)

### Backend (Spring Boot)
`ash
cd backend
./mvnw spring-boot:run
`

### Frontend (React + Vite)
`ash
cd frontend
npm install
npm run dev
`
Acceso en modo desarrollo: [http://localhost:5173](http://localhost:5173)
