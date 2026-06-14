package com.autohub.service;

import com.autohub.dto.ProductDTO;
import com.autohub.exception.DuplicateResourceException;
import com.autohub.exception.ResourceNotFoundException;
import com.autohub.model.Product;
import com.autohub.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));
        return toDTO(product);
    }

    public List<ProductDTO> findLowStock() {
        return productRepository.findLowStockProducts().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public ProductDTO create(ProductDTO dto) {
        /* HTTP 409 Conflict — SKU já cadastrado */
        if (productRepository.existsBySkuIgnoreCase(dto.getSku())) {
            throw new DuplicateResourceException(
                "Produto com SKU '" + dto.getSku().toUpperCase() + "' já está cadastrado.",
                "DUPLICATE_SKU"
            );
        }

        return toDTO(productRepository.save(toEntity(dto)));
    }

    @Transactional
    public ProductDTO updateStock(Long id, Integer quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantidade em estoque não pode ser negativa.");
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));

        product.setStockQuantity(quantity);
        return toDTO(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produto", id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));

        if (!existing.getSku().equalsIgnoreCase(dto.getSku())
                && productRepository.existsBySkuIgnoreCase(dto.getSku())) {
            throw new DuplicateResourceException(
                "SKU '" + dto.getSku().toUpperCase() + "' já pertence a outro produto.",
                "DUPLICATE_SKU"
            );
        }

        existing.setSku(dto.getSku().toUpperCase());
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setStockQuantity(dto.getStockQuantity());
        existing.setCategory(dto.getCategory());
        existing.setLowStockThreshold(dto.getLowStockThreshold());

        return toDTO(productRepository.save(existing));
    }

    /* -------- Conversão Entidade <-> DTO -------- */

    private ProductDTO toDTO(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .sku(p.getSku())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stockQuantity(p.getStockQuantity())
                .category(p.getCategory())
                .lowStockThreshold(p.getLowStockThreshold())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private Product toEntity(ProductDTO dto) {
        return Product.builder()
                .sku(dto.getSku().toUpperCase())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .category(dto.getCategory())
                .lowStockThreshold(dto.getLowStockThreshold() != null ? dto.getLowStockThreshold() : 5)
                .build();
    }
}
