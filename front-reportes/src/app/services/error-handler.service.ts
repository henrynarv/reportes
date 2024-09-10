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
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente o red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de estado: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error(errorMessage); // Registrar el error en la consola
    return throwError(errorMessage); // Retornar el error para su manejo en el componente

    // return throwError(() => new Error(errorMessage))
  }
}


//EJEMPLO DE INYECCCION EN UN SERVICIO


// constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

// guardarMascota(formData: FormData): Observable<MascotaModel> {
//   return this.http.post<MascotaModel>(this.apiUrl, formData).pipe(
//     catchError(this.errorHandler.handleError) // Usar el servicio de manejo de errores
//   );
// }
