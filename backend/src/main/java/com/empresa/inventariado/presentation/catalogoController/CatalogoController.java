package com.empresa.inventariado.presentation.catalogoController;

import com.empresa.inventariado.application.applicationServices.CatalogoAppService;
import com.empresa.inventariado.domain.model.Categoria;
import com.empresa.inventariado.domain.model.Marca;
import com.empresa.inventariado.domain.model.ModeloDispositivo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalogo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CatalogoController {

    private final CatalogoAppService catalogoAppService;

    @GetMapping("/categorias")
    public ResponseEntity<List<Categoria>> listarCategorias(@RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(catalogoAppService.listarCategorias(tipo));
    }

    @PostMapping("/categorias")
    public ResponseEntity<Categoria> crearCategoria(@RequestBody Categoria cat) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoAppService.crearCategoria(cat));
    }

    @GetMapping("/marcas")
    public ResponseEntity<List<Marca>> listarMarcas() {
        return ResponseEntity.ok(catalogoAppService.listarMarcas());
    }

    @PostMapping("/marcas")
    public ResponseEntity<Marca> crearMarca(@RequestBody Marca marca) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoAppService.crearMarca(marca));
    }

    @GetMapping("/modelos")
    public ResponseEntity<List<ModeloDispositivo>> listarModelos(@RequestParam(required = false) Integer idMarca) {
        return ResponseEntity.ok(catalogoAppService.listarModelos(idMarca));
    }

    @PostMapping("/modelos")
    public ResponseEntity<ModeloDispositivo> crearModelo(@RequestBody ModeloDispositivo modelo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoAppService.crearModelo(modelo));
    }
}