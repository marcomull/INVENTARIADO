package com.empresa.inventariado.application.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventarioDTO {
    private Integer idMovimiento;
    private Integer idProducto;
    private String nombreProducto;
    private Integer idUsuario;
    private String nombreUsuario;
    private String tipoMovimiento;
    private Integer cantidad;
    private Integer stockAnterior;
    private Integer stockNuevo;
    private String motivo;
    private LocalDateTime fechaMovimiento;
}