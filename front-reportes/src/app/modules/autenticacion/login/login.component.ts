import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showFaceRecognition = false;

  loginForm!: FormGroup;
  showPassword: boolean = false;
  usuario: any = '';


  erroMensaje: string = ''

  constructor(private fb: FormBuilder, private AutenticacionService: AutenticacionService,
    private toastr: ToastrService, private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['henrynarvaezchavez851@gmail.com', [Validators.required]],
      password: ['123456', [Validators.required]]
    })

  }

  get email() {
    return this.loginForm.get("email")
  }

  get password() {
    return this.loginForm.get("password")
  }


  login() {
    this.AutenticacionService.login(this.loginForm.value).subscribe({
      next:
        respose => {
          this.usuario = respose.nombres
          console.log("this.usuario", this.usuario);
          if (respose.tipoUsuario == 'ADMIN') {
            this.router.navigate(['/listar-usuarios']);
            this.toastr.success(this.usuario, " Bienvenido ")
            console.log("respose.tipoUsuario", respose.tipoUsuario);
          } else {
            this.router.navigate(['/home']);
            this.toastr.success(this.usuario, " Bienvenido ")

          }

        },
      error:
        (error => {
          this.erroMensaje = error.error || error.message;
          this.toastr.error(this.erroMensaje);
        })
    },




    )
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     console.log('datos del formulario', this.loginForm.value);
  //   }
  // }


  passwordVisible() {
    this.showPassword = !this.showPassword;

  }



  startRecongnitionFace() {
    this.showFaceRecognition = !this.showFaceRecognition;
  }


}
