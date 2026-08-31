package com.empresa.inventariado.domain.domainServices;

import com.empresa.inventariado.domain.model.Usuario;
import com.empresa.inventariado.infrastructure.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final IUsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordResetService(IUsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void resetPassword(String token, String nuevaContrasena) {
        if (token == null || nuevaContrasena == null || nuevaContrasena.isEmpty()) {
            throw new IllegalArgumentException("Token y contraseña son requeridos.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByResetPasswordToken(token);

        if (usuarioOpt.isEmpty() || usuarioOpt.get().getResetPasswordTokenExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El enlace de restablecimiento es inválido o ha expirado.");
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setClaveHash(passwordEncoder.encode(nuevaContrasena));
        usuario.setResetPasswordToken(null);
        usuario.setResetPasswordTokenExpiracion(null);

        usuarioRepository.save(usuario);
    }
}