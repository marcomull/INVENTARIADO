package com.empresa.inventariado.domain.domainServices;

import com.empresa.inventariado.domain.interfaceServices.IDevolucionDomainService;
import com.empresa.inventariado.domain.model.*;
import com.empresa.inventariado.infrastructure.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DevolucionDomainService implements IDevolucionDomainService {

    private final IDevolucionRepository devolucionRepository;
    private final IVentaRepository ventaRepository;
    private final IProductoRepository productoRepository;
    private final IMovimientoInventarioRepository movimientoRepository;

    @Override
    public Devolucion procesarDevolucion(Devolucion devolucion) {
        if (devolucion == null) throw new IllegalArgumentException("La devolución no puede ser nula.");
        if (devolucion.getVenta() == null) throw new IllegalArgumentException("Debe asociarse a una venta válida.");
        if (devolucion.getProducto() == null) throw new IllegalArgumentException("Debe asociarse a un producto válido.");
        if (devolucion.getUsuario() == null) throw new IllegalArgumentException("Debe registrarse el usuario que autoriza.");
        if (devolucion.getCantidad() == null || devolucion.getCantidad() <= 0) {
            throw new IllegalArgumentException("La cantidad devuelta debe ser mayor a 0.");
        }

        Devolucion guardada = devolucionRepository.save(devolucion);

        // Actualizar estado de la venta
        Venta venta = devolucion.getVenta();
        venta.setEstado(Venta.EstadoVenta.CON_DEVOLUCION);
        ventaRepository.save(venta);

        // Trazabilidad en Kardex y Ajuste de Stock
        Producto producto = devolucion.getProducto();
        int stockAnterior = producto.getStockActual();
        int stockNuevo = stockAnterior;

        MovimientoInventario.TipoMovimiento tipoMov;
        String motivoKardex;

        if (devolucion.getDestinoProducto() == Devolucion.DestinoProducto.RETORNA_A_STOCK) {
            stockNuevo = stockAnterior + devolucion.getCantidad();
            producto.setStockActual(stockNuevo);
            productoRepository.save(producto);

            tipoMov = MovimientoInventario.TipoMovimiento.DEVOLUCION_INGRESO;
            motivoKardex = "Devolución Venta #" + venta.getCodigoVenta() + ": Retorna a stock (" + devolucion.getMotivoDevolucion() + ")";
        } else if (devolucion.getMotivoDevolucion() == Devolucion.MotivoDevolucion.PRODUCTO_VENCIDO) {
            tipoMov = MovimientoInventario.TipoMovimiento.MERMA_VENCIMIENTO;
            motivoKardex = "Devolución Venta #" + venta.getCodigoVenta() + ": Merma por vencimiento";
        } else {
            tipoMov = MovimientoInventario.TipoMovimiento.MERMA_DEFECTO;
            motivoKardex = "Devolución Venta #" + venta.getCodigoVenta() + ": Merma por defecto/daño (" + devolucion.getMotivoDevolucion() + ")";
        }

        MovimientoInventario mov = new MovimientoInventario();
        mov.setProducto(producto);
        mov.setUsuario(devolucion.getUsuario());
        mov.setTipoMovimiento(tipoMov);
        mov.setCantidad(devolucion.getCantidad());
        mov.setStockAnterior(stockAnterior);
        mov.setStockNuevo(stockNuevo);
        mov.setMotivo(motivoKardex + " - " + (devolucion.getObservaciones() != null ? devolucion.getObservaciones() : ""));
        movimientoRepository.save(mov);

        return guardada;
    }

    @Override
    public Page<Devolucion> listarPaginado(Pageable pageable) {
        return devolucionRepository.findAllByOrderByFechaDevolucionDesc(pageable);
    }

    @Override
    public List<Devolucion> listarPorVenta(Integer idVenta) {
        return devolucionRepository.findByVentaIdVenta(idVenta);
    }

    @Override
    public List<Devolucion> listarPorProducto(Integer idProducto) {
        return devolucionRepository.findByProductoIdProducto(idProducto);
    }
}