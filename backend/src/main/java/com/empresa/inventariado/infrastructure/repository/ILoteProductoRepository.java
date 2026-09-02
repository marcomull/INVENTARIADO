package com.empresa.inventariado.infrastructure.repository;

import com.empresa.inventariado.domain.model.LoteProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ILoteProductoRepository extends JpaRepository<LoteProducto, Integer> {
    List<LoteProducto> findByProductoIdProducto(Integer idProducto);

    @Query("SELECT l FROM LoteProducto l WHERE l.cantidadDisponible > 0 AND l.fechaVencimiento <= :fechaLimite ORDER BY l.fechaVencimiento ASC")
    List<LoteProducto> findLotesProximosAVencer(LocalDate fechaLimite);
}