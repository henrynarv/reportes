import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from 'src/app/services/password.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-resetear-password',
  templateUrl: './resetear-password.component.html',
  styleUrls: ['./resetear-password.component.css']
})
export class ResetearPasswordComponent {
  token!: any;
  newPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute, private passwordService: PasswordService, private router: Router,
    private toastr: ToastrService, private spinner: NgxSpinnerService
  ) {
    // Obtener el token desde la URL
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  // Función para enviar el formulario de restablecimiento de contraseña
  submit() {
    this.spinner.show(); // Muestra el spinner
    this.passwordService.resetPassword(this.token, this.newPassword).subscribe(
      response => {
        this.message = 'Contraseña restablecida con éxito.';
        this.error = ''; // Limpia errores previos
        setTimeout(() => {
          this.spinner.hide()
          this.toastr.success(this.message);
          this.router.navigate(['/login']);
        }, 3000)



      },
      err => {
        this.error = err.message; // Mostrar mensaje de error en pantalla
        this.message = ''; // Limpia mensajes de éxito previos
      }
    );
  }
}


// ball-spin-fade
