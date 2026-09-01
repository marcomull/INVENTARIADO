package com.empresa.inventariado.application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final EmailSenderService emailSenderService;

    @Value("")
    private String nombreEmpresa;

    @Autowired
    public UserService(EmailSenderService emailSenderService) {
        this.emailSenderService = emailSenderService;
    }

    // Verificar correo
    public void enviarCorreoVerificacion(String email, String nombre, String link) {
        String body = "Hola " + nombre + ",\n\n" +
                "Confirma tu correo haciendo clic en el siguiente enlace:\n" + link +
                "\n\nEste enlace expirará en 24 horas.\n\n" +
                "Saludos,\n" + nombreEmpresa;
        emailSenderService.enviarmensaje(email, "Confirma tu correo - " + nombreEmpresa, body);
    }

    // Olvide contraseña: modo seguro para restablecer contraseña
    public void enviarCorreoReseteo(String email, String nombre, String link) {
        String subject = "Restablece tu contraseña - " + nombreEmpresa;
        String body = "Hola " + nombre + ",\n\n" +
                "Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:\n" + link +
                "\n\nSi no solicitaste esto, puedes ignorar este correo. El enlace expirará en 1 hora.\n\n" +
                "Saludos,\n" + nombreEmpresa;
        emailSenderService.enviarmensaje(email, subject, body);
    }

    // Activación de cuenta para empleado
    public void enviarCorreoActivacionEmpleado(String email, String nombreCompleto, String activationLink) {
        String subject = "¡Bienvenido a " + nombreEmpresa + "! Activa tu cuenta";
        String body = "Estimado/a " + nombreCompleto + ",\n\n" +
                "¡Bienvenido al equipo de " + nombreEmpresa + "!\n\n" +
                "Hemos creado una cuenta para ti en nuestro sistema. Para empezar, necesitas activar tu cuenta y establecer tu propia contraseña.\n\n" +
                "Por favor, haz clic en el siguiente enlace para configurar tu acceso:\n\n" +
                "Enlace de Activación: " + activationLink + "\n\n" +
                "**Importante:** Este enlace es de un solo uso y expirará en 24 horas por motivos de seguridad.\n\n" +
                "Si no esperabas este correo, puedes ignorarlo de forma segura.\n\n" +
                "Saludos cordiales,\n\n" +
                "El Equipo de " + nombreEmpresa;
        emailSenderService.enviarmensaje(email, subject, body);
    }
}
