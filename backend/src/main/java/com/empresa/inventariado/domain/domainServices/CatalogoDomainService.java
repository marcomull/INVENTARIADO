package com.empresa.inventariado.domain.domainServices;

import com.empresa.inventariado.domain.interfaceServices.ICatalogoDomainService;
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
public class CatalogoDomainService implements ICatalogoDomainService {

    private final ICategoriaRepository categoriaRepository;
    private final IMarcaRepository marcaRepository;
    private final IModeloDispositivoRepository modeloRepository;

    @Override
    public List<Categoria> listarCategorias(String tipo) {
        if (tipo != null && !tipo.isBlank()) {
            try {
                Categoria.TipoCategoria tipoCat = Categoria.TipoCategoria.valueOf(tipo.toUpperCase());
                return categoriaRepository.findByTipoCategoria(tipoCat);
            } catch (IllegalArgumentException ignored) {}
        }
        return categoriaRepository.findAll();
    }

    @Override
    public Categoria guardarCategoria(Categoria categoria) {
        if (categoria.getNombre() == null || categoria.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la categoría es obligatorio.");
        }
        return categoriaRepository.save(categoria);
    }

    @Override
    public List<Marca> listarMarcas() {
        return marcaRepository.findAll();
    }

    @Override
    public Marca guardarMarca(Marca marca) {
        if (marca.getNombre() == null || marca.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la marca es obligatorio.");
        }
        return marcaRepository.save(marca);
    }

    @Override
    public List<ModeloDispositivo> listarModelos(Integer idMarca) {
        if (idMarca != null) {
            return modeloRepository.findByMarcaIdMarca(idMarca);
        }
        return modeloRepository.findAll();
    }

    @Override
    public ModeloDispositivo guardarModelo(ModeloDispositivo modelo) {
        if (modelo.getNombreModelo() == null || modelo.getNombreModelo().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del modelo es obligatorio.");
        }
        if (modelo.getMarca() == null) {
            throw new IllegalArgumentException("La marca del modelo de dispositivo es obligatoria.");
        }
        return modeloRepository.save(modelo);
    }
}