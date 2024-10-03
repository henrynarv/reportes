package com.adopciones.mascotas.entities;

import com.adopciones.mascotas.enbebidos.Ubicacion;
import com.adopciones.mascotas.enums.EstadoReporte;
import com.adopciones.mascotas.enums.Provincia;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "reportes-ciudadano")
public class ReporteCiudadano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "tipo_reporte_id")
    private TipoReporte tipo;

    private String descripcion;

    @Embedded
    private Ubicacion ubicacion;

    private String imagenUrl;

    @Enumerated(EnumType.STRING)
    private EstadoReporte estado;


    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    private Provincia provincia;

    @CreationTimestamp
    private LocalDateTime fechaHoraReporte;
}
