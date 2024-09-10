package com.adopciones.mascotas.excepciones;

public class ImageNotFoundException extends RuntimeException{
    public ImageNotFoundException(String message){
        super(message);
    }
}
