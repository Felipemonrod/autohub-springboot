package com.autohub.repository;

import com.autohub.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySkuIgnoreCase(String sku);

    boolean existsBySkuIgnoreCase(String sku);

    List<Product> findByCategory(String category);

    List<Product> findByNameContainingIgnoreCase(String name);

    /* Produtos com estoque abaixo do limiar configurado */
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.lowStockThreshold AND p.lowStockThreshold IS NOT NULL")
    List<Product> findLowStockProducts();
}
