package com.adopciones.mascotas.controllers;

import com.adopciones.mascotas.entities.ResetearPasswordToken;
import com.adopciones.mascotas.excepciones.InvalidTokenException;
import com.adopciones.mascotas.excepciones.TokenExpiredException;
import com.adopciones.mascotas.excepciones.UsuarioExistenteExcepcion;
import com.adopciones.mascotas.services.ResetearPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/password")
public class PasswordController {
    @Autowired
    private ResetearPasswordService passwordService;

    @PostMapping("/forgot")
    public ResponseEntity<String> forgotPassword(@RequestParam String email){
        try {
            passwordService.generatePasswordResetToken(email);
            return  ResponseEntity.ok("Correo de restablecimiento enviado");

        }catch (UsuarioExistenteExcepcion e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword){
        try{
            passwordService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Contraseña restablecida coon éxito");
        }catch (TokenExpiredException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
