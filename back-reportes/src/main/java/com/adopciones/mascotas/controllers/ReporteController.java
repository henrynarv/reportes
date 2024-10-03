package com.adopciones.mascotas.controllers;

import com.adopciones.mascotas.enbebidos.Ubicacion;
import com.adopciones.mascotas.entities.HistorialEstado;
import com.adopciones.mascotas.entities.ReporteCiudadano;
import com.adopciones.mascotas.entities.TipoReporte;
import com.adopciones.mascotas.entities.Usuario;
import com.adopciones.mascotas.enums.EstadoReporte;
import com.adopciones.mascotas.enums.Provincia;
import com.adopciones.mascotas.excepciones.EntidadNotFoundException;
import com.adopciones.mascotas.repositories.IHistorialEstadoRepository;
import com.adopciones.mascotas.services.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:4200")
public class ReporteController {

    @Autowired
    IReporteService reporteService;

    @Autowired
    IUsuarioService usuarioService;

    @Autowired
    ITipoReporteService tipoReporteService;

    @Autowired
    private UploadFileBannerService uploadFileBannerService;

    @Autowired
    private IHistorialEstadoRepository historialEstadoRepository;

    @GetMapping
    public ResponseEntity<?> listarReportes(){
        try {
            List<ReporteCiudadano> reportes = reporteService.listarTodo();
            if(reportes.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron reportes en la base de datos");
            }else{
                return ResponseEntity.status(HttpStatus.OK).body(reportes);
            }
        }catch (RuntimeException e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/registrar")
    //@RequestPart("reporte") ReporteCiudadano reporteCiudadano,
    // Parte del formulario que contiene el objeto ReporteCiudadano
    //se peude usar en lugar de @RequestParam cuando mandas texto y archivos
    public ResponseEntity<?> registrarReporte(@RequestParam("usuarioId") Long usuarioId,
                                              @RequestParam("tipoReporteId") Long tipoReporteId,
                                              @RequestParam("provincia") String provincia,
                                              @RequestParam("descripcion") String descripcion,
                                              @RequestParam("latitud") double latitud,
                                              @RequestParam("longitud") double longitud,
                                              @RequestParam(value = "imagen", required = false)MultipartFile imagen){
        try {
            //ACA CREO UN NUEVO REPORTE CIUDADADANO
            ReporteCiudadano reporteCiudadano = new ReporteCiudadano();
            Optional<Usuario> usuarioOpt = usuarioService.encontrarPorId(usuarioId);
            Optional<TipoReporte> tipoReporteOpt = tipoReporteService.buscarPorId(tipoReporteId);

            if (usuarioOpt.isPresent() && tipoReporteOpt.isPresent()){
                Usuario usuario = usuarioOpt.get();
                TipoReporte tipoReporte =  tipoReporteOpt.get();
            //ASIGNO LOS ATRIBUTOS AL REPORTE
                reporteCiudadano.setUsuario(usuario);
                reporteCiudadano.setTipo(tipoReporte);
                reporteCiudadano.setDescripcion(descripcion);
                reporteCiudadano.setUbicacion(new Ubicacion(latitud, longitud));



                reporteCiudadano.setEstado(EstadoReporte.PENDIENTE);

                // Convertir el String a la enumeración
                Provincia provinciaEnum = Provincia.valueOf(provincia.toUpperCase());
                reporteCiudadano.setProvincia(provinciaEnum);

                if(imagen != null && !imagen.isEmpty()){
                    // Guardar la imagen y obtener la URL
                    String imagenUrl = uploadFileBannerService.saveFile(imagen);
                    reporteCiudadano.setImagenUrl(imagenUrl);
                }


                //GUARDAR EL REPORTE
                ReporteCiudadano nuevoReporte = reporteService.gardarReporte(reporteCiudadano);
                HistorialEstado historialEstado = new HistorialEstado();

                historialEstado.setReporte(nuevoReporte);
                historialEstado.setEstado(EstadoReporte.PENDIENTE);
                historialEstadoRepository.save(historialEstado);
                return ResponseEntity.status(HttpStatus.CREATED).body(nuevoReporte);

            }else {
                String mensaje ="El usuario que pretende crear reporte no existe";
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
            }


        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cargar la imagen: "+e.getMessage());
        }catch (ResponseStatusException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerReportePorID (@PathVariable Long id){
        try {
            Optional<ReporteCiudadano> reporteOpt = reporteService.buscarPorId(id);
            if(reporteOpt.isPresent()){
                ReporteCiudadano reporte = reporteOpt.get();
                return  ResponseEntity.status(HttpStatus.OK).body(reporte);
            }else{
                String mensaje = "Reporte no encontrado con ID " +id;
                return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
            }
            //  CUANDOS E HAGA LAS PRUEBAS EN OSTMAN VERIFICAR SI ESTAS EXCEPCIONES
            //SON REDUNDATES CON RESPECTO AL SERVICIO reporteService.buscarPorId(id)
        }catch (RuntimeException e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }


    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReporte(@PathVariable Long id){
        try{
            Optional<ReporteCiudadano> reporteOpt = reporteService.buscarPorId(id);
            if(reporteOpt.isPresent()){
                ReporteCiudadano reporte = reporteOpt.get();
                reporteService.eliminarReporte(id);


                //Elimina el video o imagen del sistema de archivos
                String imagenUrl = reporte.getImagenUrl();
                if(imagenUrl != null && !imagenUrl.isEmpty()){
                    String imageName = imagenUrl.substring(imagenUrl.lastIndexOf('/')+1);
                    uploadFileBannerService.delete(imageName);
                }
            }else{
                String mensaje = "Reporte no encontrado con ID: "+id;
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
            }

            return ResponseEntity.status(HttpStatus.OK).body("Reporte eliminado con exito");

        }catch (EntidadNotFoundException e){
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerReportesPorUsuario(@PathVariable Long usuarioId){
        try {
            List<ReporteCiudadano> reportes = reporteService.obtnerReportesPorUsuario(usuarioId);
            if(reportes.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron reportes para el usuario con ID: "+ usuarioId);
            }else{
                return ResponseEntity.status(HttpStatus.OK).body(reportes);
            }
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor: "+e.getMessage());
        }
    }


    @PutMapping("/{id}/estado")
    public ResponseEntity<ReporteCiudadano> actualizarEstado(@PathVariable Long id, @RequestBody String nuevoEstado){
        ReporteCiudadano reporte = reporteService.buscarPorId(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reporte no encontrado"));

        //CONVIERTE EL STRING A ENUM
        EstadoReporte estado = EstadoReporte.valueOf(nuevoEstado);
        reporte.setEstado(estado);
        reporteService.gardarReporte(reporte);

        //  GUARDAR EN HISTORIAL
        HistorialEstado historialEstado = new HistorialEstado();

        historialEstado.setReporte(reporte);
        historialEstado.setEstado(estado);
        historialEstadoRepository.save(historialEstado);

        return ResponseEntity.ok(reporte);
    }


    @GetMapping("/provincia/{provincia}")
    public ResponseEntity<?> getReportesPorProvincia(@PathVariable Provincia provincia){
        try {
            List<ReporteCiudadano> reportes = reporteService.obtenerReportePorProvincia(provincia);
            return  ResponseEntity.status(HttpStatus.OK).body(reportes);
        }catch (Exception e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/contar/{provincia}")
    public ResponseEntity<?> contarReportesPorTipoYProvincia (@PathVariable Provincia provincia){
        try {
            Map<String, Long> conteo = reporteService.contarReportesPorTipoYProvincia(provincia);
            return ResponseEntity.status(HttpStatus.OK).body(conteo);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
