package com.empresa.inventariado.presentation.userController;

import com.empresa.inventariado.application.applicationServices.UsuarioAppService;
import com.empresa.inventariado.application.dto.*;
import com.empresa.inventariado.application.mappers.UserMappers;
import com.empresa.inventariado.domain.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private final UsuarioAppService usuarioAppService;
    private final UserMappers userMappers;

    public UserController(UsuarioAppService usuarioAppService, UserMappers userMappers) {
        this.usuarioAppService = usuarioAppService;
        this.userMappers = userMappers;
    }

    //Confirmar correo
    @GetMapping("/confirm")
    public ResponseEntity<String> confirmarCorreo(@RequestParam String codigo) {
        Optional<Usuario> userOpt = usuarioAppService.verificarCodigo(codigo); // aquí llamamos al servicio
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Código de verificación inválido");
        }
        Usuario usuario = userOpt.get();
        if (usuario.getFechaExpiracionCodigo() == null ||
                usuario.getFechaExpiracionCodigo().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Código de verificación expirado");
        }
        usuario.setVerificado(true);
        usuario.setCodigoVerificacion(null);
        usuario.setFechaExpiracionCodigo(null);
        usuarioAppService.saveUsuario(usuario);
        return ResponseEntity.ok("Correo confirmado exitosamente");
    }

    //Añadir usuarios
    @PostMapping("/add")
    public ResponseEntity<String> addUsuario(@RequestBody UsuarioDTO addUsuarioDTO) {
        try {
            Usuario savedUser = usuarioAppService.addUsuario(addUsuarioDTO);
            return ResponseEntity.ok("Usuario registrado exitosamente. Correo de verificación enviado a: "
                    + savedUser.getCorreo());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar usuario: " + e.getMessage());
        }
    }

    // Crear Empleado Solo ADMIN
    @PostMapping("/admin/create-employee")
    public ResponseEntity<String> createEmployee(@RequestBody UsuarioDTO employeeDTO) {
        try {
            Usuario savedEmployee = usuarioAppService.createEmployee(employeeDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Empleado creado. Se envió un enlace de activación a: " + savedEmployee.getCorreo());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear empleado: " + e.getMessage());
        }
    }

    //Listar usuarios
    @GetMapping("/listUsers")
    public Page<UsuarioDTO> getAllUsers(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String rol,
            Pageable pageable) {
        return usuarioAppService.getAllUsers(searchTerm, rol, pageable);
    }

    //Delete usuarios
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAdministrator(@PathVariable Integer id) {
        try {
            UsuarioDTO deleteDTO = new UsuarioDTO();
            deleteDTO.setIdUsuario(id);
            boolean isDeleted = usuarioAppService.deleteUsuario(deleteDTO);

            if (isDeleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //actualice los datos de CUALQUIER usuario
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<UsuarioDTO> updateUsuarioByAdmin(
            @PathVariable int id,
            @RequestBody AdminUsuarioUpdateDTO userDTO) {
        return usuarioAppService.updateUsuarioByAdmin(id, userDTO)
                .map(usuario -> userMappers.toDTO(usuario))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //actualice SU PROPIO perfil
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateOwnProfile(
            @RequestBody ClienteUsuarioUpdateDTO userDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Se usa el email del token para identificar al usuario de forma segura
            String userEmail = userDetails.getUsername();
            Optional<Usuario> updatedUsuario = usuarioAppService.updateOwnProfile(userEmail, userDTO);
            return updatedUsuario.map(user -> ResponseEntity.ok("Perfil actualizado exitosamente."))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el perfil: " + e.getMessage());
        }
    }

    //Mostrar perfil
    @GetMapping("/profile")
    public ResponseEntity<UsuarioDTO> getOwnProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        return usuarioAppService.getUserByEmail(userEmail)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // ENDPOINT PARA CAMBIAR CONTRASEÑA
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordDTO changePasswordDTO) {
        try {
            // Obtenemos el email del usuario logueado de forma segura desde el token
            String userEmail = userDetails.getUsername();
            usuarioAppService.changeUserPassword(userEmail, changePasswordDTO);
            return ResponseEntity.ok("Contraseña actualizada exitosamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //Filtro por roles
    @GetMapping("/internal/by-roles")
    public ResponseEntity<List<UsuarioDTO>> getUsuariosPorRoles(
            @RequestParam List<String> roles
    ) {
        try {
            List<UsuarioDTO> usuarios = usuarioAppService.findByRoles(roles);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    //Filtro por usuario
    @GetMapping("/internal/by-ids")
    public ResponseEntity<List<UsuarioKardexDTO>> getUsuariosPorIds(
            @RequestParam List<Integer> ids
    ) {
        try {
            List<UsuarioKardexDTO> usuarios = usuarioAppService.findNombresByIds(ids);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}