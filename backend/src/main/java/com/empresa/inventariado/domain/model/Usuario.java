package com.empresa.inventariado.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`idUsuario`")
    private Integer idUsuario;

    @Column(name = "nombres", nullable = false, length = 150)
    private String nombre;

    @Column(name = "apellidos", nullable = false, length = 150)
    private String apellido;

    @Column(name = "telefono", nullable = false, length = 150)
    private String telefono;

    @Column(name = "dni", nullable = false, length = 150)
    private String dni;

    @Column(name = "direccion", nullable = false, length = 150)
    private String direccion;

    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    @Column(name = "clave_hash", nullable = true, length = 255)
    private String claveHash;

    @Column(name = "fecha_registro", updatable = false)
    private java.time.LocalDateTime fechaRegistro;

    @Enumerated(EnumType.STRING)
    private Rol rol = Rol.ADMIN;

    public enum Rol {
        ADMIN, VENDEDOR
    }

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "verificado")
    private Boolean verificado = false;

    @Column(name = "codigo_verificacion")
    private String codigoVerificacion;

    @Column(name = "fecha_expiracion")
    private java.time.LocalDateTime fechaExpiracionCodigo;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expiracion")
    private java.time.LocalDateTime resetPasswordTokenExpiracion;
}
