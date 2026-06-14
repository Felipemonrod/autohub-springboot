package com.autohub.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Vehicle vehicle;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    /* Status: AGUARDANDO, EM_ANDAMENTO, CONCLUIDO, CANCELADO */
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "shop_name", length = 100)
    private String shopName;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
