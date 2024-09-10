import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, combineLatest, interval, Observable, of, switchMap, map, filter, tap } from 'rxjs';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.interface';
import { AutenticationFaceService } from '../../../services/autentication-face.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  usuario: Usuario | null = null;
  // usuario: Usuario | null = null;


  isFaceRecognition: boolean = false;

  adopt() {
    // Lógica para adoptar la mascota
    alert(`¡Estás adoptando a `);
  }
  constructor(private authService: AutenticacionService, private router: Router
    , private authFaceService: AutenticationFaceService
  ) { }
  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.usuario = user;
      // this.isFaceRecognition = sessionStorage.getItem('authType') === 'normal';
      console.log("this user de navbar components", this.usuario);
    });


    this.authFaceService.user$.subscribe(user => {
      this.usuario = user;
      this.isFaceRecognition = sessionStorage.getItem('authType') === 'face';
      console.log("faceService de navbar components", this.usuario);
    })
  }

  logout(): void {
    this.authService.logout();
    this.authFaceService.logout()
    this.router.navigate(["/home"])

  }

}
