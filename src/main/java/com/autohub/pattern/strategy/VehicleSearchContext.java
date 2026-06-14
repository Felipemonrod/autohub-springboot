package com.autohub.pattern.strategy;

import com.autohub.model.Vehicle;
import com.autohub.repository.VehicleRepository;

import java.util.List;

/**
 * Contexto do padrão Strategy.
 * Recebe uma estratégia em tempo de execução e a delega para a busca.
 *
 * Uso:
 *   VehicleSearchContext ctx = new VehicleSearchContext(new PlateSearchStrategy());
 *   List<Vehicle> results = ctx.executeSearch("ABC", repository);
 */
public class VehicleSearchContext {

    private SearchStrategy strategy;

    public VehicleSearchContext(SearchStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(SearchStrategy strategy) {
        this.strategy = strategy;
    }

    public List<Vehicle> executeSearch(String query, VehicleRepository repository) {
        return strategy.search(query, repository);
    }

    public String getCurrentStrategyName() {
        return strategy.getStrategyName();
    }

    /**
     * Método utilitário — resolve a estratégia a partir de uma string de parâmetro de URL.
     */
    public static VehicleSearchContext fromStrategyName(String strategyName) {
        SearchStrategy resolved = switch (strategyName.toLowerCase()) {
            case "plate", "placa" -> new PlateSearchStrategy();
            case "name", "nome"   -> new NameSearchStrategy();
            default               -> new PlateSearchStrategy();
        };
        return new VehicleSearchContext(resolved);
    }
}
