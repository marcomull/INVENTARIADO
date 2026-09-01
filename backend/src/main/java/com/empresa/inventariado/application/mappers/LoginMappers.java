package com.empresa.inventariado.application.mappers;

import com.empresa.inventariado.application.dto.LoginResponseDTO;
import com.empresa.inventariado.domain.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class LoginMappers {

    // Mapeo de Administrator a UserDTO
    public LoginResponseDTO toDTO(Usuario usuario) {
        LoginResponseDTO dto = new LoginResponseDTO();
        dto.setId(usuario.getIdUsuario());
        dto.setCorreo(usuario.getCorreo());
        dto.setRol(usuario.getRol().toString());
        return dto;
    }

}
