package com.empresa.inventariado.domain.interfaceServices;

import com.empresa.inventariado.domain.model.Devolucion;
import com.empresa.inventariado.domain.model.MovimientoInventario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IDevolucionDomainService {
    Devolucion procesarDevolucion(Devolucion devolucion);
    Page<Devolucion> listarPaginado(Pageable pageable);
    List<Devolucion> listarPorVenta(Integer idVenta);
    List<Devolucion> listarPorProducto(Integer idProducto);
}