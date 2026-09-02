package com.empresa.inventariado.infrastructure.repository;

import com.empresa.inventariado.domain.model.MovimientoInventario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IMovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Integer> {
    Page<MovimientoInventario> findAllByOrderByFechaMovimientoDesc(Pageable pageable);
    List<MovimientoInventario> findByProductoIdProductoOrderByFechaMovimientoDesc(Integer idProducto);
}