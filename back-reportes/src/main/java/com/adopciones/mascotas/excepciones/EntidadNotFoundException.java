package com.adopciones.mascotas.excepciones;

public class EntidadNotFoundException extends RuntimeException{
    public EntidadNotFoundException(String message) {
        super(message);
    }
}
