package com.empresa.inventariado.presentation.catalogoController;

import com.empresa.inventariado.application.applicationServices.CatalogoAppService;
import com.empresa.inventariado.application.dto.CategoriaDTO;
import com.empresa.inventariado.application.dto.MarcaDTO;
import com.empresa.inventariado.application.dto.ModeloDispositivoDTO;
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
    public ResponseEntity<List<CategoriaDTO>> listarCategorias(@RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(catalogoAppService.listarCategorias(tipo));
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaDTO> crearCategoria(@RequestBody CategoriaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoAppService.crearCategoria(dto));
    }

    @GetMapping("/marcas")
    public ResponseEntity<List<MarcaDTO>> listarMarcas() {
        return ResponseEntity.ok(catalogoAppService.listarMarcas());
    }

    @PostMapping("/marcas")
    public ResponseEntity<MarcaDTO> crearMarca(@RequestBody MarcaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoAppService.crearMarca(dto));
    }

    @GetMapping("/modelos")
    public ResponseEntity<List<ModeloDispositivoDTO>> listarModelos(@RequestParam(required = false) Integer idMarca) {
        return ResponseEntity.ok(catalogoAppService.listarModelos(idMarca));
    }

    @PostMapping("/modelos")
    public ResponseEntity<ModeloDispositivoDTO> crearModelo(@RequestBody ModeloDispositivoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoAppService.crearModelo(dto));
    }
}