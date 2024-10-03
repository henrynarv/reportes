import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { TipoReporte } from '../models/tipoReporte.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TipoReporteService {

  private apiUrl = 'http://localhost:8080/api/tipos-reporte';



  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  obtenerTipoReporte(): Observable<TipoReporte[]> {
    return this.http.get<TipoReporte[]>(`${this.apiUrl}`).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }
}
