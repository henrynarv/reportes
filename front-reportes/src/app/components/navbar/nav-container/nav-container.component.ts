import { Component } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';

@Component({
  selector: 'app-nav-container',
  templateUrl: './nav-container.component.html',
  styleUrls: ['./nav-container.component.css']
})
export class NavContainerComponent {
  isAdmin: boolean = false;
  constructor(private authService: AutenticacionService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user?.tipoUsuario === 'ADMIN') {
        this.isAdmin = true;
        console.log("this.isAdmin", this.isAdmin);
      } else {
        this.isAdmin = false;
        console.log("this.isAdmin", this.isAdmin);
      }
    });
  }
}
