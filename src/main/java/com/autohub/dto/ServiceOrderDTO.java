package com.autohub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceOrderDTO {

    private Long id;

    @NotNull(message = "ID do veículo é obrigatório")
    private Long vehicleId;

    /* Campos desnormalizados para exibição */
    private String vehiclePlate;
    private String vehicleBrand;
    private String vehicleModel;

    @NotBlank(message = "Descrição do serviço é obrigatória")
    private String description;

    /* AGUARDANDO | EM_ANDAMENTO | CONCLUIDO | CANCELADO */
    private String status;

    @Size(max = 100)
    private String shopName;

    @DecimalMin(value = "0.0", message = "Valor total não pode ser negativo")
    private BigDecimal totalPrice;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
