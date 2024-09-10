package com.adopciones.mascotas.entities;

import com.adopciones.mascotas.enums.TipoUsuario;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name="usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombres;
    private String apellidos;
    @Column(unique = true)
    private String email;
    private String password;

    private String urlImagen;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario;



}
