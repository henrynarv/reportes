package com.adopciones.mascotas.services;

import com.adopciones.mascotas.controllers.ImagenBannerController;
import com.adopciones.mascotas.entities.ReporteCiudadano;
import com.adopciones.mascotas.enums.Provincia;
import com.adopciones.mascotas.excepciones.EntidadNotFoundException;
import com.adopciones.mascotas.excepciones.ImageNotFoundException;
import com.adopciones.mascotas.repositories.IReporteRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReporteServiceImpl implements   IReporteService{

    private static final Logger log = LoggerFactory.getLogger(ImagenBannerController.class);
    @Autowired
    private IReporteRepository reporteRepository;


    @Override
    public ReporteCiudadano gardarReporte(ReporteCiudadano reporteCiudadano) {
        try {
            return reporteRepository.save(reporteCiudadano);

        } catch (Exception e) {
            // Log de detalle para cualquier otro problema inesperado
            log.error("Error al crear Reporte: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al crear Reporte", e);
        }
    }

    @Override
    public List<ReporteCiudadano> listarTodo() {
        try {
            return reporteRepository.findAll();
        }catch (Exception e){
            throw new RuntimeException("Error al obtener reportes ",e);
        }
    }


    // EN LOS SERVICIOS NO SE MANEJAN LOS RESPUESTAS HTTP EJEMPLO  INTERNAL_SERVER...
    @Override
    public Optional<ReporteCiudadano> buscarPorId(long id) {
        try {
            return reporteRepository.findById(id);
        }catch (DataAccessException e){
            throw  new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al accdeder a la base de datos ",e);
        }catch (Exception e){
            throw  new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al obtener reporte por ID ", e);
        }
    }

    @Override
    public void eliminarReporte(Long id) {
        try{
            reporteRepository.deleteById(id);

        }catch (EmptyResultDataAccessException e){
            throw new EntidadNotFoundException("Reporte no encontarada con ID: "+ id);
        }catch (Exception e){
            throw  new RuntimeException("Error al eliminar reporte de la base de datos");
        }
    }

    @Override
    public List<ReporteCiudadano> obtnerReportesPorUsuario(Long usuarioId) {
        try {
          return  reporteRepository.findByUsuarioId(usuarioId);
        }catch (DataAccessException e){
            throw  new RuntimeException("Error al acceder al a base de datos");
        }catch (Exception e){
            throw  new RuntimeException("Error al obtener reportes del usuario");
        }
    }

    @Override
    public List<ReporteCiudadano> obtenerReportePorProvincia(Provincia provincia) {
        return reporteRepository.findByProvincia(provincia);
    }

    @Override
    public Map<String, Long> contarReportesPorTipoYProvincia(Provincia provincia) {
        List<Object[]> results = reporteRepository.contarReportesPorTipoYProvincia(provincia);
        Map<String, Long> conteo = new HashMap<>();
        for(Object[] result : results){
            conteo.put(result[0].toString(), (Long) result[1]);
        }
        return conteo;
    }
}
