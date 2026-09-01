package com.empresa.inventariado.application.mappers;

import com.empresa.inventariado.application.dto.AdminUsuarioUpdateDTO;
import com.empresa.inventariado.application.dto.ClienteUsuarioUpdateDTO;
import com.empresa.inventariado.application.dto.UsuarioDTO;
import com.empresa.inventariado.application.dto.UsuarioKardexDTO;
import com.empresa.inventariado.domain.model.Usuario;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class UserMappers {

    // List Usuario
    public UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setCorreo(usuario.getCorreo());
        dto.setTelefono(usuario.getTelefono());
        dto.setDni(usuario.getDni());
        dto.setDireccion(usuario.getDireccion());
        dto.setRol(usuario.getRol().toString());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        return dto;
    }

    //Add Usuario
    public Usuario toEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(dto.getIdUsuario());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setCorreo(dto.getCorreo());
        usuario.setClaveHash(dto.getContrasena());
        usuario.setTelefono(dto.getTelefono());
        usuario.setDni(dto.getDni());
        usuario.setDireccion(dto.getDireccion());
        usuario.setRol(Usuario.Rol.VENDEDOR);
        usuario.setFechaRegistro(LocalDateTime.now());
        return usuario;
    }

    //Delete Usuario
    public Usuario toEntityForDeletion(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(dto.getIdUsuario());
        return usuario;
    }

    // actualizacion de administrador
    public Usuario fromAdminUpdateDTO(AdminUsuarioUpdateDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setCorreo(dto.getCorreo());
        usuario.setTelefono(dto.getTelefono());
        usuario.setDni(dto.getDni());
        usuario.setDireccion(dto.getDireccion());
        if (dto.getRol() != null) {
            usuario.setRol(Usuario.Rol.valueOf(dto.getRol().toUpperCase()));
        }
        return usuario;
    }

    // actualización del vendedor
    public Usuario fromVendedorUpdateDTO(ClienteUsuarioUpdateDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setCorreo(dto.getCorreo());
        usuario.setTelefono(dto.getTelefono());
        usuario.setDni(dto.getDni());
        usuario.setDireccion(dto.getDireccion());
        usuario.setClaveHash(dto.getContrasena());
        return usuario;
    }

    public Usuario employeeDtoToEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setCorreo(dto.getCorreo());
        usuario.setTelefono(dto.getTelefono());
        usuario.setClaveHash(null);
        usuario.setDni(dto.getDni());
        usuario.setDireccion(dto.getDireccion());
        usuario.setFechaRegistro(LocalDateTime.now());
        if (dto.getRol() != null && !dto.getRol().equalsIgnoreCase("CLIENTE")) {
            try {
                usuario.setRol(Usuario.Rol.valueOf(dto.getRol().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("El rol especificado '" + dto.getRol() + "' no es válido.");
            }
        } else {
            throw new IllegalArgumentException("Se debe especificar un rol de empleado válido (VENDEDOR, ADMIN).");
        }
        usuario.setActivo(true);
        usuario.setVerificado(true);
        return usuario;
    }

    public UsuarioKardexDTO toKardexDTO(Usuario usuario) {
        UsuarioKardexDTO dto = new UsuarioKardexDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombreCompleto(usuario.getNombre() + " " + usuario.getApellido());
        return dto;
    }
}
