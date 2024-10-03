package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.HistorialEstado;
import com.adopciones.mascotas.repositories.IHistorialEstadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class HistorialEstadoImpl implements  IHistorialEstadoService{
    @Autowired
    IHistorialEstadoRepository historialEstadoRepository;

    @Override
    public List<HistorialEstado> listarHistorialPorId(Long reporteId) {
        return historialEstadoRepository.findByReporteId(reporteId);
    }
}
