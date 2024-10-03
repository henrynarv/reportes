package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.HistorialEstado;

import java.util.List;

public interface IHistorialEstadoService {
    List<HistorialEstado>listarHistorialPorId(Long reporteId);
}
