package com.empresa.inventariado.infrastructure.repository;

import com.empresa.inventariado.domain.model.ModeloDispositivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IModeloDispositivoRepository extends JpaRepository<ModeloDispositivo, Integer> {
    List<ModeloDispositivo> findByMarcaIdMarca(Integer idMarca);
}