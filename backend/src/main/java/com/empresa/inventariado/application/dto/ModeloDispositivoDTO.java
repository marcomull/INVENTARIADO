package com.empresa.inventariado.application.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModeloDispositivoDTO {
    private Integer idModelo;
    private Integer idMarca;
    private String nombreMarca;
    private String nombreModelo;
}