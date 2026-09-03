package com.empresa.inventariado.application.mappers;

import com.empresa.inventariado.application.dto.*;
import com.empresa.inventariado.domain.model.Categoria;
import com.empresa.inventariado.domain.model.LoteProducto;
import com.empresa.inventariado.domain.model.Marca;
import com.empresa.inventariado.domain.model.ModeloDispositivo;
import com.empresa.inventariado.domain.model.Producto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductoMappers {

    private final CatalogoMappers catalogoMappers;

    public ProductoMappers(CatalogoMappers catalogoMappers) {
        this.catalogoMappers = catalogoMappers;
    }

    public Producto toEntity(ProductoDTO dto, Categoria categoria, Marca marca, ModeloDispositivo modelo) {
        if (dto == null) return null;
        Producto p = new Producto();
        p.setIdProducto(dto.getIdProducto());
        p.setCodigoBarras(dto.getCodigoBarras());
        p.setNombre(dto.getNombre());
        p.setCategoria(categoria);
        p.setMarca(marca);
        p.setModeloDispositivo(modelo);
        p.setCaracteristicas(dto.getCaracteristicas());
        p.setColor(dto.getColor());
        p.setPrecioCompra(dto.getPrecioCompra());
        p.setPrecioVenta(dto.getPrecioVenta());
        p.setStockActual(dto.getStockActual() != null ? dto.getStockActual() : 0);
        p.setStockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5);
        p.setImagenUrl(dto.getImagenUrl());
        p.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        p.setFechaCreacion(LocalDateTime.now());
        return p;
    }

    public ProductoResponseDTO toResponseDTO(Producto p) {
        if (p == null) return null;
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setIdProducto(p.getIdProducto());
        dto.setCodigoBarras(p.getCodigoBarras());
        dto.setNombre(p.getNombre());
        dto.setCategoria(catalogoMappers.toCategoriaDTO(p.getCategoria()));
        dto.setMarca(catalogoMappers.toMarcaDTO(p.getMarca()));
        dto.setModeloDispositivo(catalogoMappers.toModeloDTO(p.getModeloDispositivo()));
        dto.setCaracteristicas(p.getCaracteristicas());
        dto.setColor(p.getColor());
        dto.setPrecioCompra(p.getPrecioCompra());
        dto.setPrecioVenta(p.getPrecioVenta());
        dto.setStockActual(p.getStockActual());
        dto.setStockMinimo(p.getStockMinimo());
        dto.setImagenUrl(p.getImagenUrl());
        dto.setActivo(p.getActivo());
        dto.setFechaCreacion(p.getFechaCreacion());
        return dto;
    }

    public List<ProductoResponseDTO> toResponseDTOList(List<Producto> productos) {
        if (productos == null) return Collections.emptyList();
        return productos.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public void updateEntityFromDTO(Producto p, ProductoDTO dto, Categoria categoria, Marca marca, ModeloDispositivo modelo) {
        if (p == null || dto == null) return;
        if (categoria != null) p.setCategoria(categoria);
        p.setMarca(marca);
        p.setModeloDispositivo(modelo);
        if (dto.getCodigoBarras() != null) p.setCodigoBarras(dto.getCodigoBarras());
        if (dto.getNombre() != null) p.setNombre(dto.getNombre());
        if (dto.getCaracteristicas() != null) p.setCaracteristicas(dto.getCaracteristicas());
        if (dto.getColor() != null) p.setColor(dto.getColor());
        if (dto.getPrecioCompra() != null) p.setPrecioCompra(dto.getPrecioCompra());
        if (dto.getPrecioVenta() != null) p.setPrecioVenta(dto.getPrecioVenta());
        if (dto.getStockMinimo() != null) p.setStockMinimo(dto.getStockMinimo());
        if (dto.getImagenUrl() != null) p.setImagenUrl(dto.getImagenUrl());
        if (dto.getActivo() != null) p.setActivo(dto.getActivo());
    }

    public LoteProductoDTO toLoteDTO(LoteProducto lote) {
        if (lote == null) return null;
        LoteProductoDTO dto = new LoteProductoDTO();
        dto.setIdLote(lote.getIdLote());
        dto.setIdProducto(lote.getProducto() != null ? lote.getProducto().getIdProducto() : null);
        dto.setNombreProducto(lote.getProducto() != null ? lote.getProducto().getNombre() : null);
        dto.setCodigoLote(lote.getCodigoLote());
        dto.setFechaVencimiento(lote.getFechaVencimiento());
        dto.setCantidadInicial(lote.getCantidadInicial());
        dto.setCantidadDisponible(lote.getCantidadDisponible());
        dto.setEstado(lote.getEstado() != null ? lote.getEstado().name() : null);
        dto.setFechaIngreso(lote.getFechaIngreso());
        return dto;
    }

    public List<LoteProductoDTO> toLoteDTOList(List<LoteProducto> lotes) {
        if (lotes == null) return Collections.emptyList();
        return lotes.stream().map(this::toLoteDTO).collect(Collectors.toList());
    }
}