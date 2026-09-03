package com.empresa.inventariado.domain.interfaceServices;

import com.empresa.inventariado.domain.model.LoteProducto;
import com.empresa.inventariado.domain.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IProductoDomainService {
    Producto guardarProducto(Producto producto);
    Producto actualizarProducto(Producto producto);
    void validarProducto(Producto producto);
    Optional<Producto> buscarPorId(Integer id);
    Page<Producto> buscarPaginado(String query, Pageable pageable);
    List<Producto> buscarActivos();
    List<Producto> buscarConStockBajo();
    List<LoteProducto> buscarLotesProximosAVencer(int diasLimite);
    void darDeBaja(Integer id);
}