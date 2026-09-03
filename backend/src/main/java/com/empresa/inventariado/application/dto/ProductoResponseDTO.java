package com.empresa.inventariado.application.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponseDTO {
    private Integer idProducto;
    private String codigoBarras;
    private String nombre;
    private CategoriaDTO categoria;
    private MarcaDTO marca;
    private ModeloDispositivoDTO modeloDispositivo;
    private String caracteristicas;
    private String color;
    private BigDecimal precioCompra;
    private BigDecimal precioVenta;
    private Integer stockActual;
    private Integer stockMinimo;
    private String imagenUrl;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}