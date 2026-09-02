package com.empresa.inventariado.presentation.productoController;

import com.empresa.inventariado.application.applicationServices.ProductoAppService;
import com.empresa.inventariado.application.dto.ProductoDTO;
import com.empresa.inventariado.domain.model.LoteProducto;
import com.empresa.inventariado.domain.model.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoAppService productoAppService;

    @GetMapping
    public ResponseEntity<Page<Producto>> listar(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(productoAppService.listarProductos(q, pageable));
    }

    @GetMapping("/sugerencias")
    public ResponseEntity<List<Producto>> sugerenciasTrie(@RequestParam(defaultValue = "") String q) {
        return ResponseEntity.ok(productoAppService.sugerenciasTrie(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Integer id) {
        return productoAppService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> crear(
            @RequestBody ProductoDTO dto,
            @RequestHeader(value = "X-User-Id", required = false) Integer userId) {
        Producto nuevo = productoAppService.crearProducto(dto, userId != null ? userId : 1);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(
            @PathVariable Integer id,
            @RequestBody ProductoDTO dto) {
        return ResponseEntity.ok(productoAppService.actualizarProducto(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        productoAppService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/alertas/stock-bajo")
    public ResponseEntity<List<Producto>> alertasStockBajo() {
        return ResponseEntity.ok(productoAppService.obtenerAlertasStockBajo());
    }

    @GetMapping("/alertas/vencimientos")
    public ResponseEntity<List<LoteProducto>> alertasVencimientos(
            @RequestParam(defaultValue = "15") int dias) {
        return ResponseEntity.ok(productoAppService.obtenerAlertasVencimiento(dias));
    }
}