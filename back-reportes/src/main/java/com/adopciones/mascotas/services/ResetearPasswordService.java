package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.ResetearPasswordToken;
import com.adopciones.mascotas.entities.Usuario;
import com.adopciones.mascotas.excepciones.InvalidTokenException;
import com.adopciones.mascotas.excepciones.TokenExpiredException;
import com.adopciones.mascotas.excepciones.UsuarioExistenteExcepcion;
import com.adopciones.mascotas.repositories.IResetearPaswordTokenRepository;
import com.adopciones.mascotas.repositories.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResetearPasswordService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private IResetearPaswordTokenRepository tokenRepository;

    @Autowired
    private IEmailService emailService;
    @Transactional
    public void deleteTokensByUser(Usuario user){
        tokenRepository.deleteByUser(user);
    }

    @Transactional
    public void generatePasswordResetToken(String email){
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico no puede ser nulo o vacío");
        }

        try {

           Optional<Usuario>  usuarioOpt = usuarioRepository.findByEmail(email);
           System.out.println("usuarioOpt: " + usuarioOpt);
           if(usuarioOpt.isPresent()){
               Usuario usuario = usuarioOpt.get();
               System.out.println("Usuruio: "+usuario);
               deleteTokensByUser(usuario);//elimina cualquier token existente
               String token = UUID.randomUUID().toString();
               ResetearPasswordToken resetearToken = new ResetearPasswordToken();
               resetearToken.setToken(token);
               resetearToken.setUser(usuario);

               resetearToken.setExpireDate(LocalDateTime.now().plusMinutes(5));//tlken valido por 1 hora
               tokenRepository.save(resetearToken);

               String resetLink = "http://localhost:4200/reset-password?token=" + token;
               String message = "Para restablecer tu contraseña, por favor visita el siguiente enlace: " + resetLink;
               emailService.senEmail(email,"Restablecieminto de contraseña", message);

           }else {
               throw  new UsuarioExistenteExcepcion("Email de usuario no registrado");

           }


       }catch (UsuarioExistenteExcepcion e) {
            // Manejo específico para UsuarioNoEncontradoException
            e.printStackTrace(); // Imprime detalles para depuración
            throw e; // Re-lanzar la excepción para que sea manejada en el controlador

        }catch (DataAccessException e){
           e.printStackTrace(); // Imprime detalles para depuración
           throw new RuntimeException("Error al acceder a la  base de datos ", e);
       }catch (Exception e){
           e.printStackTrace(); // Imprime detalles para depuración
           throw  new RuntimeException("Error inesperado al generar el token de recuperacion ",e);
       }
    }


    public void resetPassword(String token, String newPassword){
        try{
            ResetearPasswordToken resetToken = tokenRepository.findByToken(token);
            System.out.println("resetTokencccccccccccc"+resetToken);
            if (resetToken == null) {
                throw new TokenExpiredException("El Token no es válido");
            }

            // Obtener la fecha de expiración del token y la fecha y hora actuales
            LocalDateTime expireDate = resetToken.getExpireDate();
            LocalDateTime now = LocalDateTime.now();

            // Agregar registros para depuración
            System.out.println("Token Expire Date: " + expireDate);
            System.out.println("Current Time: " + now);

            // Comparar la fecha de expiración con la fecha y hora actuales
            if (expireDate.isBefore(now)) {
                throw new TokenExpiredException("El Token ha expirado");
            }

            Usuario user = resetToken.getUser();
            user.setPassword(newPassword);// No olvides hashear la contraseña
            usuarioRepository.save(user);

            tokenRepository.delete(resetToken); // Elimina el token después de su uso
        }catch (DataAccessException e){
            // Manejo de errores de acceso a datos
            throw new RuntimeException("Error al acceder a la base de datos ",e);
        }catch (Exception e){
            // Manejo de cualquier otro tipo de excepción
            throw new RuntimeException("Error inesperado al restablecer la contraseña o ya expiro token de recuperción", e);
        }
    }
}
