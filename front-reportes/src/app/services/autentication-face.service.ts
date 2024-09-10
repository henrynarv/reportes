import { Injectable, signal } from '@angular/core';
import { Signal } from '@angular/core';
import { Usuario } from '../models/usuario.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticationFaceService {
  public userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();

  private apiUrl = "http://localhost:8080/api/usuarios/login-face"
  private apiUrlUpdate = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {
    this.loadUserFromSession();
  }


  private loadUserFromSession(): void {
    const saveUser = sessionStorage.getItem('user');
    if (saveUser) {
      try {
        const user = JSON.parse(saveUser) as Usuario;
        this.userSubject.next(user);
      } catch (e) {
        console.error('Error al parsear el usuario del sessionStorage', e);
        sessionStorage.removeItem('user');
      }
    }
  }

  loginface(formatData: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, formatData, { responseType: 'json' }).pipe(
      tap(user => {
        sessionStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('authType', 'face');
        this.userSubject.next(user);
      }),
      catchError(this.handleError)
    )
  }

  logout(): void {
    sessionStorage.removeItem('user');
    this.userSubject.next(null); // Limpiar el estado del usuario
  }

  // METODO PARA OBTENER AL USUARIO
  getUsuario(): Observable<Usuario | null> {
    return this.user$.pipe(
      tap(user => {
        if (!user) {
          console.log("No hay ningun usuario con ese IDDDDDDDDDDDDD");
        }
      }),
      catchError(this.handleError)
    )
  }

  updateUsuario(formData: FormData): Observable<Usuario> {
    const userId = this.userSubject.value?.id;
    console.log('this.userSubject.value?.idddddddddddd', this.userSubject.value?.id);
    if (!userId) {
      throw new Error('El ID del uusuario no esta disonible');
    }
    return this.http.put<Usuario>(`${this.apiUrlUpdate}/${userId}`, formData).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    // Construir un mensaje de error detallado
    let errorMessage = `Código de estado: ${error.status}\nMensaje: ${error.message}`;

    if (error.error instanceof ErrorEvent) {
      // Error del cliente (por ejemplo, error de red)
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      // Verificar si el backend proporcionó un mensaje específico
      errorMessage = error.error || errorMessage;
      console.log('error.error', error.error);
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
