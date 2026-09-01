package com.empresa.inventariado.infrastructure.security;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;


@Service
public class TokenBlacklistService {

    // Un Set sincronizado es una solución simple y efectiva para empezar.
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate; // Añadir inyección

    public void blacklistToken(String token) {
        Claims claims = jwtUtil.getClaims(token);
        Date expiration = claims.getExpiration();
        long remainingTimeMs = expiration.getTime() - new Date().getTime();

        if (remainingTimeMs > 0) {
            // Almacena el token en Redis con un TTL igual a su tiempo de vida restante.
            redisTemplate.opsForValue().set(
                    "jwt:blacklist:" + token,
                    true,
                    Duration.ofMillis(remainingTimeMs)
            );
        }
    }

    public boolean isTokenBlacklisted(String token) {
        // Consulta si la clave existe en Redis
        return Boolean.TRUE.equals(redisTemplate.hasKey("jwt:blacklist:" + token));
    }
}