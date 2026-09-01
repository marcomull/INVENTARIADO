package com.empresa.inventariado.application.applicationServices;

import com.empresa.inventariado.application.service.UserService;
import com.empresa.inventariado.domain.domainServices.PasswordResetService;
import com.empresa.inventariado.infrastructure.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetAppService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordResetService passwordResetService;

    @Value("")
    private String frontendUrl;

    public String handleForgotPassword(String email) {
        usuarioRepository.findByCorreo(email).ifPresent(usuario -> {
            String token = UUID.randomUUID().toString();
            usuario.setResetPasswordToken(token);
            usuario.setResetPasswordTokenExpiracion(LocalDateTime.now().plusHours(1));
            usuarioRepository.save(usuario);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            userService.enviarCorreoReseteo(usuario.getCorreo(), usuario.getNombre(), resetLink);
        });

        return "Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.";
    }

    public String handleResetPassword(String token, String nuevaContrasena) {
        passwordResetService.resetPassword(token, nuevaContrasena);
        return "Tu contraseña ha sido restablecida exitosamente.";
    }
}
