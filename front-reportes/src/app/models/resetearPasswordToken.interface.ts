import { Usuario } from './usuario.interface';
export interface ResetearPasswordToken {
  id: number;
  token: string;
  usuario: Usuario
  newPassword: string;
  expireDate: string;
}
