package com.daam.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(name = "first", nullable = false)
    private String first;
    @Column(name = "last", nullable = false)
    private String last;
    private String phone;
    private String email;
    private String imageUrl;
    private String pan;
    private Integer expiryMonth;
    private Integer expiryYear;
    @Column(nullable = false)
    private String roles;
}