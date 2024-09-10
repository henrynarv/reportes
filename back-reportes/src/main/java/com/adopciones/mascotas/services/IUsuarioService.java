package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.Usuario;
import com.adopciones.mascotas.enums.TipoUsuario;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    Usuario registrarUsuario(Usuario usuario);

    Usuario registrarUsuario(Usuario usuario, MultipartFile image) throws IOException;

    Optional<Usuario> encontrarPorEmail(String email);
    Optional<Usuario> encontrarPorId(Long id);
    List<Usuario> listarTodo();

    void eliminarUsuario(Long id);



    //Usuario actualizarTipo(Long id, TipoUsuario tipoUsuario);

}
