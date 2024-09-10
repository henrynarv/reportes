import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { ResetearPasswordToken } from '../models/resetearPasswordToken.interface';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = 'http://localhost:8080/api/password';

  constructor(private http: HttpClient) { }

  forgotPassword(email: string): Observable<string> {
    let params = new HttpParams()
      .set('email', email);
    return this.http.post<string>(`${this.apiUrl}/forgot`, null, { params, responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
      // /forgot?email=${email}
    )
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    let params = new HttpParams()
      .set('token', token)
      .set('newPassword', newPassword);
    return this.http.post<string>(`${this.apiUrl}/reset`, null, { params, responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    )
    // http://localhost:8080/api/password/reset?token=d3025e80-76ee-4b9e-829f-e14c8519a908&newPassword=12345
  }


  // Función de manejo de errores de API
  private handleError(error: HttpErrorResponse) {
    let errorMessage = `Código de estado: ${error.status}\nMensaje: ${error.message}`;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // error dell bacehnd
      errorMessage = error.error || errorMessage;
      console.log("errorMessage", errorMessage);
    }
    return throwError(() => new Error(errorMessage))
  }
}
