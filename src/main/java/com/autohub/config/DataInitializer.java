package com.autohub.config;

import com.autohub.model.Product;
import com.autohub.model.ServiceOrder;
import com.autohub.model.Vehicle;
import com.autohub.repository.ProductRepository;
import com.autohub.repository.ServiceOrderRepository;
import com.autohub.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Popula o banco SQLite com dados de demonstração na primeira inicialização.
 * Só insere dados se o banco estiver vazio.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;
    private final ServiceOrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (vehicleRepository.count() > 0) {
            log.info("Banco já possui dados — seed ignorado.");
            return;
        }

        log.info("Inicializando banco com dados de demonstração...");

        /* ---- Veículos ---- */
        Vehicle v1 = vehicleRepository.save(Vehicle.builder()
                .plate("ABC1234")
                .brand("Toyota")
                .model("Corolla")
                .year(2021)
                .color("Prata")
                .ownerName("João Silva")
                .userRole("CLIENTE")
                .build());

        Vehicle v2 = vehicleRepository.save(Vehicle.builder()
                .plate("DEF5678")
                .brand("Honda")
                .model("Civic")
                .year(2019)
                .color("Preto")
                .ownerName("Maria Souza")
                .userRole("CLIENTE")
                .build());

        Vehicle v3 = vehicleRepository.save(Vehicle.builder()
                .plate("GHI9J10")
                .brand("Ford")
                .model("Ka")
                .year(2020)
                .color("Branco")
                .ownerName("Carlos Melo")
                .userRole("OFICINA")
                .build());

        /* ---- Ordens de Serviço ---- */
        orderRepository.save(ServiceOrder.builder()
                .vehicle(v1)
                .description("Troca de óleo e filtros completo")
                .status("CONCLUIDO")
                .shopName("AutoMecânica Central")
                .totalPrice(new BigDecimal("320.00"))
                .build());

        orderRepository.save(ServiceOrder.builder()
                .vehicle(v2)
                .description("Revisão dos freios dianteiros e traseiros")
                .status("EM_ANDAMENTO")
                .shopName("Freios & Cia")
                .totalPrice(new BigDecimal("580.00"))
                .build());

        orderRepository.save(ServiceOrder.builder()
                .vehicle(v3)
                .description("Alinhamento e balanceamento")
                .status("AGUARDANDO")
                .shopName("AutoMecânica Central")
                .totalPrice(new BigDecimal("150.00"))
                .build());

        /* ---- Produtos ---- */
        productRepository.save(Product.builder()
                .sku("FILTRO-OLEO-001")
                .name("Filtro de Óleo Universal")
                .description("Filtro de óleo compatível com motores 1.0 a 2.0")
                .price(new BigDecimal("45.90"))
                .stockQuantity(120)
                .category("Filtros")
                .lowStockThreshold(10)
                .build());

        productRepository.save(Product.builder()
                .sku("PASTILHA-FREIO-001")
                .name("Pastilha de Freio Dianteira")
                .description("Pastilha cerâmica para veículos de passeio")
                .price(new BigDecimal("189.90"))
                .stockQuantity(45)
                .category("Freios")
                .lowStockThreshold(8)
                .build());

        productRepository.save(Product.builder()
                .sku("OLEO-5W30-001")
                .name("Óleo Motor 5W30 Sintético 1L")
                .description("Óleo sintético de alta performance")
                .price(new BigDecimal("78.50"))
                .stockQuantity(3)
                .category("Lubrificantes")
                .lowStockThreshold(5)
                .build());

        productRepository.save(Product.builder()
                .sku("CORREIA-DIST-001")
                .name("Kit Correia Dentada")
                .description("Kit completo com correia, tensor e bomba d'água")
                .price(new BigDecimal("420.00"))
                .stockQuantity(15)
                .category("Motor")
                .lowStockThreshold(3)
                .build());

        productRepository.save(Product.builder()
                .sku("AMORTECEDOR-001")
                .name("Amortecedor Dianteiro Esquerdo")
                .description("Amortecedor a gás para veículos de passeio")
                .price(new BigDecimal("310.00"))
                .stockQuantity(2)
                .category("Suspensão")
                .lowStockThreshold(4)
                .build());

        log.info("Dados de demonstração inseridos com sucesso.");
    }
}
