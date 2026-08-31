package com.empresa.inventariado.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    // La clave debe tener al menos 32 bytes para HS256
    private String SECRET;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    //Generar token
    public String generateToken(String email, String role, int idUsuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("id", idUsuario); //agrega el ID al token

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 1 día
                .signWith(secretKey)
                .compact();
    }

    //Extraer email
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    //Validar token
    public boolean isTokenValid(String token, String email) {
        return email.equals(extractEmail(token)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    //Obtener los claims del token
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}

