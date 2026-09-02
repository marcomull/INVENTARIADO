package com.empresa.inventariado.application.dto;

import lombok.Data;

@Data
public class MovimientoRequestDTO {
    private Integer idProducto;
    private Integer idUsuario;
    private Integer idLote;
    private String tipoMovimiento; // ENTRADA_COMPRA, SALIDA_VENTA, AJUSTE_INVENTARIO, etc.
    private Integer cantidad;
    private String motivo;
}