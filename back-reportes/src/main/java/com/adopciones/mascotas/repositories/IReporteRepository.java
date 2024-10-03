package com.adopciones.mascotas.repositories;

import com.adopciones.mascotas.entities.ReporteCiudadano;
import com.adopciones.mascotas.enums.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IReporteRepository extends JpaRepository<ReporteCiudadano , Long> {
    List<ReporteCiudadano> findByUsuarioId(Long usuarioId);
    List<ReporteCiudadano> findByProvincia(Provincia provincia);

    // Método para contar reportes por tipo y provincia
    @Query("SELECT r.tipo, COUNT(r) FROM ReporteCiudadano r WHERE r.provincia = :provincia GROUP BY r.tipo")
    List<Object[]> contarReportesPorTipoYProvincia(@Param("provincia")Provincia provincia);

}
