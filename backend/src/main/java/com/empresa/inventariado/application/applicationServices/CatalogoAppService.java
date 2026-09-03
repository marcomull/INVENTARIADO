package com.empresa.inventariado.application.applicationServices;

import com.empresa.inventariado.application.dto.CategoriaDTO;
import com.empresa.inventariado.application.dto.MarcaDTO;
import com.empresa.inventariado.application.dto.ModeloDispositivoDTO;
import com.empresa.inventariado.application.mappers.CatalogoMappers;
import com.empresa.inventariado.domain.interfaceServices.ICatalogoDomainService;
import com.empresa.inventariado.domain.model.Categoria;
import com.empresa.inventariado.domain.model.Marca;
import com.empresa.inventariado.domain.model.ModeloDispositivo;
import com.empresa.inventariado.infrastructure.repository.IMarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogoAppService {

    private final ICatalogoDomainService catalogoDomainService;
    private final CatalogoMappers catalogoMappers;
    private final IMarcaRepository marcaRepository;

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarCategorias(String tipo) {
        return catalogoMappers.toCategoriaDTOList(catalogoDomainService.listarCategorias(tipo));
    }

    @Transactional
    public CategoriaDTO crearCategoria(CategoriaDTO dto) {
        Categoria c = catalogoMappers.toCategoriaEntity(dto);
        return catalogoMappers.toCategoriaDTO(catalogoDomainService.guardarCategoria(c));
    }

    @Transactional(readOnly = true)
    public List<MarcaDTO> listarMarcas() {
        return catalogoMappers.toMarcaDTOList(catalogoDomainService.listarMarcas());
    }

    @Transactional
    public MarcaDTO crearMarca(MarcaDTO dto) {
        Marca m = catalogoMappers.toMarcaEntity(dto);
        return catalogoMappers.toMarcaDTO(catalogoDomainService.guardarMarca(m));
    }

    @Transactional(readOnly = true)
    public List<ModeloDispositivoDTO> listarModelos(Integer idMarca) {
        return catalogoMappers.toModeloDTOList(catalogoDomainService.listarModelos(idMarca));
    }

    @Transactional
    public ModeloDispositivoDTO crearModelo(ModeloDispositivoDTO dto) {
        Marca marca = marcaRepository.findById(dto.getIdMarca())
                .orElseThrow(() -> new IllegalArgumentException("Marca no encontrada con ID: " + dto.getIdMarca()));
        ModeloDispositivo m = catalogoMappers.toModeloEntity(dto, marca);
        return catalogoMappers.toModeloDTO(catalogoDomainService.guardarModelo(m));
    }
}