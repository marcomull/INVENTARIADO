package com.empresa.inventariado.application.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductoDTO {
    private Integer idProducto;
    private String codigoBarras;
    private String nombre;
    private Integer idCategoria;
    private Integer idMarca;
    private Integer idModeloDispositivo;
    private String caracteristicas;
    private String color;
    private BigDecimal precioCompra;
    private BigDecimal precioVenta;
    private Integer stockActual;
    private Integer stockMinimo;
    private String imagenUrl;
    private Boolean activo;

    // Campos opcionales para lote inicial (consumo)
    private String codigoLote;
    private LocalDate fechaVencimiento;
}