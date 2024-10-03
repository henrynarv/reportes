import { EstadoReporte } from "./estadoReporte.enum";
import { Provincias } from "./provincia.enum";
import { Reporte } from "./reporte.interface";
import { TipoReporte } from "./tipoReporte.interface";
import { Usuario } from "./usuario.interface";

export class ReporteModel implements Reporte {
  id?: number | undefined;
  descripcion: string;
  ubicacion: { latitud: number; longitud: number; };
  imagenUrl?: string | undefined;
  estado?: EstadoReporte.PENDIENTE | undefined;
  usuario: any;
  tipo: TipoReporte;
  provincia: Provincias;
  fechaHoraReporte!: Date;

  constructor(descripcion: string, ubicacion: { latitud: number, longitud: number },
    usuarioId: number, tipoReporte: TipoReporte, provincia: Provincias
  ) {
    // this.id = id;
    this.descripcion = descripcion;
    this.ubicacion = ubicacion;
    this.usuario = usuarioId;
    this.tipo = tipoReporte;
    this.provincia = provincia
    // this.imagenUrl = imagenUrl
    // this.estado = estado;
    // this.fechaHoraReporte = fechaHoraReporte;


  }

}
