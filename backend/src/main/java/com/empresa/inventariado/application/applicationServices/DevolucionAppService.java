package com.empresa.inventariado.application.applicationServices;

import com.empresa.inventariado.application.dto.DevolucionRequestDTO;
import com.empresa.inventariado.application.dto.DevolucionResponseDTO;
import com.empresa.inventariado.application.mappers.DevolucionMappers;
import com.empresa.inventariado.domain.interfaceServices.IDevolucionDomainService;
import com.empresa.inventariado.domain.model.Devolucion;
import com.empresa.inventariado.domain.model.Producto;
import com.empresa.inventariado.domain.model.Usuario;
import com.empresa.inventariado.domain.model.Venta;
import com.empresa.inventariado.infrastructure.repository.IProductoRepository;
import com.empresa.inventariado.infrastructure.repository.IUsuarioRepository;
import com.empresa.inventariado.infrastructure.repository.IVentaRepository;
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

    private final IDevolucionDomainService devolucionDomainService;
    private final DevolucionMappers devolucionMappers;
    private final IVentaRepository ventaRepository;
    private final IProductoRepository productoRepository;
    private final IUsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public Page<DevolucionResponseDTO> listarDevoluciones(Pageable pageable) {
        Page<Devolucion> page = devolucionDomainService.listarPaginado(pageable);
        return page.map(devolucionMappers::toResponseDTO);
    }

    @Transactional
    public DevolucionResponseDTO registrarDevolucion(DevolucionRequestDTO dto) {
        Venta venta = ventaRepository.findById(dto.getIdVenta())
                .orElseThrow(() -> new IllegalArgumentException("Venta no encontrada con ID: " + dto.getIdVenta()));

        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + dto.getIdProducto()));

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + dto.getIdUsuario()));

        Devolucion dev = devolucionMappers.toEntity(dto, venta, producto, usuario);
        Devolucion procesada = devolucionDomainService.procesarDevolucion(dev);

        return devolucionMappers.toResponseDTO(procesada);
    }
}