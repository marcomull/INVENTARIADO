package com.empresa.inventariado.application.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoteProductoDTO {
    private Integer idLote;
    private Integer idProducto;
    private String nombreProducto;
    private String codigoLote;
    private LocalDate fechaVencimiento;
    private Integer cantidadInicial;
    private Integer cantidadDisponible;
    private String estado;
    private LocalDateTime fechaIngreso;
}