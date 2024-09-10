package com.adopciones.mascotas.controllers;


import com.adopciones.mascotas.entities.Usuario;
import com.adopciones.mascotas.enums.TipoUsuario;
import com.adopciones.mascotas.excepciones.UsuarioExistenteExcepcion;
import com.adopciones.mascotas.services.FaceRecognitionService;
import com.adopciones.mascotas.services.IUsuarioService;
import com.adopciones.mascotas.services.UploadFile;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;

@RestController
@Slf4j
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    @Autowired
    private FaceRecognitionService faceRecognitionService;

    @Autowired
    private IUsuarioService usuarioService;

    @Autowired
    private UploadFile uploadFile;

    //REGISTRAR NUEVO USUARIO
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario (@RequestParam("nombres") String nombres,
                                               @RequestParam("apellidos") String apellidos,
                                               @RequestParam("email") String email,
                                               @RequestParam("password") String password,
                                               @RequestParam(value = "imagen", required = false) MultipartFile imagen
                                               ){
        try {
              Optional<Usuario> usuarioExistente = usuarioService.encontrarPorEmail(email);
            if(usuarioExistente.isPresent()){
                 throw new UsuarioExistenteExcepcion("El email proporcionado ya está registrado");
            }
            // Crear una nueva instancia de Usuario y establecer sus propiedades

            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombres(nombres);
            nuevoUsuario.setApellidos(apellidos);
            nuevoUsuario.setEmail(email);
            nuevoUsuario.setPassword(password);
            nuevoUsuario.setTipoUsuario(TipoUsuario.USER);

            //cargar la imagen y obtener la URL generada
            String imageUrl = uploadFile.upload(imagen);
            nuevoUsuario.setUrlImagen(imageUrl);

            //registrar nuevo usuario
            Usuario usuarioGuardado = usuarioService.registrarUsuario(nuevoUsuario,imagen);

            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);

        }catch (UsuarioExistenteExcepcion e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).
                    body(e.getMessage());
        }catch (IOException e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cargar la imagen "+e.getMessage());
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).
                    body("Error al registrar usuario: "+ e.getMessage());
        }

    }






    //ACTUALIZAR USUARIO SIN IMAGEN Y FUNCIONAL
    /**
     @PutMapping("/{id}")
     public ResponseEntity<?> actualizarUsuario(@RequestBody Usuario usuario, @PathVariable Long id) {
     try {
     Optional<Usuario> usuarioActualOptional = usuarioService.encontrarPorId(id);
     if (usuarioActualOptional.isPresent()) {
     Usuario usuarioActual = usuarioActualOptional.get();

     // Conservar el email actual del usuario antes de la actualización
     String emailAnterior = usuarioActual.getEmail();

     // Actualizar los datos del usuario actual con los nuevos datos recibidos
     usuarioActual.setNombres(usuario.getNombres());
     usuarioActual.setApellidos(usuario.getApellidos());
     usuarioActual.setPassword(usuario.getPassword());

     // Verificar si el email ha cambiado
     if (!emailAnterior.equals(usuario.getEmail())) {
     // Si el email ha cambiado, verificar si está registrado para otros usuarios
     if (usuarioService.encontrarPorEmail(usuario.getEmail()).isPresent()) {
     throw new UsuarioExistenteExcepcion("El email proporcionado ya está registrado por otro usuario");
     }
     usuarioActual.setEmail(usuario.getEmail());
     }

     // Guardar el usuario actualizado
     usuarioService.registrarUsuario(usuarioActual);
     return ResponseEntity.ok().body(usuarioActual);
     } else {
     String mensaje = "El usuario con ID " + id + " no existe ";
     return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
     }
     } catch (UsuarioExistenteExcepcion e) {
     String mensaje = "Error al actualizar usuario con ID " + id;
     return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mensaje + " " + e.getMessage());
     } catch (Exception e) {
     String mensaje = "Error al actualizar usuario con ID " + id;
     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mensaje + " " + e.getMessage());
     }
     }

     */



    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@RequestParam("nombres") String nombres,
                                               @RequestParam("apellidos") String apellidos,
                                               @RequestParam("email") String email,
                                               @RequestParam(value = "password", required = false) String password,
                                               @RequestParam(value = "newPassword", required = false) String newPassword,
                                               @RequestParam(value = "imagen", required = false) MultipartFile imagen,
                                               @RequestParam(value = "imagenUrl", required = false) String imagenUrl,
                                               @PathVariable Long id) {
        try {
            Optional<Usuario> usuarioActualOptional = usuarioService.encontrarPorId(id);
            System.out.println("imagennnnnnnnnnnnn"+ imagen);
            System.out.println("urlimagen"+ imagenUrl);
            if (usuarioActualOptional.isPresent()) {
                Usuario usuarioActual = usuarioActualOptional.get();
                String passwordActual = usuarioActual.getPassword();


                // Verificar la contraseña actual si se proporciona
                if (password != null && !password.isEmpty()) {
                    if (!passwordActual.equals(password)) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La contraseña actual es incorrecta.");
                    }

                    // Actualizar la contraseña si se proporciona una nueva
                    if (newPassword != null && !newPassword.isEmpty()) {
                        usuarioActual.setPassword(newPassword);
                    }
                } else if (newPassword != null && !newPassword.isEmpty()) {
                    // Si se proporciona una nueva contraseña pero no la actual, es un error
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Debe proporcionar la contraseña actual para cambiarla.");
                }

                // Actualizar los datos del usuario actual con los nuevos datos recibidos
                usuarioActual.setNombres(nombres);
                usuarioActual.setApellidos(apellidos);



                // Actualizar el email si ha cambiado
                String emailAnterior = usuarioActual.getEmail();
                if (!emailAnterior.equals(email)) {
                    if (usuarioService.encontrarPorEmail(email).isPresent()) {
                        throw new UsuarioExistenteExcepcion("El email proporcionado ya está registrado por otro usuario");
                    }
                    usuarioActual.setEmail(email);
                }

                // Manejar la actualización de la imagen
                String defaultImageUrl = uploadFile.getDefaultImageUrl(); // URL de la imagen por defecto

                // Manejar la actualización de la imagen
                if (imagen != null && !imagen.isEmpty()) {
                    // Eliminar la imagen anterior si existe
                    String currentImageUrl = usuarioActual.getUrlImagen();
                    if (currentImageUrl != null && !currentImageUrl.isEmpty() && !currentImageUrl.equals(defaultImageUrl))  {
                        String imageName = currentImageUrl.substring(currentImageUrl.lastIndexOf('/') + 1);
                        System.out.println("Eliminando imagen " + imageName);
                        uploadFile.delete(imageName);
                    }

                    // Subir la nueva imagen
                    String newImageUrl = uploadFile.upload(imagen);
                    ;
                    usuarioActual.setUrlImagen(newImageUrl);
                } else if (imagenUrl != null && !imagenUrl.isEmpty()) {
                    // Si se proporciona una URL de imagen, establecerla
                    usuarioActual.setUrlImagen(imagenUrl);
                    System.out.println("Entro acaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                }else {
                    // Mantener la imagen actual si no se proporciona una nueva imagen ni una URL de imagen
                    if (usuarioActual.getUrlImagen() == null || usuarioActual.getUrlImagen().isEmpty()) {
                        usuarioActual.setUrlImagen(defaultImageUrl);
                    }
                }
                // Si no se proporciona ni imagen ni imagenUrl, mantener la imagen actual

                // Guardar el usuario actualizado
                Usuario usuarioActualizado = usuarioService.registrarUsuario(usuarioActual);
                return ResponseEntity.ok().body(usuarioActualizado);
            } else {
                String mensaje = "El usuario con ID " + id + " no existe";
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
            }
        } catch (UsuarioExistenteExcepcion e) {
            String mensaje = "Error al actualizar usuario con ID " + id;
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mensaje + " " + e.getMessage());
        } catch (Exception e) {
            String mensaje = "Error al actualizar usuario con ID " + id;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mensaje + " " + e.getMessage());
        }
    }



    //OBTENER USUARIO POR EMAIL
    @GetMapping("/email/{email}")
    public ResponseEntity<?> obtenerUsuarioPorEmail(@PathVariable String email){

        try {
            Optional<Usuario> usuarioBuscado = usuarioService.encontrarPorEmail(email);

            //CODIGO EQUIVALENTE
           // Optional<Usuario> usuario = usuarioService.encontrarPorEmail(email);
            //return usuario.map(ResponseEntity::ok)
              //      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                //            .body("Usuario no encontrado"));

            if(usuarioBuscado.isPresent()){
                Usuario usuario = usuarioBuscado.get();
                String mensaje = "Usuario encontrado con email " + email;
                return ResponseEntity.ok().body(usuario);
            }
            else{
                String mensaje = "No se econtro ningun usuario con el email: "+email;
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
            }
        }catch (Exception e){
            String mensaje = "Error al obtener usuario con email: "+email;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).
                    body(mensaje + e.getMessage());
        }

    }



    @GetMapping("/{id}")
    public ResponseEntity<?> ObtenerUsuarioPorId(@PathVariable Long id) {
        try {
            Optional<Usuario> usuarioBuscado = usuarioService.encontrarPorId(id);
            System.out.println("usuario para depurar: " + usuarioBuscado);

            if(usuarioBuscado.isPresent()){
                Usuario usuario = usuarioBuscado.get();
                String mensaje = "Usuario encontrado con ID: " + id;
                return ResponseEntity.status(HttpStatus.OK).body(usuario);
            }
            else{
                String mensaje = "Usuario no encontrado con ID: " + id;
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
            }

        } catch (Exception e) {
            String mensaje = "Error al buscar usuario por ID: " + id;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(mensaje + " " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarUsuarios(){
        try {
            List<Usuario> usuarios = usuarioService.listarTodo();
            return ResponseEntity.ok(usuarios);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).
                    body("Error al listar usuarios: " + e.getMessage());
        }


    }

    /**
     @DeleteMapping("/{id}")
     public ResponseEntity<?> eliminarUsuario(@PathVariable Long id){
     try {
     if(usuarioService.encontrarPorId(id).isPresent()){
     usuarioService.eliminarUsuario(id);
     return ResponseEntity.ok().build();
     }
     else{
     String mensaje ="Usuario no escontrado con ID: "+id;
     return ResponseEntity.status(HttpStatus.NOT_FOUND)
     .body(mensaje);
     }

     }catch (Exception e){
     String mensaje = "Error al eliminar usuario con ID: "+id;
     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
     .body(mensaje +" " +e.getMessage());
     }

     }

     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id){
        try {
            Optional<Usuario> usuaioOpt = usuarioService.encontrarPorId(id);
            if(usuaioOpt.isPresent()){
                Usuario usuario = usuaioOpt.get();
                usuarioService.eliminarUsuario(id);

                //eliminar imagen del usuario
                String imageUrl = usuario.getUrlImagen();
                if(imageUrl != null && !imageUrl.isEmpty()){
                    String imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                    //String RUTA = "src//main//resources//static//images//";

                    if(!"default.jpg".equals(imageName)){
                        System.out.println("Eliminando imagen: " + imageName); // Mensaje de depuración
                        uploadFile.delete(imageName);
                    }else{
                        System.out.println("No se eliminará la imagen por defecto: " + imageName);
                    }

                }
                return  ResponseEntity.ok().body("Se elimino el usuario con ID: "+ id);
            }
            else{
                String mensaje ="Usuario no escontrado con ID: "+id;
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(mensaje);
            }

        }catch (Exception e){
            String mensaje = "Error al eliminar usuario con ID: "+id;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(mensaje +" " +e.getMessage());
        }

    }

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody Usuario usuario){
        Optional<Usuario> usuarioOpt  = usuarioService.encontrarPorEmail(usuario.getEmail());

        if(usuarioOpt.isPresent()){
            Usuario user = usuarioOpt.get();

            if(user.getPassword().equals(usuario.getPassword())){
                String mensaje = "Datos ingresador correctamente";
                return  ResponseEntity.status(HttpStatus.OK).body(user);
            }else{
                String mensaje = "Datos ingresador no son validos";
                return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mensaje);
            }
        }else{
            String mensaje = "Usario con ese email no existe";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
        }
    }

    @PostMapping("/login-face")
    public  ResponseEntity<?> loginWithFace(@RequestParam("imagen") MultipartFile imagen){

        try {
            // Autenticación facial usando el servicio
            Optional<Usuario> usuario = faceRecognitionService.authenticate(imagen);

            if (usuario.isPresent()) {
                // Si se encontró una coincidencia, devolver el usuario encontrado
                System.out.println("usuario.get()" +usuario.get());
                return ResponseEntity.ok(usuario.get());
            } else {
                // Si no se encontró una coincidencia, devolver un mensaje de error
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Autenticación fallida: No se encontró ninguna coincidencia.");
            }
        } catch (IOException e) {
            // Manejo de errores si ocurre una excepción al procesar la imagen
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la imagen: " + e.getMessage());
        }
    }





}

