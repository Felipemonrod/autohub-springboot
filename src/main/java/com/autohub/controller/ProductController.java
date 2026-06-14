package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.ProductDTO;
import com.autohub.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Controller MVC para Produtos (peças automotivas).
 *
 * Códigos RFC 7231 implementados:
 *   - 200 OK      → GET e PUT (atualização de estoque)
 *   - 201 Created → POST com cabeçalho Location
 *   - 409 Conflict → SKU duplicado (tratado em GlobalExceptionHandler)
 *   - 404         → tratado em GlobalExceptionHandler
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /** GET /api/products → 200 OK */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDTO>>> listAll() {
        return ResponseEntity.ok(ApiResponse.ok(productService.findAll()));
    }

    /** GET /api/products/{id} → 200 OK | 404 */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.findById(id)));
    }

    /** GET /api/products/low-stock → 200 OK (lista produtos com estoque baixo) */
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getLowStock() {
        return ResponseEntity.ok(ApiResponse.ok(productService.findLowStock()));
    }

    /**
     * POST /api/products → 201 Created | 409 Conflict
     * Cabeçalho Location aponta para o produto criado.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> create(@Valid @RequestBody ProductDTO dto) {
        ProductDTO created = productService.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created(created, "Produto cadastrado com sucesso."));
    }

    /** PUT /api/products/{id} → 200 OK | 404 | 409 */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(
                ApiResponse.ok(productService.update(id, dto), "Produto atualizado com sucesso.")
        );
    }

    /** DELETE /api/products/{id} → 204 No Content | 404 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/products/{id}/stock → 200 OK | 404
     * Body: { "quantity": 50 }
     */
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<ProductDTO>> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        return ResponseEntity.ok(
                ApiResponse.ok(productService.updateStock(id, quantity), "Estoque atualizado.")
        );
    }
}
