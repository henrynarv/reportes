package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.TipoReporte;
import com.adopciones.mascotas.repositories.ITipoReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoReporteServiceImpl implements ITipoReporteService{

    @Autowired
    ITipoReporteRepository tipoReporteRepository;
    @Override
    public List<TipoReporte> listarTodo() {
        return tipoReporteRepository.findAll();
    }

    @Override
    public TipoReporte registrarTipoReporte(TipoReporte tipoReporte) {
        return tipoReporteRepository.save(tipoReporte);
    }


    @Override
    public Optional<TipoReporte> buscarPorId(Long id) {
        return  tipoReporteRepository.findById(id);
    }

    @Override
    public void eliminarTipoReporte(Long id) {
        tipoReporteRepository.deleteById(id);
    }
}
