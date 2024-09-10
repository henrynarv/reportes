package com.adopciones.mascotas.repositories;

import com.adopciones.mascotas.entities.ResetearPasswordToken;
import com.adopciones.mascotas.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository// es opcional porq JPA lo masrca como @Repository por defecto

public interface IResetearPaswordTokenRepository extends JpaRepository<ResetearPasswordToken, Long> {
    ResetearPasswordToken findByToken(String token);
    void deleteByUser(Usuario usuario);
}
