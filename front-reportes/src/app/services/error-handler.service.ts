import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }



  /**
   * Maneja los errores de las solicitudes HTTP.
   * @param error - El objeto HttpErrorResponse que contiene información del error.
   * @returns Un observable con el mensaje de error.
   */
  public handleError(error: HttpErrorResponse) {
    //contruir un mensaje de error detallado
    let errorMessage = `Código de estado: ${error.status}\nMensaje: ${error.message}`;

    if (error.error instanceof ErrorEvent) {
      // Error del cliente o red
      errorMessage = `Error del cliente: ${error.error.message}`;
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












//EJEMPLO DE INYECCCION EN UN SERVICIO


// constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

// guardarMascota(formData: FormData): Observable<MascotaModel> {
//   return this.http.post<MascotaModel>(this.apiUrl, formData).pipe(
//     catchError(this.errorHandler.handleError) // Usar el servicio de manejo de errores
//   );
// }
