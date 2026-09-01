package com.empresa.inventariado.domain.interfaceServices;

import com.empresa.inventariado.domain.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    Optional<Usuario> login(String email, String password);
    Usuario addUsuario(Usuario usuario);
    List<Usuario> listarTodos();
    boolean deleteUsuario(int idUser);
    Usuario buscarPorId(Long id);
    Usuario registrarPersonal(Usuario usuario);
    boolean verificarCuenta(String token);
    void cambiarEstadoActivo(Long id, Boolean estado);
}