package com.empresa.inventariado.application.applicationServices;


import org.springframework.stereotype.Service;

import com.empresa.inventariado.application.dto.*;
import com.empresa.inventariado.application.mappers.UserMappers;
import com.empresa.inventariado.application.service.UserService;
import com.empresa.inventariado.domain.domainServices.UsuarioLoginService;
import com.empresa.inventariado.domain.model.Usuario;
import com.empresa.inventariado.infrastructure.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import com.empresa.inventariado.domain.model.Usuario.Rol;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class UsuarioAppService {

    private final UsuarioLoginService usuarioLoginService;
    private final IUsuarioRepository usuarioRepository;
    private final UserMappers userMappers;
    private final UserService userService;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioAppService(UsuarioLoginService usuarioLoginService, UserMappers userMappers,
                             UserService userService,
                             IUsuarioRepository usuarioRepository,
                             PasswordEncoder passwordEncoder) {
        this.usuarioLoginService = usuarioLoginService;
        this.userMappers = userMappers;
        this.userService = userService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<UsuarioDTO> getAllUsers(String searchTerm, String rol, Pageable pageable) {
        Page<Usuario> usuarioPage = usuarioLoginService.getAllUsersWithFilters(searchTerm, rol, pageable);
        return usuarioPage.map(userMappers::toDTO);
    }

    //Add usuario
    public Usuario addUsuario(UsuarioDTO dto) {
        Usuario usuario = userMappers.toEntity(dto);
        // Serificación y expiración
        usuario.setVerificado(false);
        usuario.setCodigoVerificacion(UUID.randomUUID().toString());
        usuario.setFechaExpiracionCodigo(LocalDateTime.now().plusHours(24));
        // Guardar usuario con contraseña encriptada
        usuario.setClaveHash(passwordEncoder.encode(dto.getContrasena()));
        Usuario savedUser = usuarioLoginService.addUsuario(usuario);
        // Enviar correo de verificación
        String link = "http://localhost:3000/confirmacion?codigo=" + savedUser.getCodigoVerificacion();
        userService.enviarCorreoVerificacion(savedUser.getCorreo(), savedUser.getNombre(), link);
        return savedUser;
    }

    // Crear Empleado
    @Transactional
    public Usuario createEmployee(UsuarioDTO dto) {
        Usuario usuario = userMappers.employeeDtoToEntity(dto);
        String token = UUID.randomUUID().toString();
        usuario.setResetPasswordToken(token); //
        usuario.setResetPasswordTokenExpiracion(LocalDateTime.now().plusHours(24));
        Usuario savedEmployee = usuarioRepository.save(usuario);
        String activationLink = "http://localhost:3000/reset-password?token=" + token;
        userService.enviarCorreoActivacionEmpleado(
                savedEmployee.getCorreo(),
                savedEmployee.getNombre() + " " + savedEmployee.getApellido(),
                activationLink // Enviamos el enlace, no la contraseña
        );
        return savedEmployee;
    }

    public Optional<Usuario> verificarCodigo(String codigo) {
        return usuarioRepository.findByCodigoVerificacion(codigo);
    }

    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    //Delete usuario
    public boolean deleteUsuario(UsuarioDTO Deletedto) {
        Usuario usuario = userMappers.toEntityForDeletion(Deletedto);
        return usuarioLoginService.deleteUsuario(usuario.getIdUsuario());
    }

    // ADMIN ACTUALICE PERFILES
    public Optional<Usuario> updateUsuarioByAdmin(int id, AdminUsuarioUpdateDTO dto) {
        Usuario usuarioParaActualizar = userMappers.fromAdminUpdateDTO(dto);
        return usuarioLoginService.updateUsuarioByAdmin(id, usuarioParaActualizar);
    }

    // CLIENTE ACTUALICE SU PERFIL
    public Optional<Usuario> updateOwnProfile(String email, ClienteUsuarioUpdateDTO dto) {
        Usuario usuarioParaActualizar = userMappers.fromVendedorUpdateDTO(dto);
        return usuarioLoginService.updateOwnProfile(email, usuarioParaActualizar);
    }

    //Datos de usuario
    public Optional<UsuarioDTO> getUserByEmail(String email) {
        return usuarioLoginService.findByEmail(email)
                .map(userMappers::toDTO);
    }

    //Cambiar contraseña logueado
    public void changeUserPassword(String userEmail, ChangePasswordDTO dto) {
        // 1. Validamos que la nueva contraseña y su confirmación coincidan
        if (!dto.getNuevaContrasena().equals(dto.getConfirmarNuevaContrasena())) {
            throw new IllegalArgumentException("La nueva contraseña y su confirmación no coinciden.");
        }

        // 2. Llamamos al servicio de dominio para que haga el trabajo pesado
        usuarioLoginService.changePassword(userEmail, dto.getContrasenaActual(), dto.getNuevaContrasena());
    }


    public List<UsuarioDTO> findByRoles(List<String> rolesNames) {
        // Convierte los strings de roles a Enum
        List<Rol> roles = rolesNames.stream()
                .map(String::toUpperCase)
                .map(Rol::valueOf)
                .collect(Collectors.toList());

        return usuarioRepository.findAllByRolInAndActivoTrue(roles)
                .stream()
                .map(userMappers::toDTO)
                .collect(Collectors.toList());
    }

    public List<UsuarioKardexDTO> findNombresByIds(List<Integer> ids) {
        return usuarioRepository.findByIdUsuarioIn(ids).stream()
                .map(userMappers::toKardexDTO)
                .collect(Collectors.toList());
    }
}
