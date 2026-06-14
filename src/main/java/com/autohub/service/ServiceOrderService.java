package com.autohub.service;

import com.autohub.dto.ServiceOrderDTO;
import com.autohub.exception.ResourceNotFoundException;
import com.autohub.model.ServiceOrder;
import com.autohub.model.Vehicle;
import com.autohub.repository.ServiceOrderRepository;
import com.autohub.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ServiceOrderService {

    private static final Set<String> VALID_STATUSES =
            Set.of("AGUARDANDO", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO");

    private final ServiceOrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;

    public List<ServiceOrderDTO> findAll() {
        return orderRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public ServiceOrderDTO findById(Long id) {
        ServiceOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordem de Serviço", id));
        return toDTO(order);
    }

    public List<ServiceOrderDTO> findByVehicle(Long vehicleId) {
        return orderRepository.findByVehicleId(vehicleId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public ServiceOrderDTO create(ServiceOrderDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Veículo", dto.getVehicleId()));

        ServiceOrder order = ServiceOrder.builder()
                .vehicle(vehicle)
                .description(dto.getDescription())
                .status("AGUARDANDO")
                .shopName(dto.getShopName())
                .totalPrice(dto.getTotalPrice())
                .build();

        return toDTO(orderRepository.save(order));
    }

    @Transactional
    public ServiceOrderDTO updateStatus(Long id, String newStatus) {
        String statusUpper = newStatus.toUpperCase();
        if (!VALID_STATUSES.contains(statusUpper)) {
            throw new IllegalArgumentException(
                "Status inválido: '" + newStatus + "'. Use: " + VALID_STATUSES
            );
        }

        ServiceOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordem de Serviço", id));

        order.setStatus(statusUpper);
        return toDTO(orderRepository.save(order));
    }

    /* -------- Conversão Entidade <-> DTO -------- */

    private ServiceOrderDTO toDTO(ServiceOrder o) {
        return ServiceOrderDTO.builder()
                .id(o.getId())
                .vehicleId(o.getVehicle().getId())
                .vehiclePlate(o.getVehicle().getPlate())
                .vehicleBrand(o.getVehicle().getBrand())
                .vehicleModel(o.getVehicle().getModel())
                .description(o.getDescription())
                .status(o.getStatus())
                .shopName(o.getShopName())
                .totalPrice(o.getTotalPrice())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}
