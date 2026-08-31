package com.empresa.inventariado.infrastructure.security;

import com.empresa.inventariado.domain.model.Usuario;
import com.empresa.inventariado.infrastructure.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el correo: " + username));

        // Creamos una lista de roles/autoridades para Spring Security
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())
        );

        // Devolvemos el objeto UserDetails que Spring Security entiende
        return new User(usuario.getCorreo(), usuario.getClaveHash(), authorities);
    }
}