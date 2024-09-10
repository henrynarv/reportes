package com.adopciones.mascotas.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "imagenes-banner")
public class ImagenBanner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private  String url;
    private String descripcion;


    public ImagenBanner(String url, String descripcion) {
        this.url = url;
        this.descripcion = descripcion;
    }
}
