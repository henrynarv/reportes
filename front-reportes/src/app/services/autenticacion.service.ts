import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Usuario } from '../models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  public userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();
  isUsuario!: boolean;

  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {
    const saveUser = sessionStorage.getItem('user');
    if (saveUser) {
      this.userSubject.next(JSON.parse(saveUser));
    }
  }


  registerUsuario(formData: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registrar`, formData).pipe(
      catchError(this.handleError)
    )
  }


  login(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, usuario, { responseType: 'json' }).pipe(
      tap(user => {
        console.log('User received from server:', user.nombres); // Añade un log para verificar el valor
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('authType', 'normal');

        this.userSubject.next(user);// Actualiza el estado del usuario
        console.log("this.userSubject.next(user)", this.userSubject.next(user));
      }),
      catchError(this.handleError)
    )
  }


  // METODO PARA OBTENER AL USUARIO

  getUsuario(): Observable<Usuario | null> {
    return this.user$.pipe(
      tap(user => {
        if (!user) {
          console.log('no hay ningun usuario con ese id');
        }
        console.log('this.user$$$$$$$$$$$$$$$$$$$', this.user$);
      }),
      catchError(this.handleError)
    )

  }



  updateUsuario(formData: FormData): Observable<Usuario> {
    const userId = this.userSubject.value?.id;


    if (!userId) {
      throw new Error("El ID del usuario no esta disponivle")
    }

    return this.http.put<Usuario>(`${this.apiUrl}/${userId}`, formData).pipe(
      tap(user => {
        this.userSubject.next(user);
        // Actualiza el almacenamiento de sesión también
        sessionStorage.setItem('user', JSON.stringify(user));
      }),

      catchError(this.handleError)
    )
  }




  logout(): void {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authType')
    this.userSubject.next(null);
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
