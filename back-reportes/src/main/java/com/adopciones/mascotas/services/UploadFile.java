package com.adopciones.mascotas.services;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component

public class UploadFile {
    // Directorio donde se guardarán los archivos subidos
    private static final String FOLDER = "src/main/resources/static/images/";
    // Nombre del archivo por defecto en caso de que no se proporcione ninguno
    private static final String IMG_DEFAULT = "default.jpg";

    // URL base para acceder a las imágenes
    private static final String URL = "http://localhost:8080/images/";

    private static final long MAX_FILE_SIZE = 4 * 1024 *1024; //3MB

    // Tipos MIME permitidos para los archivos de imagen
    private static final String[] ALLOWED_MIME_TIPES = {"image/jpeg", "image/png", "image/gif"};

    public String upload(MultipartFile multipartFile) throws IOException{
        // Verificar si se ha proporcionado un archivo
        if(multipartFile == null || multipartFile.isEmpty()){
            //throw new IllegalArgumentException("No se proporciono ningun archivo, Se usara la imagen por defecto");
            return getDefaultImageUrl();
        }
         //verificar el tamaño del archivo
        if(multipartFile.getSize() > MAX_FILE_SIZE){
            throw  new IllegalArgumentException("El tamaño del archivo excede el límite máximo de 3 MB");
        }

        //verificar el tipo de archivo
        String contentType = multipartFile.getContentType();
        boolean isAllowedMimeType = false;
        for(String allowedMineType : ALLOWED_MIME_TIPES) {
            if(allowedMineType.equals(contentType)){
                isAllowedMimeType = true;
                break;
            }
        }

        //si el tipo no es permitido llama a la excepcion
        if(!isAllowedMimeType){
            throw  new IllegalArgumentException("El tipo de archivo no es permitido, solo de admite arvicos .JPG .PNG .GIF");
        }

        // Asegurarse de que el directorio de destino exista
        File directory = new File(FOLDER);
        if (!directory.exists()) {
            // Intentar crear el directorio si no existe
            if (!directory.mkdirs()) {
                throw new IOException("No se pudieron crear los directorios: " + FOLDER);
            }
        }

        //Guardar el archivo en la ruta especifica

        byte[] bytes = multipartFile.getBytes();
        Path path = Paths.get(FOLDER+multipartFile.getOriginalFilename());
        try {
            Files.write(path,bytes);
        }catch (IOException e){
            throw new IOException("no se pudo guardar el archivo, ", e);
        }

        // Devolver la URL del archivo cargado
        return URL+multipartFile.getOriginalFilename();
    }


    /**
     * Obtener la URL de la imagen por defecto.
     * @return La URL de la imagen por defecto.
     */
    public String getDefaultImageUrl() {
        return URL+IMG_DEFAULT;
    }

    /**
     * Método para eliminar un archivo.
     * @param nameFile El nombre del archivo a eliminar.
     */
    public void delete(String nameFile) {
        File file = new File(FOLDER + nameFile);
        // Verificar si el archivo existe y intentar eliminarlo
        if (file.exists() && !file.delete()) {
            System.err.println("No se pudo eliminar el archivo: " + file.getAbsolutePath());
        }
    }


}
