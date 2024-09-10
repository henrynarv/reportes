package com.adopciones.mascotas.excepciones;

public class InvalidTokenException extends  RuntimeException{
    public  InvalidTokenException(String message){
        super(message);
    }
}
