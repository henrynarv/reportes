import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.interface';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { AutenticationFaceService } from 'src/app/services/autentication-face.service';

@Component({
  selector: 'app-nav-admin',
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.css']
})
export class NavAdminComponent {
  usuario: Usuario | null = null;
  dropdownOpen: boolean = false;

  // usuario: Usuario | null = null;


  isFaceRecognition: boolean = false;

  adopt() {
    // Lógica para adoptar la mascota
    alert(`¡Estás adoptando a `);
  }
  constructor(private authService: AutenticacionService, private router: Router
    , private authFaceService: AutenticationFaceService
  ) { }


  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownMenu = document.getElementById('dropdownAvatar');
    const dropdownButton = document.getElementById('dropdownUserAvatarButton');

    if (dropdownMenu && dropdownButton && !dropdownMenu.contains(target) && !dropdownButton.contains(target)) {
      this.dropdownOpen = false;
    }
  }


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  ngOnInit() {
    //CONBINELATEST
    combineLatest([this.authService.user$, this.authFaceService.user$])
      .subscribe(([authUser, faceUser]) => {
        // Prioriza el usuario del servicio de autenticación por defecto
        this.usuario = authUser || faceUser;
        this.isFaceRecognition = sessionStorage.getItem('authType') === 'face';
        console.log("Datos combinados del usuario en NavAdminComponent:", this.usuario);
        console.log("Estado de reconocimiento facial:", this.isFaceRecognition);
      });



  }



  //El SIGUINETE ONiNIT FUNCIONA PERO GENERA CONFICTO POR USAR DOS AUTENTICACIONES
  //SE USO CONBINELATEST PARA CORREGIRLO

  // ngOnInit() {
  //   this.authService.user$.subscribe(user => {
  //     this.usuario = user;



  //     console.log("this user de navbar components", this.usuario);
  //   });


  //   this.authFaceService.user$.subscribe(user => {
  //     this.usuario = user;
  //     this.isFaceRecognition = sessionStorage.getItem('authType') === 'face';
  //     console.log("faceService de navbar components", this.usuario);
  //   })
  // }

  logout(): void {
    this.authService.logout();
    this.authFaceService.logout()
    this.router.navigate(["/home"])

  }
}
