package com.empresa.inventariado.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "devoluciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Devolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_devolucion")
    private Integer idDevolucion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_venta", nullable = false)
    private Venta venta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "motivo_devolucion", nullable = false)
    private MotivoDevolucion motivoDevolucion;

    @Enumerated(EnumType.STRING)
    @Column(name = "destino_producto", nullable = false)
    private DestinoProducto destinoProducto;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_devolucion", updatable = false)
    private LocalDateTime fechaDevolucion;

    public enum MotivoDevolucion {
        DEFECTO_FABRICA, CAMBIO_MODELO, PRODUCTO_VENCIDO, OTRO
    }

    public enum DestinoProducto {
        RETORNA_A_STOCK, DESCARTE_MERMA, DEVOLUCION_A_PROVEEDOR
    }

    @PrePersist
    protected void onCreate() {
        if (fechaDevolucion == null) {
            fechaDevolucion = LocalDateTime.now();
        }
    }
}