import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialEstadoService {

  private apiUrl = 'http://localhost:8080/api/historial';

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  obtenerHistorialEstado(reporteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reporte/${reporteId}`).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }
}
