package com.autohub.pattern.strategy;

import com.autohub.model.Vehicle;
import com.autohub.repository.VehicleRepository;

import java.util.List;

/** Busca veículos por marca ou modelo (parcial, case-insensitive). */
public class NameSearchStrategy implements SearchStrategy {

    @Override
    public List<Vehicle> search(String query, VehicleRepository repository) {
        return repository.findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(query, query);
    }

    @Override
    public String getStrategyName() {
        return "name";
    }
}
