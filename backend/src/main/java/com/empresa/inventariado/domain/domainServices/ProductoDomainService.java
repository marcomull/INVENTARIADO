package com.empresa.inventariado.domain.domainServices;

import com.empresa.inventariado.domain.interfaceServices.IProductoDomainService;
import com.empresa.inventariado.domain.model.LoteProducto;
import com.empresa.inventariado.domain.model.Producto;
import com.empresa.inventariado.infrastructure.repository.ILoteProductoRepository;
import com.empresa.inventariado.infrastructure.repository.IProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductoDomainService implements IProductoDomainService {

    private final IProductoRepository productoRepository;
    private final ILoteProductoRepository loteProductoRepository;

    @Override
    public Producto guardarProducto(Producto producto) {
        validarProducto(producto);
        return productoRepository.save(producto);
    }

    @Override
    public Producto actualizarProducto(Producto producto) {
        validarProducto(producto);
        return productoRepository.save(producto);
    }

    @Override
    public void validarProducto(Producto producto) {
        if (producto == null) {
            throw new IllegalArgumentException("El producto no puede ser nulo.");
        }
        if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio.");
        }
        if (producto.getCategoria() == null) {
            throw new IllegalArgumentException("La categoría del producto es obligatoria.");
        }
        if (producto.getPrecioVenta() == null || producto.getPrecioVenta().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El precio de venta debe ser un valor mayor o igual a 0.");
        }
        if (producto.getPrecioCompra() != null && producto.getPrecioCompra().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El precio de compra no puede ser negativo.");
        }
        if (producto.getStockMinimo() != null && producto.getStockMinimo() < 0) {
            throw new IllegalArgumentException("El stock mínimo no puede ser negativo.");
        }

        // Validación de código de barras único si se proporciona
        if (producto.getCodigoBarras() != null && !producto.getCodigoBarras().trim().isEmpty()) {
            Optional<Producto> existente = productoRepository.findByCodigoBarras(producto.getCodigoBarras().trim());
            if (existente.isPresent() && (producto.getIdProducto() == null || !existente.get().getIdProducto().equals(producto.getIdProducto()))) {
                throw new IllegalArgumentException("Ya existe un producto con el código de barras: " + producto.getCodigoBarras());
            }
        }
    }

    @Override
    public Optional<Producto> buscarPorId(Integer id) {
        return productoRepository.findById(id);
    }

    @Override
    public Page<Producto> buscarPaginado(String query, Pageable pageable) {
        if (query != null && !query.trim().isEmpty()) {
            return productoRepository.buscarProductos(query.trim(), pageable);
        }
        return productoRepository.findAll(pageable);
    }

    @Override
    public List<Producto> buscarActivos() {
        return productoRepository.findByActivoTrue();
    }

    @Override
    public List<Producto> buscarConStockBajo() {
        return productoRepository.findProductosConStockBajo();
    }

    @Override
    public List<LoteProducto> buscarLotesProximosAVencer(int diasLimite) {
        LocalDate limite = LocalDate.now().plusDays(diasLimite);
        return loteProductoRepository.findLotesProximosAVencer(limite);
    }

    @Override
    public void darDeBaja(Integer id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));
        p.setActivo(false);
        productoRepository.save(p);
    }
}