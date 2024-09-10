import { Component } from '@angular/core';
import { PasswordService } from '../../../services/password.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent {
  email: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(private passwordService: PasswordService, private spinnerService: NgxSpinnerService) { }


  submit() {
    this.spinnerService.show();
    this.passwordService.forgotPassword(this.email).subscribe({
      next:
        response => {

          this.message = "Correo de restablecimiento enviado. Por favor , revisa tu bandeja de entrada";
          this.error = null; //limpia errores previos
          setTimeout(() => {
            this.spinnerService.hide()
          }, 3000)
        },
      error:
        err => {
          this.spinnerService.hide()
          this.error = err.message || 'ocurrio un error desconocido';
          this.message = null;//limpia errores
          console.log('this.error', this.error);

        }
    })
  }
}
