package com.autohub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;

    @NotBlank(message = "SKU é obrigatório")
    @Size(max = 50)
    private String sku;

    @NotBlank(message = "Nome do produto é obrigatório")
    @Size(max = 100)
    private String name;

    private String description;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    private BigDecimal price;

    @NotNull(message = "Quantidade em estoque é obrigatória")
    @Min(value = 0, message = "Estoque não pode ser negativo")
    private Integer stockQuantity;

    @Size(max = 50)
    private String category;

    @Min(value = 0)
    private Integer lowStockThreshold;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
