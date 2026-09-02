package com.empresa.inventariado.application.applicationServices;

import com.empresa.inventariado.application.dto.ProductoDTO;
import com.empresa.inventariado.application.service.ProductTrieService;
import com.empresa.inventariado.domain.model.*;
import com.empresa.inventariado.infrastructure.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductoAppService {

    private final IProductoRepository productoRepository;
    private final ICategoriaRepository categoriaRepository;
    private final IMarcaRepository marcaRepository;
    private final IModeloDispositivoRepository modeloRepository;
    private final ILoteProductoRepository loteRepository;
    private final IMovimientoInventarioRepository movimientoRepository;
    private final IUsuarioRepository usuarioRepository;
    private final ProductTrieService productTrieService;

    public Page<Producto> listarProductos(String query, Pageable pageable) {
        if (query != null && !query.trim().isEmpty()) {
            return productoRepository.buscarProductos(query.trim(), pageable);
        }
        return productoRepository.findAll(pageable);
    }

    public List<Producto> sugerenciasTrie(String query) {
        return productTrieService.buscar(query);
    }

    public Optional<Producto> obtenerPorId(Integer id) {
        return productoRepository.findById(id);
    }

    @Transactional
    public Producto crearProducto(ProductoDTO dto, Integer idUsuarioOperador) {
        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id: " + dto.getIdCategoria()));

        Marca marca = null;
        if (dto.getIdMarca() != null) {
            marca = marcaRepository.findById(dto.getIdMarca()).orElse(null);
        }

        ModeloDispositivo modelo = null;
        if (dto.getIdModeloDispositivo() != null) {
            modelo = modeloRepository.findById(dto.getIdModeloDispositivo()).orElse(null);
        }

        Producto p = new Producto();
        p.setCodigoBarras(dto.getCodigoBarras());
        p.setNombre(dto.getNombre());
        p.setCategoria(categoria);
        p.setMarca(marca);
        p.setModeloDispositivo(modelo);
        p.setCaracteristicas(dto.getCaracteristicas());
        p.setColor(dto.getColor());
        p.setPrecioCompra(dto.getPrecioCompra());
        p.setPrecioVenta(dto.getPrecioVenta());
        p.setStockActual(dto.getStockActual() != null ? dto.getStockActual() : 0);
        p.setStockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5);
        p.setImagenUrl(dto.getImagenUrl());
        p.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        Producto guardado = productoRepository.save(p);

        // Si tiene lote inicial para productos de consumo
        if (dto.getFechaVencimiento() != null && dto.getStockActual() != null && dto.getStockActual() > 0) {
            LoteProducto lote = new LoteProducto();
            lote.setProducto(guardado);
            lote.setCodigoLote(dto.getCodigoLote() != null ? dto.getCodigoLote() : "LOTE-INIT-" + guardado.getIdProducto());
            lote.setFechaVencimiento(dto.getFechaVencimiento());
            lote.setCantidadInicial(dto.getStockActual());
            lote.setCantidadDisponible(dto.getStockActual());
            lote.setEstado(LoteProducto.EstadoLote.BUENO);
            loteRepository.save(lote);
        }

        // Registrar movimiento inicial en Kardex si hubo stock inicial
        if (guardado.getStockActual() > 0 && idUsuarioOperador != null) {
            Usuario usuario = usuarioRepository.findById(idUsuarioOperador).orElse(null);
            if (usuario != null) {
                MovimientoInventario mov = new MovimientoInventario();
                mov.setProducto(guardado);
                mov.setUsuario(usuario);
                mov.setTipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA_COMPRA);
                mov.setCantidad(guardado.getStockActual());
                mov.setStockAnterior(0);
                mov.setStockNuevo(guardado.getStockActual());
                mov.setMotivo("Inventario Inicial al crear producto");
                movimientoRepository.save(mov);
            }
        }

        // Indexar en el árbol Trie en memoria
        productTrieService.indexarProducto(guardado);
        log.info("Producto creado e indexado en Trie: {} (ID: {})", guardado.getNombre(), guardado.getIdProducto());

        return guardado;
    }

    @Transactional
    public Producto actualizarProducto(Integer id, ProductoDTO dto) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));

        if (dto.getIdCategoria() != null) {
            Categoria cat = categoriaRepository.findById(dto.getIdCategoria())
                    .orElseThrow(() -> new IllegalArgumentException("Categoría inválida"));
            p.setCategoria(cat);
        }

        if (dto.getIdMarca() != null) {
            p.setMarca(marcaRepository.findById(dto.getIdMarca()).orElse(null));
        }

        if (dto.getIdModeloDispositivo() != null) {
            p.setModeloDispositivo(modeloRepository.findById(dto.getIdModeloDispositivo()).orElse(null));
        }

        if (dto.getCodigoBarras() != null) p.setCodigoBarras(dto.getCodigoBarras());
        if (dto.getNombre() != null) p.setNombre(dto.getNombre());
        if (dto.getCaracteristicas() != null) p.setCaracteristicas(dto.getCaracteristicas());
        if (dto.getColor() != null) p.setColor(dto.getColor());
        if (dto.getPrecioCompra() != null) p.setPrecioCompra(dto.getPrecioCompra());
        if (dto.getPrecioVenta() != null) p.setPrecioVenta(dto.getPrecioVenta());
        if (dto.getStockMinimo() != null) p.setStockMinimo(dto.getStockMinimo());
        if (dto.getImagenUrl() != null) p.setImagenUrl(dto.getImagenUrl());
        if (dto.getActivo() != null) p.setActivo(dto.getActivo());

        Producto actualizado = productoRepository.save(p);
        productTrieService.indexarProducto(actualizado);
        return actualizado;
    }

    @Transactional
    public void eliminarProducto(Integer id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));
        p.setActivo(false); // Borrado lógico
        productoRepository.save(p);
        productTrieService.eliminarProducto(id);
    }

    public List<Producto> obtenerAlertasStockBajo() {
        return productoRepository.findProductosConStockBajo();
    }

    public List<LoteProducto> obtenerAlertasVencimiento(int diasLimite) {
        LocalDate limite = LocalDate.now().plusDays(diasLimite);
        return loteRepository.findLotesProximosAVencer(limite);
    }
}