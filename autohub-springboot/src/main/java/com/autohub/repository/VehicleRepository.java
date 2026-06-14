package com.autohub.repository;

import com.autohub.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByPlateIgnoreCase(String plate);

    boolean existsByPlateIgnoreCase(String plate);

    List<Vehicle> findByPlateContainingIgnoreCase(String plate);

    List<Vehicle> findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(String brand, String model);

    List<Vehicle> findByUserRole(String userRole);

    List<Vehicle> findByOwnerNameContainingIgnoreCase(String ownerName);
}
