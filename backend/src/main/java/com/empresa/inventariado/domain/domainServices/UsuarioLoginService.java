package com.empresa.inventariado.domain.domainServices;

import com.empresa.inventariado.domain.interfaceServices.IUsuarioService;
import com.empresa.inventariado.domain.model.Usuario;
import com.empresa.inventariado.infrastructure.repository.IUsuarioRepository;
import com.empresa.inventariado.infrastructure.specifications.UsuarioSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioLoginService implements IUsuarioService {

    private final IUsuarioRepository usuarioRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioLoginService(IUsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //LOGIN usuario
    @Override
    public Optional<Usuario> login(String email, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(email);
        if (usuarioOpt.isPresent()
                && passwordEncoder.matches(password, usuarioOpt.get().getClaveHash())
                && Boolean.TRUE.equals(usuarioOpt.get().getVerificado())
                && (usuarioOpt.get().getActivo() == null || Boolean.TRUE.equals(usuarioOpt.get().getActivo()))) {
            return usuarioOpt;
        }
        return Optional.empty();
    }

    //LIST USUARIO
    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .filter(usuario -> usuario.getActivo() == null || usuario.getActivo())
                .collect(Collectors.toList());
    }

    //ADD USUARIO
    @Override
    public Usuario addUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    //SOFT DELETE USUARIO
    @Override
    public boolean deleteUsuario(int idUser) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUser);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setActivo(false);
            usuarioRepository.save(usuario);
            return true;
        }
        return false;
    }


    // LÓGICA DE ACTUALIZACIÓN DEL ADMIN
    public Optional<Usuario> updateUsuarioByAdmin(int idUser, Usuario usuarioActualizado) {
        return usuarioRepository.findById(idUser).map(existingUsuario -> {
            existingUsuario.setNombre(usuarioActualizado.getNombre());
            existingUsuario.setApellido(usuarioActualizado.getApellido());
            existingUsuario.setCorreo(usuarioActualizado.getCorreo());
            existingUsuario.setTelefono(usuarioActualizado.getTelefono());
            existingUsuario.setDni(usuarioActualizado.getDni());
            existingUsuario.setDireccion(usuarioActualizado.getDireccion());
            existingUsuario.setRol(usuarioActualizado.getRol());
            return usuarioRepository.save(existingUsuario);
        });
    }

    // ACTUALIZACIÓN DEL PERSONAL
    public Optional<Usuario> updateOwnProfile(String email, Usuario usuarioActualizado) {
        return usuarioRepository.findByCorreo(email).map(existingUsuario -> {
            existingUsuario.setNombre(usuarioActualizado.getNombre());
            existingUsuario.setApellido(usuarioActualizado.getApellido());
            existingUsuario.setCorreo(usuarioActualizado.getCorreo());
            existingUsuario.setTelefono(usuarioActualizado.getTelefono());
            existingUsuario.setDni(usuarioActualizado.getDni());
            existingUsuario.setDireccion(usuarioActualizado.getDireccion());
            String nuevaContrasena = usuarioActualizado.getClaveHash();
            if (nuevaContrasena != null && !nuevaContrasena.isEmpty()) {
                existingUsuario.setClaveHash(passwordEncoder.encode(nuevaContrasena));
            }

            return usuarioRepository.save(existingUsuario);
        });
    }

    //Datos de perfil
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByCorreo(email);
    }

    //Cambiar contraseña
    public void changePassword(String userEmail, String contrasenaActual, String nuevaContrasena) {
        // Buscamos al usuario por su email
        Usuario usuario = usuarioRepository.findByCorreo(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        // Verificamos que la contraseña actual que nos envió sea correcta
        if (!passwordEncoder.matches(contrasenaActual, usuario.getClaveHash())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta.");
        }
        // Si es correcto, encriptamos y guardamos la nueva contraseña
        usuario.setClaveHash(passwordEncoder.encode(nuevaContrasena));
        usuarioRepository.save(usuario);
    }

    //Filtros
    public Page<Usuario> getAllUsersWithFilters(String searchTerm, String rol, Pageable pageable) {
        Specification<Usuario> spec = UsuarioSpecification.withFilters(searchTerm, rol);
        return usuarioRepository.findAll(spec, pageable);
    }

    @Override
    public Usuario buscarPorId(Long id) {
        return null;
    }

    @Override
    public Usuario registrarPersonal(Usuario usuario) {
        return null;
    }

    @Override
    public boolean verificarCuenta(String token) {
        return false;
    }

    @Override
    public void cambiarEstadoActivo(Long id, Boolean estado) {

    }

}