package com.empresa.inventariado.presentation.userController;

import com.empresa.inventariado.application.applicationServices.PasswordResetAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class PasswordResetController {

    @Autowired
    private PasswordResetAppService passwordResetAppService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("correo");
        String serviceResponse = passwordResetAppService.handleForgotPassword(email);
        return ResponseEntity.ok(serviceResponse);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            String nuevaContrasena = body.get("contrasena");
            String serviceResponse = passwordResetAppService.handleResetPassword(token, nuevaContrasena);
            return ResponseEntity.ok(serviceResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}