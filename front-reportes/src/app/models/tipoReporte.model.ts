import { TipoReporte } from "./tipoReporte.interface";

export class TipoReporteModel implements TipoReporte {
  id?: number;
  nombre: string;
  descripcion: string;



  constructor(id: number, nombre: string, descripcion: string) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}
