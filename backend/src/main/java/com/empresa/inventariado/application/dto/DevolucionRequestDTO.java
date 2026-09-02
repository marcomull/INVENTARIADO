package com.empresa.inventariado.application.dto;

import lombok.Data;

@Data
public class DevolucionRequestDTO {
    private Integer idVenta;
    private Integer idProducto;
    private Integer idUsuario;
    private Integer cantidad;
    private String motivoDevolucion; // DEFECTO_FABRICA, CAMBIO_MODELO, PRODUCTO_VENCIDO, OTRO
    private String destinoProducto;  // RETORNA_A_STOCK, DESCARTE_MERMA, DEVOLUCION_A_PROVEEDOR
    private String observaciones;
}