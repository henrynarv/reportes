package com.adopciones.mascotas.controllers;

import com.adopciones.mascotas.entities.TipoReporte;
import com.adopciones.mascotas.services.ITipoReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/tipos-reporte")
@CrossOrigin(origins = "http://localhost:4200")
public class TipoReporteController {

    @Autowired
    ITipoReporteService tipoReporteService;

    @PostMapping
    public ResponseEntity<?> guardarTipReporte(@RequestBody TipoReporte tipoReporte){
        try{
            TipoReporte nuevoTipoReporte =  tipoReporteService.registrarTipoReporte(tipoReporte);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTipoReporte);
        }catch (Exception e){
            String mensaje = "Error al gurdar tipod e reporte";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mensaje + " " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTipoReportes(){
        try{
            List<TipoReporte> tipos = tipoReporteService.listarTodo();
            if(tipos.isEmpty()){
                String mensaje = "No hay Tipos de reportes en la base de datos";
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
            }else{
                return ResponseEntity.status(HttpStatus.OK).body(tipos);
            }
        }catch (Exception e){
            String mensaje = "Error al listar los tipos de reporte ";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mensaje+ e.getMessage());
        }
    }
}


