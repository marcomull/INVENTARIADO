package com.empresa.inventariado.infrastructure.repository;

import com.empresa.inventariado.domain.model.Devolucion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IDevolucionRepository extends JpaRepository<Devolucion, Integer> {
    Page<Devolucion> findAllByOrderByFechaDevolucionDesc(Pageable pageable);
    List<Devolucion> findByVentaIdVenta(Integer idVenta);
    List<Devolucion> findByProductoIdProducto(Integer idProducto);
}