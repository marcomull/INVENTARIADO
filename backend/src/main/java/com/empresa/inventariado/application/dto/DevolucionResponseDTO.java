package com.empresa.inventariado.application.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DevolucionResponseDTO {
    private Integer idDevolucion;
    private Integer idVenta;
    private String codigoVenta;
    private Integer idProducto;
    private String nombreProducto;
    private Integer idUsuario;
    private String nombreUsuario;
    private Integer cantidad;
    private String motivoDevolucion;
    private String destinoProducto;
    private String observaciones;
    private LocalDateTime fechaDevolucion;
}