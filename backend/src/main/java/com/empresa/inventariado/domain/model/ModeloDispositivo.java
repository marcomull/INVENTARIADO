package com.empresa.inventariado.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "modelos_dispositivo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModeloDispositivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modelo")
    private Integer idModelo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_marca", nullable = false)
    private Marca marca;

    @Column(name = "nombre_modelo", nullable = false, length = 100)
    private String nombreModelo;
}