package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.ImagenBanner;

import java.util.List;
import java.util.Optional;

public interface IimagenBannerService {
    ImagenBanner saveImagen(ImagenBanner imagenBanner);

    List<ImagenBanner> getAllImages();

    Optional<ImagenBanner> buscarPorId(Long id);

    void deleteImagen(Long id);
}
