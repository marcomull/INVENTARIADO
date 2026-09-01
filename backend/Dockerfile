# ==========================================
# Etapa 1: Compilación (Build)
# ==========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copiar configuración de dependencias para aprovechar la caché de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Etapa 2: Imagen Final (Runtime)
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Crear usuario sin privilegios para mayor seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar el .jar compilado desde la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
