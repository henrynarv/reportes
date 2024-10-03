package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.TipoReporte;

import java.util.List;
import java.util.Optional;

public interface ITipoReporteService {
    List<TipoReporte> listarTodo();
    TipoReporte registrarTipoReporte(TipoReporte tipoReporte);

    Optional<TipoReporte> buscarPorId(Long id);
    void eliminarTipoReporte(Long id);
}
