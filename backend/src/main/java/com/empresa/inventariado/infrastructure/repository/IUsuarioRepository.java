package com.empresa.inventariado.infrastructure.repository;

import com.empresa.inventariado.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Integer>, JpaSpecificationExecutor<Usuario> {
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByResetPasswordToken(String token);
    Optional<Usuario> findByCodigoVerificacion(String codigo);
    List<Usuario> findAllByRolInAndActivoTrue(List<Usuario.Rol> roles);
    List<Usuario> findByIdUsuarioIn(List<Integer> ids);
}