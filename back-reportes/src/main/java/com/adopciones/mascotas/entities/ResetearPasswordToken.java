package com.adopciones.mascotas.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "resetear-password")
public class ResetearPasswordToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token;

    @OneToOne(targetEntity = Usuario.class, fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private Usuario user;

    @Column(nullable = false)
    private LocalDateTime expireDate;



}

