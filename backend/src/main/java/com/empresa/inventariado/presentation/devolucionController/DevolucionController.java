package com.empresa.inventariado.presentation.devolucionController;

import com.empresa.inventariado.application.applicationServices.DevolucionAppService;
import com.empresa.inventariado.application.dto.DevolucionRequestDTO;
import com.empresa.inventariado.domain.model.Devolucion;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/devoluciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DevolucionController {

    private final DevolucionAppService devolucionAppService;

    @GetMapping
    public ResponseEntity<Page<Devolucion>> listar(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(devolucionAppService.listarDevoluciones(pageable));
    }

    @PostMapping
    public ResponseEntity<Devolucion> registrar(@RequestBody DevolucionRequestDTO dto) {
        Devolucion nueva = devolucionAppService.registrarDevolucion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }
}