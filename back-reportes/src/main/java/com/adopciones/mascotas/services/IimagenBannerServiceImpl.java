package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.ImagenBanner;
import com.adopciones.mascotas.excepciones.UsuarioExistenteExcepcion;
import com.adopciones.mascotas.repositories.IimagenBannerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class IimagenBannerServiceImpl implements IimagenBannerService{

    private static final Logger logger = LoggerFactory.getLogger(IimagenBannerServiceImpl.class);
    @Autowired
    IimagenBannerRepository imagenBannerRepository;

    @Override
    public ImagenBanner saveImagen(ImagenBanner imagenBanner) {
            if(imagenBanner.getUrl() == null || imagenBanner.getUrl().trim().isEmpty()){
                logger.error("No se pude guardar la url de la imagen , es nula o vacia");
                throw  new IllegalArgumentException("Imagen URL es nulla o esta vacia");
            }
            String descripcion = imagenBanner.getDescripcion() != null ? imagenBanner.getDescripcion() :"";
            try {
                ImagenBanner banner = new ImagenBanner(imagenBanner.getUrl(),descripcion);
                return imagenBannerRepository.save(banner);

            }catch (Exception e){
                logger.error("No se pudo guardar la imagen con URL: {} y desceipción {}", imagenBanner.getUrl(), descripcion,e);
                throw new RuntimeException("Error al guardar imagen ",e);
            }

    }

    @Override
    public List<ImagenBanner> getAllImages() {
      try {
          List<ImagenBanner> imagenes = imagenBannerRepository.findAll();

          if(imagenes.isEmpty()){
              logger.warn("No hay imagenes en la base de datos");
              return Collections.emptyList();
          }

          logger.info("Se recuperaron {} imágenes de la base de datos ", imagenes.size());
          return imagenes;
      }catch (Exception e){
          logger.error("Error en la recuperaciónd elas imagenes ",e);
          throw  new RuntimeException("No se pueden recuperar imágenes de la base de datos ",e);
      }

    }

    @Override
    public Optional<ImagenBanner> buscarPorId(Long id) {
        return imagenBannerRepository.findById(id);
    }

    @Override
    public void deleteImagen(Long id){
        try {
            imagenBannerRepository.deleteById(id);
        }catch (EmptyResultDataAccessException e){
            throw new IllegalArgumentException("Imagen no encontrada con ID: "+id);
        }catch (Exception e){
            throw  new RuntimeException("Error al eliminar imagen banner de la base de datos");
        }
    }


}
