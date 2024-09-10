package com.adopciones.mascotas.excepciones;

public class ImagenNotFoundException  extends RuntimeException{
    public ImagenNotFoundException(String message) {
        super(message);
    }
}
