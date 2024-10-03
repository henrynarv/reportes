import { EstadoReporte } from "./estadoReporte.enum";
import { Provincias } from "./provincia.enum";
import { TipoReporte } from "./tipoReporte.interface";
import { Usuario } from "./usuario.interface";

export interface Reporte {
  id?: number;
  descripcion: string;
  ubicacion: {
    latitud: number;
    longitud: number;
  }
  imagenUrl?: string
  estado?: EstadoReporte;
  provincia: Provincias
  usuario: any;
  tipo: TipoReporte;
  fechaHoraReporte: Date;
}
