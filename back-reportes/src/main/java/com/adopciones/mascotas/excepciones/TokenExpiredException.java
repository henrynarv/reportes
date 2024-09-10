package com.adopciones.mascotas.excepciones;

public class TokenExpiredException extends RuntimeException{
    public  TokenExpiredException(String message){
        super(message);
    }
}
