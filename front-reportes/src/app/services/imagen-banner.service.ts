import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenBannerService {
  private apiUrl = 'http://localhost:8080/api/imagenes-banner';
  constructor(private http: HttpClient) { }

  uploadImagenes(imagenes: File[], descripciones: string[]): Observable<any> {
    const formData = new FormData();
    imagenes.forEach((imagen, index) => {
      formData.append('imagenes', imagen);
      formData.append('descripciones', descripciones[index])
    });
    return this.http.post<any>(`${this.apiUrl}/upload`, formData).pipe(
      catchError(this.handleError)
    )
  }

  getAllImagenes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    )
  }

  deleteImagen(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    //contruir un mensaje de error detallado
    let errorMessage = `Código de estado: ${error.status}\nMensaje: ${error.message}`;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente : ${error.error.message}`
    } else {
      //error del servidor
      let serverErrorMessage = error.error ? `Error del servidor: ${error.error}` : '';
      if (serverErrorMessage) {
        errorMessage = `${errorMessage}\nDetalles del servidor: ${serverErrorMessage}`;
      }
      console.log('error.error', error.error);
    }
    console.error('errorMessage', errorMessage);
    return throwError(() => new Error(errorMessage))
  }
}
