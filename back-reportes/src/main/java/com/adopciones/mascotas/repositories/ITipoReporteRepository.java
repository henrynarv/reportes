package com.adopciones.mascotas.repositories;

import com.adopciones.mascotas.entities.TipoReporte;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ITipoReporteRepository extends JpaRepository<TipoReporte, Long> {
}
