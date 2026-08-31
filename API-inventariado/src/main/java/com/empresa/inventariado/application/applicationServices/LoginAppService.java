package com.empresa.inventariado.application.applicationServices;

import com.empresa.inventariado.application.dto.LoginResponseDTO;
import com.empresa.inventariado.application.mappers.LoginMappers;
import com.empresa.inventariado.domain.domainServices.UsuarioLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginAppService {

    private final UsuarioLoginService usuarioLoginService;
    private final LoginMappers loginMappers;

    @Autowired
    public LoginAppService(UsuarioLoginService usuarioLoginService, LoginMappers loginMappers) {
        this.usuarioLoginService = usuarioLoginService;
        this.loginMappers = loginMappers;
    }

    // Login Usuario
    public Optional<LoginResponseDTO> loginAsUsuario(String correo, String contrasena){
        var usuarioOpt = usuarioLoginService.login(correo, contrasena);
        return usuarioOpt.map(loginMappers::toDTO);
    }
}
