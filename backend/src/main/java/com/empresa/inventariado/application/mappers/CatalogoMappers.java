package com.empresa.inventariado.application.mappers;

import com.empresa.inventariado.application.dto.CategoriaDTO;
import com.empresa.inventariado.application.dto.MarcaDTO;
import com.empresa.inventariado.application.dto.ModeloDispositivoDTO;
import com.empresa.inventariado.domain.model.Categoria;
import com.empresa.inventariado.domain.model.Marca;
import com.empresa.inventariado.domain.model.ModeloDispositivo;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CatalogoMappers {

    public CategoriaDTO toCategoriaDTO(Categoria c) {
        if (c == null) return null;
        CategoriaDTO dto = new CategoriaDTO();
        dto.setIdCategoria(c.getIdCategoria());
        dto.setNombre(c.getNombre());
        dto.setTipoCategoria(c.getTipoCategoria() != null ? c.getTipoCategoria().name() : null);
        dto.setDescripcion(c.getDescripcion());
        return dto;
    }

    public Categoria toCategoriaEntity(CategoriaDTO dto) {
        if (dto == null) return null;
        Categoria c = new Categoria();
        c.setIdCategoria(dto.getIdCategoria());
        c.setNombre(dto.getNombre());
        if (dto.getTipoCategoria() != null) {
            c.setTipoCategoria(Categoria.TipoCategoria.valueOf(dto.getTipoCategoria().toUpperCase()));
        }
        c.setDescripcion(dto.getDescripcion());
        return c;
    }

    public List<CategoriaDTO> toCategoriaDTOList(List<Categoria> list) {
        if (list == null) return Collections.emptyList();
        return list.stream().map(this::toCategoriaDTO).collect(Collectors.toList());
    }

    public MarcaDTO toMarcaDTO(Marca m) {
        if (m == null) return null;
        MarcaDTO dto = new MarcaDTO();
        dto.setIdMarca(m.getIdMarca());
        dto.setNombre(m.getNombre());
        return dto;
    }

    public Marca toMarcaEntity(MarcaDTO dto) {
        if (dto == null) return null;
        Marca m = new Marca();
        m.setIdMarca(dto.getIdMarca());
        m.setNombre(dto.getNombre());
        return m;
    }

    public List<MarcaDTO> toMarcaDTOList(List<Marca> list) {
        if (list == null) return Collections.emptyList();
        return list.stream().map(this::toMarcaDTO).collect(Collectors.toList());
    }

    public ModeloDispositivoDTO toModeloDTO(ModeloDispositivo m) {
        if (m == null) return null;
        ModeloDispositivoDTO dto = new ModeloDispositivoDTO();
        dto.setIdModelo(m.getIdModelo());
        dto.setIdMarca(m.getMarca() != null ? m.getMarca().getIdMarca() : null);
        dto.setNombreMarca(m.getMarca() != null ? m.getMarca().getNombre() : null);
        dto.setNombreModelo(m.getNombreModelo());
        return dto;
    }

    public ModeloDispositivo toModeloEntity(ModeloDispositivoDTO dto, Marca marca) {
        if (dto == null) return null;
        ModeloDispositivo m = new ModeloDispositivo();
        m.setIdModelo(dto.getIdModelo());
        m.setMarca(marca);
        m.setNombreModelo(dto.getNombreModelo());
        return m;
    }

    public List<ModeloDispositivoDTO> toModeloDTOList(List<ModeloDispositivo> list) {
        if (list == null) return Collections.emptyList();
        return list.stream().map(this::toModeloDTO).collect(Collectors.toList());
    }
}