package com.empresa.inventariado.presentation.loginController;

import com.empresa.inventariado.application.applicationServices.LoginAppService;
import com.empresa.inventariado.application.dto.LoginRequestDTO;
import com.empresa.inventariado.application.dto.LoginResponseDTO;
import com.empresa.inventariado.infrastructure.security.JwtUtil;
import com.empresa.inventariado.infrastructure.security.TokenBlacklistService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final LoginAppService loginAppService;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;

    @Autowired
    public LoginController(LoginAppService loginAppService, JwtUtil jwtUtil, TokenBlacklistService tokenBlacklistService) {
        this.loginAppService = loginAppService;
        this.jwtUtil = jwtUtil;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/usuario")
    public ResponseEntity<?> loginAsUsuario(@RequestBody LoginRequestDTO request) {
        try {
            Optional<LoginResponseDTO> userOpt = loginAppService.loginAsUsuario(request.getCorreo(), request.getContrasena());

            if (userOpt.isPresent()) {
                LoginResponseDTO usuario = userOpt.get();
                String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getRol(), usuario.getId());

                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "id", usuario.getId(),
                        "correo", usuario.getCorreo(),
                        "rol", usuario.getRol()
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Ocurrió un error interno: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token); // Añade el token a la lista
            return ResponseEntity.ok("Sesión cerrada exitosamente.");
        }
        return ResponseEntity.badRequest().body("No se encontró token para invalidar.");
    }
}
