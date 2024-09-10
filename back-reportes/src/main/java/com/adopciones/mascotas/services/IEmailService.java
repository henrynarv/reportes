package com.adopciones.mascotas.services;

public interface IEmailService {
    void senEmail(String to, String subject, String body);
}
