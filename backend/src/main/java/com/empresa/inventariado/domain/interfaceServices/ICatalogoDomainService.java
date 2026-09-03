package com.empresa.inventariado.domain.interfaceServices;

import com.empresa.inventariado.domain.model.Categoria;
import com.empresa.inventariado.domain.model.Marca;
import com.empresa.inventariado.domain.model.ModeloDispositivo;

import java.util.List;

public interface ICatalogoDomainService {
    List<Categoria> listarCategorias(String tipo);
    Categoria guardarCategoria(Categoria categoria);
    List<Marca> listarMarcas();
    Marca guardarMarca(Marca marca);
    List<ModeloDispositivo> listarModelos(Integer idMarca);
    ModeloDispositivo guardarModelo(ModeloDispositivo modelo);
}