package com.empresa.inventariado.infrastructure.repository;

import com.empresa.inventariado.domain.model.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IVentaRepository extends JpaRepository<Venta, Integer> {
    Optional<Venta> findByCodigoVenta(String codigoVenta);
    Page<Venta> findAllByOrderByFechaVentaDesc(Pageable pageable);
}