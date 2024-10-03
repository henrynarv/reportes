package com.adopciones.mascotas.repositories;

import com.adopciones.mascotas.entities.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IHistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {
    List<HistorialEstado> findByReporteId(Long reporteId);
}
