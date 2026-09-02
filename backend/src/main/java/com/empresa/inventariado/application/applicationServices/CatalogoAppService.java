package com.empresa.inventariado.application.applicationServices;

import com.empresa.inventariado.domain.model.Categoria;
import com.empresa.inventariado.domain.model.Marca;
import com.empresa.inventariado.domain.model.ModeloDispositivo;
import com.empresa.inventariado.infrastructure.repository.ICategoriaRepository;
import com.empresa.inventariado.infrastructure.repository.IMarcaRepository;
import com.empresa.inventariado.infrastructure.repository.IModeloDispositivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogoAppService {

    private final ICategoriaRepository categoriaRepository;
    private final IMarcaRepository marcaRepository;
    private final IModeloDispositivoRepository modeloRepository;

    public List<Categoria> listarCategorias(String tipo) {
        if (tipo != null && !tipo.isBlank()) {
            try {
                Categoria.TipoCategoria tipoCat = Categoria.TipoCategoria.valueOf(tipo.toUpperCase());
                return categoriaRepository.findByTipoCategoria(tipoCat);
            } catch (IllegalArgumentException ignored) {}
        }
        return categoriaRepository.findAll();
    }

    public List<Marca> listarMarcas() {
        return marcaRepository.findAll();
    }

    public List<ModeloDispositivo> listarModelos(Integer idMarca) {
        if (idMarca != null) {
            return modeloRepository.findByMarcaIdMarca(idMarca);
        }
        return modeloRepository.findAll();
    }

    public Categoria crearCategoria(Categoria cat) {
        return categoriaRepository.save(cat);
    }

    public Marca crearMarca(Marca marca) {
        return marcaRepository.save(marca);
    }

    public ModeloDispositivo crearModelo(ModeloDispositivo modelo) {
        return modeloRepository.save(modelo);
    }
}