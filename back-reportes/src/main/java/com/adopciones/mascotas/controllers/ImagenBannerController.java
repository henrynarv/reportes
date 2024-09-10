package com.adopciones.mascotas.controllers;


import com.adopciones.mascotas.entities.ImagenBanner;
import com.adopciones.mascotas.excepciones.ImageNotFoundException;
import com.adopciones.mascotas.services.IimagenBannerService;
import com.adopciones.mascotas.services.UploadFileBannerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("api/imagenes-banner")
@CrossOrigin(origins = "http://localhost:4200")
public class ImagenBannerController {

    private static final Logger logger = LoggerFactory.getLogger(ImagenBannerController.class);
    private final UploadFileBannerService uploadFileBannerService;
    private final IimagenBannerService imagenBannerService;


    @Autowired
    public ImagenBannerController(UploadFileBannerService uploadFileBannerService, IimagenBannerService imagenBannerService) {
        this.uploadFileBannerService = uploadFileBannerService;
        this.imagenBannerService = imagenBannerService;
    }




    @PostMapping("/upload")
    public ResponseEntity<?> uploadImagenes(@RequestParam("imagenes")MultipartFile[] files,
                                                        @RequestParam("descripciones") String[] descricpiones){
    List<ImagenBanner> guardarImagenesBanner = new ArrayList<>();
    if(files.length != descricpiones.length){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Debe ingresar alguna descripcion");
    }
    try {
        for (int i = 0; i < files.length; i++) {
            String imageUrl = uploadFileBannerService.saveFile(files[i]);
            String descripcion = descricpiones[i];
            ImagenBanner imagenBanner = new ImagenBanner();
            imagenBanner.setUrl(imageUrl);
            imagenBanner.setDescripcion(descripcion);
            ImagenBanner saveImagenes = imagenBannerService.saveImagen(imagenBanner);
            guardarImagenesBanner.add(saveImagenes);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(guardarImagenesBanner);

    } catch (IllegalArgumentException e) {
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }catch (IOException e){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al guaradr el archivo " +e.getMessage());

    }catch (Exception e){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error inesperado " +e.getMessage());

    }

    }



    @GetMapping
    public ResponseEntity<?> getAllImagenes(){
        try {
            List<ImagenBanner> imagenes = imagenBannerService.getAllImages();
            if(!imagenes.isEmpty()){
                return ResponseEntity.status(HttpStatus.OK).body(imagenes);
            }else{
                String mensaje =" No existe imagenes banner en la base de datos  que mostrar:";
                return ResponseEntity.status(HttpStatus.OK).body(mensaje);
            }
        }catch (Exception e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }




    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImagen(@PathVariable Long id){
        try {
            Optional<ImagenBanner> imagenBannerOpt = imagenBannerService.buscarPorId(id);
            if(imagenBannerOpt.isPresent()){
                ImagenBanner imagenBanner = imagenBannerOpt.get();
                imagenBannerService.deleteImagen(id);
                //Eliminar la imagen del sistemas de archivos
                String imagenUrl = imagenBanner.getUrl();
                if(imagenUrl !=null && !imagenUrl.isEmpty()){
                    String imageName = imagenUrl.substring(imagenUrl.lastIndexOf('/')+1);
                    uploadFileBannerService.delete(imageName);
                }
            }else{
                String mensaje = "Imagen banner no encontrada con ID: " +id;
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
            }

            return  ResponseEntity.status(HttpStatus.OK).body("Imagen eliminada con exito");
        }catch (ImageNotFoundException e){
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (Exception e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


}
