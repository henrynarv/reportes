import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios';
  res: string = '';
  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`).pipe(
      map(response => response),
      catchError(this.handleError)
    )
  }

  // INICIO CON ESTE CODIGO SE OBTIENE EL ID DEL USUARIO DE LA URL

  // updateUsuario(id: number, formData: FormData): Observable<Usuario> {
  //   return this.http.put<Usuario>(`${this.apiUrl}/${id}`, formData).pipe(
  //     catchError(this.handleError)
  //   )
  // }

  // getUsuarioById(id: number): Observable<Usuario> {
  //   return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
  //     catchError(this.handleError)
  //   )
  // }

  // FIN CON ESTE CODIGO SE OBTIENE EL ID DEL USUARIO DE LA URL



  private handleError(error: HttpErrorResponse) {
    // Construir un mensaje de error detallado
    let errorMessage = `Códogo de estado: ${error.status}\nMensaje: ${error.message}`;

    if (error.error instanceof ErrorEvent) {
      // Error del cliente (por ejemplo, error de red)
      errorMessage = `Error : ${error.error.message}`;
    } else {
      // Error del servidor
      // Verificar si el backend proporcionó un mensaje específico
      errorMessage = error.error || errorMessage;
      console.log('error.error ', error.error);
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));

  }

}
