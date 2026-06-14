package com.autohub.pattern.strategy;

import com.autohub.model.Vehicle;
import com.autohub.repository.VehicleRepository;

import java.util.List;

/**
 * Padrão Strategy — interface para diferentes algoritmos de busca de veículos.
 * Cada implementação encapsula uma forma distinta de pesquisa no repositório.
 */
public interface SearchStrategy {

    List<Vehicle> search(String query, VehicleRepository repository);

    String getStrategyName();
}
