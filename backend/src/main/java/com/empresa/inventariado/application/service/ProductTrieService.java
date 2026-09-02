package com.empresa.inventariado.application.service;

import com.empresa.inventariado.domain.model.Producto;
import com.empresa.inventariado.infrastructure.repository.IProductoRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/**
 * Motor de Búsqueda de Alta Velocidad basado en Árbol de Prefijos (Trie).
 * Complejidad de búsqueda: O(L), donde L es la longitud de la palabra buscada.
 */
@Service
@Slf4j
public class ProductTrieService {

    private final IProductoRepository productoRepository;
    private final TrieNode root = new TrieNode();
    private final Map<Integer, Producto> productCache = new ConcurrentHashMap<>();

    public ProductTrieService(IProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    /**
     * Nodo de la estructura de datos Trie (Árbol)
     */
    private static class TrieNode {
        Map<Character, TrieNode> children = new ConcurrentHashMap<>();
        Set<Integer> productIds = ConcurrentHashMap.newKeySet();
        boolean isEndOfWord = false;
    }

    @PostConstruct
    public void init() {
        recargarArbol();
    }

    /**
     * Recarga el árbol Trie en memoria con todos los productos activos de MySQL.
     */
    public synchronized void recargarArbol() {
        root.children.clear();
        root.productIds.clear();
        productCache.clear();

        List<Producto> productos = productoRepository.findByActivoTrue();
        for (Producto p : productos) {
            indexarProducto(p);
        }
        log.info("🌳 Árbol Trie indexado con éxito. Total productos en memoria: {}", productCache.size());
    }

    /**
     * Indexa un producto en el árbol Trie descomponiéndolo en tokens (nombre, marca, modelo, características, código).
     */
    public void indexarProducto(Producto producto) {
        if (producto == null || producto.getIdProducto() == null) return;
        productCache.put(producto.getIdProducto(), producto);

        StringBuilder tokens = new StringBuilder();
        if (producto.getNombre() != null) tokens.append(producto.getNombre()).append(" ");
        if (producto.getCodigoBarras() != null) tokens.append(producto.getCodigoBarras()).append(" ");
        if (producto.getColor() != null) tokens.append(producto.getColor()).append(" ");
        if (producto.getCaracteristicas() != null) tokens.append(producto.getCaracteristicas()).append(" ");
        if (producto.getMarca() != null) tokens.append(producto.getMarca().getNombre()).append(" ");
        if (producto.getModeloDispositivo() != null) tokens.append(producto.getModeloDispositivo().getNombreModelo()).append(" ");
        if (producto.getCategoria() != null) tokens.append(producto.getCategoria().getNombre()).append(" ");

        String[] palabras = normalizar(tokens.toString()).split("\\s+");
        for (String palabra : palabras) {
            if (!palabra.isBlank()) {
                insertarPalabra(palabra, producto.getIdProducto());
            }
        }
    }

    private void insertarPalabra(String palabra, Integer productId) {
        TrieNode actual = root;
        actual.productIds.add(productId);

        for (char c : palabra.toCharArray()) {
            actual = actual.children.computeIfAbsent(c, k -> new TrieNode());
            actual.productIds.add(productId);
        }
        actual.isEndOfWord = true;
    }

    /**
     * Búsqueda por prefijo o palabras múltiples en el árbol Trie.
     * @param query Texto buscado (ej: "funda iphone argolla" o "inca kola")
     * @return Lista de productos que coinciden con los términos
     */
    public List<Producto> buscar(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>(productCache.values());
        }

        String[] palabras = normalizar(query).split("\\s+");
        Set<Integer> resultadoIds = null;

        for (String palabra : palabras) {
            if (palabra.isBlank()) continue;
            Set<Integer> idsCoincidentes = buscarPrefijo(palabra);

            if (resultadoIds == null) {
                resultadoIds = new HashSet<>(idsCoincidentes);
            } else {
                resultadoIds.retainAll(idsCoincidentes); // Intersección para búsqueda multi-palabra
            }

            if (resultadoIds.isEmpty()) break;
        }

        if (resultadoIds == null || resultadoIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Producto> lista = new ArrayList<>();
        for (Integer id : resultadoIds) {
            Producto p = productCache.get(id);
            if (p != null && Boolean.TRUE.equals(p.getActivo())) {
                lista.add(p);
            }
        }
        return lista;
    }

    /**
     * Búsqueda de prefijo pura en el árbol Trie O(L)
     */
    private Set<Integer> buscarPrefijo(String prefijo) {
        TrieNode actual = root;
        for (char c : prefijo.toCharArray()) {
            actual = actual.children.get(c);
            if (actual == null) {
                return Collections.emptySet();
            }
        }
        return actual.productIds;
    }

    /**
     * Desindexa un producto del caché en memoria
     */
    public void eliminarProducto(Integer productId) {
        productCache.remove(productId);
        // Para consistencia completa en trie podar o recargar
        recargarArbol();
    }

    /**
     * Normaliza texto eliminando tildes, caracteres especiales y convirtiendo a minúsculas.
     */
    private String normalizar(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").toLowerCase().replaceAll("[^a-z0-9\\s]", " ").trim();
    }
}