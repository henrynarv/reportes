import { TipoUsuario } from "./tipo-usuario.enum";

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  urlImagen?: string;
  tipoUsuario: TipoUsuario;
}
