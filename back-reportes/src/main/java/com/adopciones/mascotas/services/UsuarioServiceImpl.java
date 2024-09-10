package com.adopciones.mascotas.services;

import com.adopciones.mascotas.entities.Usuario;
import com.adopciones.mascotas.enums.TipoUsuario;
import com.adopciones.mascotas.repositories.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
@Service
public class UsuarioServiceImpl implements IUsuarioService{

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private UploadFile uploadFile;

    @Override
    public Usuario registrarUsuario(Usuario usuario) {
        usuario.setTipoUsuario(TipoUsuario.valueOf("USER"));

        //if(usuarioRepository.findByEmail(usuario.getEmail()).isPresent()){
        //     throw new UsuarioExistenteExcepcion("El email proporcionado ya está registrado");
        // }

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario registrarUsuario(Usuario usuario, MultipartFile image) throws IOException {
        usuario.setTipoUsuario(TipoUsuario.valueOf("USER"));

        //if(usuarioRepository.findByEmail(usuario.getEmail()).isPresent()){
       //     throw new UsuarioExistenteExcepcion("El email proporcionado ya está registrado");
       // }
        String imageUrl = uploadFile.upload(image);
        usuario.setUrlImagen(imageUrl);
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> encontrarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public Optional<Usuario> encontrarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public List<Usuario> listarTodo() {
        return usuarioRepository.findAll();
    }

    @Override
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }


}
