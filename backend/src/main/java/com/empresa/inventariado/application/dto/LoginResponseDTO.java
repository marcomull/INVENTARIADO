package com.empresa.inventariado.application.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private int id;
    private String correo;
    private String rol;
}