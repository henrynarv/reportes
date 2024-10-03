package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.ReporteCiudadano;
import com.adopciones.mascotas.enums.Provincia;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IReporteService {
    ReporteCiudadano gardarReporte(ReporteCiudadano reporteCiudadano);

    List<ReporteCiudadano>listarTodo();

    Optional<ReporteCiudadano> buscarPorId(long id);

    void eliminarReporte(Long id);

    List<ReporteCiudadano> obtnerReportesPorUsuario(Long usuarioId);

    List<ReporteCiudadano> obtenerReportePorProvincia(Provincia provincia);

    Map<String , Long> contarReportesPorTipoYProvincia(Provincia provincia);
}
