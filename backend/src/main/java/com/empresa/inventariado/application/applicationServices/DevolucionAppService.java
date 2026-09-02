package com.empresa.inventariado.application.applicationServices;

import com.empresa.inventariado.application.dto.DevolucionRequestDTO;
import com.empresa.inventariado.domain.model.*;
import com.empresa.inventariado.infrastructure.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DevolucionAppService {

    private final IDevolucionRepository devolucionRepository;
    private final IVentaRepository ventaRepository;
    private final IProductoRepository productoRepository;
    private final IUsuarioRepository usuarioRepository;
    private final IMovimientoInventarioRepository movimientoRepository;

    public Page<Devolucion> listarDevoluciones(Pageable pageable) {
        return devolucionRepository.findAllByOrderByFechaDevolucionDesc(pageable);
    }

    @Transactional
    public Devolucion registrarDevolucion(DevolucionRequestDTO dto) {
        Venta venta = ventaRepository.findById(dto.getIdVenta())
                .orElseThrow(() -> new IllegalArgumentException("Venta no encontrada con ID: " + dto.getIdVenta()));

        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + dto.getIdProducto()));

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + dto.getIdUsuario()));

        int cantidad = (dto.getCantidad() != null && dto.getCantidad() > 0) ? dto.getCantidad() : 1;

        Devolucion.MotivoDevolucion motivo = Devolucion.MotivoDevolucion.valueOf(dto.getMotivoDevolucion());
        Devolucion.DestinoProducto destino = Devolucion.DestinoProducto.valueOf(dto.getDestinoProducto());

        Devolucion dev = new Devolucion();
        dev.setVenta(venta);
        dev.setProducto(producto);
        dev.setUsuario(usuario);
        dev.setCantidad(cantidad);
        dev.setMotivoDevolucion(motivo);
        dev.setDestinoProducto(destino);
        dev.setObservaciones(dto.getObservaciones());

        Devolucion guardada = devolucionRepository.save(dev);

        // Actualizar estado de la venta
        venta.setEstado(Venta.EstadoVenta.CON_DEVOLUCION);
        ventaRepository.save(venta);

        // Trazabilidad en Kardex y Ajuste de Stock
        int stockAnterior = producto.getStockActual();
        int stockNuevo = stockAnterior;

        MovimientoInventario.TipoMovimiento tipoMov;
        String motivoKardex;

        if (destino == Devolucion.DestinoProducto.RETORNA_A_STOCK) {
            // El producto está intacto y vuelve a ser vendible
            stockNuevo = stockAnterior + cantidad;
            producto.setStockActual(stockNuevo);
            productoRepository.save(producto);

            tipoMov = MovimientoInventario.TipoMovimiento.DEVOLUCION_INGRESO;
            motivoKardex = "Devolución Venta #" + venta.getCodigoVenta() + ": Retorna a stock (" + motivo + ")";
        } else if (motivo == Devolucion.MotivoDevolucion.PRODUCTO_VENCIDO) {
            tipoMov = MovimientoInventario.TipoMovimiento.MERMA_VENCIMIENTO;
            motivoKardex = "Devolución Venta #" + venta.getCodigoVenta() + ": Merma por vencimiento";
        } else {
            // Defecto de fábrica o merma (no entra a stock vendible)
            tipoMov = MovimientoInventario.TipoMovimiento.MERMA_DEFECTO;
            motivoKardex = "Devolución Venta #" + venta.getCodigoVenta() + ": Merma por defecto/daño (" + motivo + ")";
        }

        MovimientoInventario mov = new MovimientoInventario();
        mov.setProducto(producto);
        mov.setUsuario(usuario);
        mov.setTipoMovimiento(tipoMov);
        mov.setCantidad(cantidad);
        mov.setStockAnterior(stockAnterior);
        mov.setStockNuevo(stockNuevo);
        mov.setMotivo(motivoKardex + " - " + (dto.getObservaciones() != null ? dto.getObservaciones() : ""));
        movimientoRepository.save(mov);

        log.info("Devolución registrada con éxito: ID {}, Producto: {}, Destino: {}", guardada.getIdDevolucion(), producto.getNombre(), destino);
        return guardada;
    }
}