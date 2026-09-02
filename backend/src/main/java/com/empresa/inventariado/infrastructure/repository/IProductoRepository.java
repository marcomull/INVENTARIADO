package com.empresa.inventariado.infrastructure.repository;

import com.empresa.inventariado.domain.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IProductoRepository extends JpaRepository<Producto, Integer>, JpaSpecificationExecutor<Producto> {
    Optional<Producto> findByCodigoBarras(String codigoBarras);
    List<Producto> findByActivoTrue();

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stockActual <= p.stockMinimo")
    List<Producto> findProductosConStockBajo();

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.codigoBarras) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.caracteristicas) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.marca.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.modeloDispositivo.nombreModelo) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Producto> buscarProductos(@Param("query") String query, Pageable pageable);
}