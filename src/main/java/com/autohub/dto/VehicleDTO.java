package com.autohub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {

    private Long id;

    @NotBlank(message = "Placa é obrigatória")
    @Pattern(regexp = "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$",
             message = "Placa inválida. Use o formato antigo (ABC1234) ou Mercosul (ABC1D23)")
    private String plate;

    @NotBlank(message = "Marca é obrigatória")
    @Size(max = 50)
    private String brand;

    @NotBlank(message = "Modelo é obrigatório")
    @Size(max = 50)
    private String model;

    @NotNull(message = "Ano é obrigatório")
    @Min(value = 1886, message = "Ano inválido")
    @Max(value = 2100, message = "Ano inválido")
    private Integer year;

    @Size(max = 30)
    private String color;

    @Size(max = 100)
    private String ownerName;

    @NotBlank(message = "Perfil de usuário é obrigatório (CLIENTE ou OFICINA)")
    private String userRole;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
