package com.empresa.inventariado.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer idCategoria;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_categoria", nullable = false)
    private TipoCategoria tipoCategoria = TipoCategoria.TECNOLOGIA;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    public enum TipoCategoria {
        TECNOLOGIA, CONSUMO
    }
}