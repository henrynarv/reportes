package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.ImagenBanner;
import com.adopciones.mascotas.repositories.IimagenBannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class UploadFileBannerService {

    @Autowired
    private IimagenBannerRepository imagenBannerRepository;

    @Value("${file.upload-dir}")
    private String FOLDER;
    //private final static String FOLDER = "src/main/resources/static/images/banner/";
    private final long maxFileSize = 5 * 1024 * 1024;// 5 MB
    private static final String URL = "http://localhost:8080/images/banner/";
    private final String[] allowedTypes = {"image/jpeg", "image/png", "image/gif"};


    public String saveFile(MultipartFile file) throws IOException {
        //que el archivo no este vacio
        if (file.isEmpty()) {
            throw new IllegalArgumentException("No se puede guardar un archivo vacio");
        }
        //Validar el tamaño del archvio
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("El tamaño de la imagen no debe exeder los 5M");
        }

        //validar el tipo de archivo
        String mimeType = file.getContentType();
        boolean validType = false;
        for (String allowedType : allowedTypes) {
            if (allowedType.equals(mimeType)) {
                validType = true;
                break;
            }
        }

        if (!validType) {
            throw new IllegalArgumentException("Tipo de archivo no valido " + mimeType);
        }

        //generar nimbre unico del archivo
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
        Path filePath = Paths.get(FOLDER + fileName);

        //guardra el archivo Se usa copy y getInputStrenm para archivos  grandes es mas eficiente
        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, filePath);
        } catch (IOException e) {
            throw new IOException("Algo fallo al guardar archivo ", e);
        }

        return URL+fileName;
    }

    public void delete(String nameFile) {
        File file = new File(FOLDER + nameFile);
        //Verficaf si el archivo exise e intenta eliminarlo
        if (file.exists() && !file.delete()) {
            System.err.println("No se pudo eliminar el archivo: " + file.getAbsolutePath());
        }
    }


}





