package com.empresa.inventariado.infrastructure.repository;

import com.empresa.inventariado.domain.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IMarcaRepository extends JpaRepository<Marca, Integer> {
    Optional<Marca> findByNombreIgnoreCase(String nombre);
}