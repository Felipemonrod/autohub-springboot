package com.autohub.pattern.strategy;

import com.autohub.model.Vehicle;
import com.autohub.repository.VehicleRepository;

import java.util.List;

/** Busca veículos pela placa (parcial, case-insensitive). */
public class PlateSearchStrategy implements SearchStrategy {

    @Override
    public List<Vehicle> search(String query, VehicleRepository repository) {
        return repository.findByPlateContainingIgnoreCase(query);
    }

    @Override
    public String getStrategyName() {
        return "plate";
    }
}
