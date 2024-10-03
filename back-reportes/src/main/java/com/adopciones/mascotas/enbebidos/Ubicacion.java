package com.adopciones.mascotas.enbebidos;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ubicacion {
    private double latitud;
    private double longitud;
}
