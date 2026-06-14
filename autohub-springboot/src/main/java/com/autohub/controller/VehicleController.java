package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.VehicleDTO;
import com.autohub.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Controller MVC para veículos.
 *
 * Códigos RFC 7231 implementados:
 *   - 200 OK         → GET (listagem e busca por ID)
 *   - 201 Created    → POST com cabeçalho Location apontando para o recurso criado
 *   - 204 No Content → DELETE
 *   - 404 Not Found  → recurso inexistente (tratado em GlobalExceptionHandler)
 *   - 409 Conflict   → placa duplicada    (tratado em GlobalExceptionHandler)
 */
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    /** GET /api/vehicles → 200 OK */
    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleDTO>>> listAll() {
        List<VehicleDTO> vehicles = vehicleService.findAll();
        return ResponseEntity.ok(ApiResponse.ok(vehicles));
    }

    /** GET /api/vehicles/{id} → 200 OK | 404 Not Found */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.findById(id)));
    }

    /**
     * POST /api/vehicles → 201 Created | 409 Conflict
     *
     * RFC 7231, Section 6.3.2 — 201 Created:
     *   "The request has been fulfilled and has resulted in one or more new resources being created.
     *    The primary resource created by the request is identified by a Location header field."
     *
     * O cabeçalho Location retorna a URI do recurso criado:
     *   Location: http://localhost:8080/api/vehicles/5
     */
    @PostMapping
    public ResponseEntity<ApiResponse<VehicleDTO>> create(@Valid @RequestBody VehicleDTO dto) {
        VehicleDTO created = vehicleService.create(dto);

        /* Constrói a URI do novo recurso para o cabeçalho Location */
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity
                .created(location)                                      // HTTP 201 + Location header
                .body(ApiResponse.created(created, "Veículo cadastrado com sucesso."));
    }

    /** PUT /api/vehicles/{id} → 200 OK | 404 Not Found | 409 Conflict */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody VehicleDTO dto) {
        return ResponseEntity.ok(
                ApiResponse.ok(vehicleService.update(id, dto), "Veículo atualizado com sucesso.")
        );
    }

    /** DELETE /api/vehicles/{id} → 204 No Content | 404 Not Found */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/vehicles/search?q=ABC&strategy=plate
     * Usa o padrão Strategy para alternar o algoritmo de busca.
     * Strategies: "plate" (default) | "name"
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<VehicleDTO>>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "plate") String strategy) {
        List<VehicleDTO> results = vehicleService.search(q, strategy);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}
