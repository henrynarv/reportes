import { TipoUsuario } from './tipo-usuario.enum';
import { Usuario } from './usuario.interface';
export class UsuarioModel implements Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  urlImagen?: string | undefined;
  tipoUsuario: TipoUsuario;

  constructor(id: number, nombres: string, apellidos: string, email: string,
    password: string, tipoUsuario: TipoUsuario, urlImagen?: string
  ) {
    this.id = id;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.email = email;
    this.password = password;
    this.urlImagen = urlImagen;
    this.tipoUsuario = tipoUsuario;
  }

}
