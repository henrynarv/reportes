import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reporte } from '../models/reporte.interface';
import { catchError, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.interface';
import { ErrorHandlerService } from './error-handler.service';
import { Provincias } from '../models/provincia.enum';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  crearReporte(reporte: Reporte, imagen: File): Observable<Reporte> {
    const formData = new FormData();
    formData.append('usuarioId', reporte.usuario.toString());
    formData.append('tipoReporteId', reporte.tipo.toString());
    formData.append('provincia', reporte.provincia.toString());
    formData.append('descripcion', reporte.descripcion.toString());
    formData.append('latitud', reporte.ubicacion.latitud.toString());
    formData.append('longitud', reporte.ubicacion.longitud.toString());
    formData.append('imagen', imagen);

    return this.http.post<Reporte>(`${this.apiUrl}/registrar`, formData).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }

  listarReportes(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.apiUrl}`).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }

  obtenerReportesPorUsuario(usuarioId: number): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.apiUrl}/usuario/${usuarioId}`).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }

  actualizarEstado(id: number, nuevoEstado: string): Observable<Reporte> {
    return this.http.put<Reporte>(`${this.apiUrl}/${id}/estado`, nuevoEstado).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }

  //METODO PARA OBTENER REPORTE POR PROVINCIAS
  getReportesPorProvincia(provincia: string): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.apiUrl}/provincia/${provincia}`).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }


  //METODO PARA CONTAR REPPRTES POR TIPO DE CADA PRVINCIA
  contarReportesPorTipoYProvincia(provincia: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/contar/${provincia}`).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }
}
