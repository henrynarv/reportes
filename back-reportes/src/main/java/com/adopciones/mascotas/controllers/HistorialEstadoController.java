package com.adopciones.mascotas.controllers;


import com.adopciones.mascotas.entities.HistorialEstado;
import com.adopciones.mascotas.services.IHistorialEstadoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@Slf4j
@RequestMapping("/api/historial")
@CrossOrigin(origins = "http://localhost:4200")
public class HistorialEstadoController {

    @Autowired
    IHistorialEstadoService historialEstadoService;

    @GetMapping("/reporte/{reporteId}")
    public ResponseEntity<List<HistorialEstado>> obtenerHistorialPorReporte(@PathVariable Long reporteId){
        List<HistorialEstado> historial = historialEstadoService.listarHistorialPorId(reporteId);
        return ResponseEntity.ok(historial);
    }
}


