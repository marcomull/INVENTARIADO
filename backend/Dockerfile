# ==========================================
# Etapa 1: Compilación (Build)
# ==========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copiar todo el proyecto y compilar
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Etapa 2: Imagen Final (Runtime)
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Crear usuario sin privilegios
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar el .jar compilado
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]