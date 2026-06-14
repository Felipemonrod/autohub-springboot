package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.ServiceOrderDTO;
import com.autohub.service.ServiceOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Controller MVC para Ordens de Serviço (OS).
 *
 * Códigos RFC 7231 implementados:
 *   - 200 OK      → GET e PATCH (atualização de status)
 *   - 201 Created → POST com cabeçalho Location
 *   - 404         → tratado em GlobalExceptionHandler
 */
@RestController
@RequestMapping("/api/service-orders")
@RequiredArgsConstructor
public class ServiceOrderController {

    private final ServiceOrderService orderService;

    /** GET /api/service-orders → 200 OK */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceOrderDTO>>> listAll() {
        return ResponseEntity.ok(ApiResponse.ok(orderService.findAll()));
    }

    /** GET /api/service-orders/{id} → 200 OK | 404 */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceOrderDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.findById(id)));
    }

    /** GET /api/service-orders/vehicle/{vehicleId} → 200 OK */
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<ApiResponse<List<ServiceOrderDTO>>> getByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.findByVehicle(vehicleId)));
    }

    /**
     * POST /api/service-orders → 201 Created
     * Cabeçalho Location aponta para a OS recém-criada.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ServiceOrderDTO>> create(@Valid @RequestBody ServiceOrderDTO dto) {
        ServiceOrderDTO created = orderService.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created(created, "Ordem de serviço criada com sucesso."));
    }

    /**
     * PATCH /api/service-orders/{id}/status → 200 OK | 404
     * Body: { "status": "EM_ANDAMENTO" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ServiceOrderDTO>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(
                ApiResponse.ok(orderService.updateStatus(id, status), "Status atualizado.")
        );
    }
}
