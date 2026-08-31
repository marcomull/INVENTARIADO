package com.empresa.inventariado.infrastructure.specifications;

import com.empresa.inventariado.domain.model.Usuario;
import com.empresa.inventariado.domain.model.Usuario.Rol;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class UsuarioSpecification {
    public static Specification<Usuario> withFilters(String searchTerm, String rol) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            // Siempre filtramos por usuarios activos
            predicates.add(criteriaBuilder.isTrue(root.get("activo")));
            // Filtro por término de búsqueda (nombre, apellido o correo)
            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                String searchTermLower = "%" + searchTerm.toLowerCase() + "%";
                Predicate searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("nombre")), searchTermLower),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("apellido")), searchTermLower),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("correo")), searchTermLower)
                );
                predicates.add(searchPredicate);
            }
            // Filtro por rol
            if (rol != null && !rol.trim().isEmpty() && !rol.equalsIgnoreCase("TODOS")) {
                try {
                    Rol rolEnum = Rol.valueOf(rol.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("rol"), rolEnum));
                } catch (IllegalArgumentException e) {
                }
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}