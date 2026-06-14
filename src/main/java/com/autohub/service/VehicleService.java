package com.autohub.service;

import com.autohub.dto.VehicleDTO;
import com.autohub.exception.DuplicateResourceException;
import com.autohub.exception.ResourceNotFoundException;
import com.autohub.model.Vehicle;
import com.autohub.pattern.factory.UserRoleFactory;
import com.autohub.pattern.strategy.VehicleSearchContext;
import com.autohub.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<VehicleDTO> findAll() {
        return vehicleRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public VehicleDTO findById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo", id));
        return toDTO(vehicle);
    }

    @Transactional
    public VehicleDTO create(VehicleDTO dto) {
        /* Valida que o papel de usuário é reconhecido antes de salvar */
        UserRoleFactory.create(dto.getUserRole());

        /* HTTP 409 Conflict — placa já cadastrada */
        if (vehicleRepository.existsByPlateIgnoreCase(dto.getPlate())) {
            throw new DuplicateResourceException(
                "Veículo com placa '" + dto.getPlate().toUpperCase() + "' já está cadastrado.",
                "DUPLICATE_PLATE"
            );
        }

        Vehicle saved = vehicleRepository.save(toEntity(dto));
        return toDTO(saved);
    }

    @Transactional
    public VehicleDTO update(Long id, VehicleDTO dto) {
        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo", id));

        /* Só valida duplicidade de placa se ela foi alterada */
        if (!existing.getPlate().equalsIgnoreCase(dto.getPlate())
                && vehicleRepository.existsByPlateIgnoreCase(dto.getPlate())) {
            throw new DuplicateResourceException(
                "Placa '" + dto.getPlate().toUpperCase() + "' já pertence a outro veículo.",
                "DUPLICATE_PLATE"
            );
        }

        existing.setPlate(dto.getPlate().toUpperCase());
        existing.setBrand(dto.getBrand());
        existing.setModel(dto.getModel());
        existing.setYear(dto.getYear());
        existing.setColor(dto.getColor());
        existing.setOwnerName(dto.getOwnerName());
        existing.setUserRole(dto.getUserRole().toUpperCase());

        return toDTO(vehicleRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Veículo", id);
        }
        vehicleRepository.deleteById(id);
    }

    /**
     * Busca usando o padrão Strategy.
     * @param query    Termo de busca
     * @param strategy "plate" | "name" (padrão: "plate")
     */
    public List<VehicleDTO> search(String query, String strategy) {
        VehicleSearchContext ctx = VehicleSearchContext.fromStrategyName(strategy);
        return ctx.executeSearch(query, vehicleRepository).stream()
                .map(this::toDTO)
                .toList();
    }

    /* -------- Conversão Entidade <-> DTO -------- */

    private VehicleDTO toDTO(Vehicle v) {
        return VehicleDTO.builder()
                .id(v.getId())
                .plate(v.getPlate())
                .brand(v.getBrand())
                .model(v.getModel())
                .year(v.getYear())
                .color(v.getColor())
                .ownerName(v.getOwnerName())
                .userRole(v.getUserRole())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
    }

    private Vehicle toEntity(VehicleDTO dto) {
        return Vehicle.builder()
                .plate(dto.getPlate().toUpperCase())
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .color(dto.getColor())
                .ownerName(dto.getOwnerName())
                .userRole(dto.getUserRole().toUpperCase())
                .build();
    }
}
