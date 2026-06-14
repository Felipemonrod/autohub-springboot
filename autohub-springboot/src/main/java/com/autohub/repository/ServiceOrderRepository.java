package com.autohub.repository;

import com.autohub.model.ServiceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {

    List<ServiceOrder> findByVehicleId(Long vehicleId);

    List<ServiceOrder> findByStatus(String status);

    List<ServiceOrder> findByShopNameContainingIgnoreCase(String shopName);

    long countByStatus(String status);
}
