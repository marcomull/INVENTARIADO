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
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "telefono", length = 30)
    private String telefono;

    @Column(name = "dni", length = 20)
    private String dni;

    @Column(name = "direccion", length = 255)
    private String direccion;

    @Column(name = "correo", nullable = false, unique = true, length = 150)
    private String correo;

    @Column(name = "clave_hash", length = 255)
    private String claveHash;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol = Rol.VENDEDOR;

    public enum Rol {
        ADMIN, VENDEDOR
    }

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "verificado", nullable = false)
    private Boolean verificado = false;

    @Column(name = "codigo_verificacion", length = 255)
    private String codigoVerificacion;

    @Column(name = "fecha_expiracion_codigo")
    private LocalDateTime fechaExpiracionCodigo;

    @Column(name = "reset_password_token", length = 255)
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expiracion")
    private LocalDateTime resetPasswordTokenExpiracion;
}