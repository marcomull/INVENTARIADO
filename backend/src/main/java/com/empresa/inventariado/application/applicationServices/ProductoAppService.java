package com.empresa.inventariado.application.applicationServices;

import com.empresa.inventariado.application.dto.LoteProductoDTO;
import com.empresa.inventariado.application.dto.ProductoDTO;
import com.empresa.inventariado.application.dto.ProductoResponseDTO;
import com.empresa.inventariado.application.mappers.ProductoMappers;
import com.empresa.inventariado.application.service.ProductTrieService;
import com.empresa.inventariado.domain.interfaceServices.IProductoDomainService;
import com.empresa.inventariado.domain.model.*;
import com.empresa.inventariado.infrastructure.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductoAppService {

    private final IProductoDomainService productoDomainService;
    private final ProductoMappers productoMappers;
    private final ICategoriaRepository categoriaRepository;
    private final IMarcaRepository marcaRepository;
    private final IModeloDispositivoRepository modeloRepository;
    private final ILoteProductoRepository loteRepository;
    private final IMovimientoInventarioRepository movimientoRepository;
    private final IUsuarioRepository usuarioRepository;
    private final ProductTrieService productTrieService;

    @Transactional(readOnly = true)
    public Page<ProductoResponseDTO> listarProductos(String query, Pageable pageable) {
        Page<Producto> page = productoDomainService.buscarPaginado(query, pageable);
        return page.map(productoMappers::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> sugerenciasTrie(String query) {
        List<Producto> encontrados = productTrieService.buscar(query);
        return productoMappers.toResponseDTOList(encontrados);
    }

    @Transactional(readOnly = true)
    public Optional<ProductoResponseDTO> obtenerPorId(Integer id) {
        return productoDomainService.buscarPorId(id).map(productoMappers::toResponseDTO);
    }

    @Transactional
    public ProductoResponseDTO crearProducto(ProductoDTO dto, Integer idUsuarioOperador) {
        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + dto.getIdCategoria()));

        Marca marca = null;
        if (dto.getIdMarca() != null) {
            marca = marcaRepository.findById(dto.getIdMarca()).orElse(null);
        }

        ModeloDispositivo modelo = null;
        if (dto.getIdModeloDispositivo() != null) {
            modelo = modeloRepository.findById(dto.getIdModeloDispositivo()).orElse(null);
        }

        Producto producto = productoMappers.toEntity(dto, categoria, marca, modelo);
        Producto guardado = productoDomainService.guardarProducto(producto);

        // Registro de lote inicial si aplica
        if (dto.getFechaVencimiento() != null && dto.getStockActual() != null && dto.getStockActual() > 0) {
            LoteProducto lote = new LoteProducto();
            lote.setProducto(guardado);
            lote.setCodigoLote(dto.getCodigoLote() != null && !dto.getCodigoLote().isBlank() ? dto.getCodigoLote() : "LOTE-INIT-" + guardado.getIdProducto());
            lote.setFechaVencimiento(dto.getFechaVencimiento());
            lote.setCantidadInicial(dto.getStockActual());
            lote.setCantidadDisponible(dto.getStockActual());
            lote.setEstado(LoteProducto.EstadoLote.BUENO);
            loteRepository.save(lote);
        }

        // Kardex inicial
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

        // Indexación en Árbol Trie
        productTrieService.indexarProducto(guardado);
        log.info("Producto creado e indexado con éxito: {} (ID: {})", guardado.getNombre(), guardado.getIdProducto());

        return productoMappers.toResponseDTO(guardado);
    }

    @Transactional
    public ProductoResponseDTO actualizarProducto(Integer id, ProductoDTO dto) {
        Producto existente = productoDomainService.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));

        Categoria cat = null;
        if (dto.getIdCategoria() != null) {
            cat = categoriaRepository.findById(dto.getIdCategoria())
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        }

        Marca marca = null;
        if (dto.getIdMarca() != null) {
            marca = marcaRepository.findById(dto.getIdMarca()).orElse(null);
        }

        ModeloDispositivo modelo = null;
        if (dto.getIdModeloDispositivo() != null) {
            modelo = modeloRepository.findById(dto.getIdModeloDispositivo()).orElse(null);
        }

        productoMappers.updateEntityFromDTO(existente, dto, cat, marca, modelo);
        Producto actualizado = productoDomainService.actualizarProducto(existente);
        productTrieService.indexarProducto(actualizado);

        return productoMappers.toResponseDTO(actualizado);
    }

    @Transactional
    public void eliminarProducto(Integer id) {
        productoDomainService.darDeBaja(id);
        productTrieService.eliminarProducto(id);
    }

    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> obtenerAlertasStockBajo() {
        return productoMappers.toResponseDTOList(productoDomainService.buscarConStockBajo());
    }

    @Transactional(readOnly = true)
    public List<LoteProductoDTO> obtenerAlertasVencimiento(int diasLimite) {
        return productoMappers.toLoteDTOList(productoDomainService.buscarLotesProximosAVencer(diasLimite));
    }
}