package com.daam.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.sql.Timestamp;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long userid;
    @Column(nullable = false)
    private Timestamp ordertime;
    private Timestamp pickuptime;
    private String area;
    private String location;
    @Column(nullable = false)
    private Double tax;
    @Column(nullable = false)
    private Double tip;
    @Column(nullable = false)
    private String pan;
    @Column(nullable = false)
    private Integer expiryMonth;
    @Column(nullable = false)
    private Integer expiryYear;
    private String status;
}