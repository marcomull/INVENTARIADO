package com.empresa.inventariado.application.mappers;

import com.empresa.inventariado.application.dto.DevolucionRequestDTO;
import com.empresa.inventariado.application.dto.DevolucionResponseDTO;
import com.empresa.inventariado.application.dto.MovimientoInventarioDTO;
import com.empresa.inventariado.domain.model.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DevolucionMappers {

    public Devolucion toEntity(DevolucionRequestDTO dto, Venta venta, Producto producto, Usuario usuario) {
        if (dto == null) return null;
        Devolucion d = new Devolucion();
        d.setVenta(venta);
        d.setProducto(producto);
        d.setUsuario(usuario);
        d.setCantidad(dto.getCantidad() != null && dto.getCantidad() > 0 ? dto.getCantidad() : 1);
        d.setMotivoDevolucion(Devolucion.MotivoDevolucion.valueOf(dto.getMotivoDevolucion().toUpperCase()));
        d.setDestinoProducto(Devolucion.DestinoProducto.valueOf(dto.getDestinoProducto().toUpperCase()));
        d.setObservaciones(dto.getObservaciones());
        d.setFechaDevolucion(LocalDateTime.now());
        return d;
    }

    public DevolucionResponseDTO toResponseDTO(Devolucion d) {
        if (d == null) return null;
        DevolucionResponseDTO dto = new DevolucionResponseDTO();
        dto.setIdDevolucion(d.getIdDevolucion());
        dto.setIdVenta(d.getVenta() != null ? d.getVenta().getIdVenta() : null);
        dto.setCodigoVenta(d.getVenta() != null ? d.getVenta().getCodigoVenta() : null);
        dto.setIdProducto(d.getProducto() != null ? d.getProducto().getIdProducto() : null);
        dto.setNombreProducto(d.getProducto() != null ? d.getProducto().getNombre() : null);
        dto.setIdUsuario(d.getUsuario() != null ? d.getUsuario().getIdUsuario() : null);
        dto.setNombreUsuario(d.getUsuario() != null ? d.getUsuario().getNombre() + " " + d.getUsuario().getApellido() : null);
        dto.setCantidad(d.getCantidad());
        dto.setMotivoDevolucion(d.getMotivoDevolucion() != null ? d.getMotivoDevolucion().name() : null);
        dto.setDestinoProducto(d.getDestinoProducto() != null ? d.getDestinoProducto().name() : null);
        dto.setObservaciones(d.getObservaciones());
        dto.setFechaDevolucion(d.getFechaDevolucion());
        return dto;
    }

    public List<DevolucionResponseDTO> toResponseDTOList(List<Devolucion> list) {
        if (list == null) return Collections.emptyList();
        return list.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public MovimientoInventarioDTO toMovimientoDTO(MovimientoInventario m) {
        if (m == null) return null;
        MovimientoInventarioDTO dto = new MovimientoInventarioDTO();
        dto.setIdMovimiento(m.getIdMovimiento());
        dto.setIdProducto(m.getProducto() != null ? m.getProducto().getIdProducto() : null);
        dto.setNombreProducto(m.getProducto() != null ? m.getProducto().getNombre() : null);
        dto.setIdUsuario(m.getUsuario() != null ? m.getUsuario().getIdUsuario() : null);
        dto.setNombreUsuario(m.getUsuario() != null ? m.getUsuario().getNombre() + " " + m.getUsuario().getApellido() : null);
        dto.setTipoMovimiento(m.getTipoMovimiento() != null ? m.getTipoMovimiento().name() : null);
        dto.setCantidad(m.getCantidad());
        dto.setStockAnterior(m.getStockAnterior());
        dto.setStockNuevo(m.getStockNuevo());
        dto.setMotivo(m.getMotivo());
        dto.setFechaMovimiento(m.getFechaMovimiento());
        return dto;
    }

    public List<MovimientoInventarioDTO> toMovimientoDTOList(List<MovimientoInventario> list) {
        if (list == null) return Collections.emptyList();
        return list.stream().map(this::toMovimientoDTO).collect(Collectors.toList());
    }
}