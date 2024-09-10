package com.adopciones.mascotas.excepciones;

public class UsuarioExistenteExcepcion extends  RuntimeException{
    public UsuarioExistenteExcepcion(String mensaje){
        super(mensaje);

    }
}
