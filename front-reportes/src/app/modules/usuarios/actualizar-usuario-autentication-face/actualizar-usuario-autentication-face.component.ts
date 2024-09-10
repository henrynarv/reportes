import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';

import { Usuario } from 'src/app/models/usuario.interface';
import { AutenticationFaceService } from '../../../services/autentication-face.service';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './actualizar-usuario-autentication-face.component.html',
  styleUrls: ['./actualizar-usuario-autentication-face.component.css']
})
export class ActualizarUsuarioAutenticationFaceComponent {

  usuarioForm!: FormGroup;
  usuarioId!: number;
  errorMessage: string = '';
  fileUrl: string | undefined = '';
  fileError: string = '';

  showPassword: boolean = false;
  showPasswordNew: boolean = false;

  // private cdr!: ChangeDetectorRef

  nombreUsuario: string = '';
  emailUsuario: any = '';
  // emailUsuario: string = '';
  selectedSection: 'perfil' | 'contraseña' | 'configuracion' = 'perfil';

  private routeSub!: Subscription;


  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef, private authFaceService: AutenticationFaceService

  ) { }

  ngOnInit(): void {
    console.log('this.fileUrl', this.fileUrl);

    // this.routeSub = this.route.paramMap.subscribe(params => {
    //   const id = params.get('id');
    //   if (id) {
    //     this.usuarioId = +id;
    //   }

    // CODIGO OPCIONAL AL  QUE ESTA EN CARGAR USUARIO USA BEHAIVORSUBJECT
    //  (this.emailUsuario = usuario.email)
    this.authFaceService.user$.subscribe(user => {
      this.emailUsuario = user?.email
      console.log("this.emailUsuari", this.emailUsuario);
    })

    // })

    this.usuarioForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['',],
      newPassword: [''],
      imagen: [null],
      TipoUsuario: ['USER']

    })
    this.cargarUsuario();
  }


  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }

  }

  cargarUsuario(): void {
    this.authFaceService.getUsuario().subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          nombres: usuario?.nombres,
          apellidos: usuario?.apellidos,
          email: usuario?.email,
          // password: usuario.password
        });
        this.fileUrl = usuario?.urlImagen;
        console.log('fileUrlssssssssssssssssssssssssssss', this.fileUrl);

        const nombresArray = usuario?.nombres.split(' ') ?? [];
        this.nombreUsuario = nombresArray[0] || '';
        // this.emailUsuario = usuario.email
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error desconocido';
        this.toastr.error("Error al actualizar usuario ", this.errorMessage);
        console.log('error.message', error.message);
      }
    })
  }


  selectSection(section: 'perfil' | 'contraseña' | 'configuracion'): void {
    this.selectedSection = section;
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('nombres', this.usuarioForm.get('nombres')?.value);
    formData.append('apellidos', this.usuarioForm.get('apellidos')?.value);
    formData.append('email', this.usuarioForm.get('email')?.value);
    // formData.append('password', this.usuarioForm.get('password')?.value);

    const password = this.usuarioForm.get('password')?.value;
    const newPassword = this.usuarioForm.get('newPassword')?.value

    if (password) {
      formData.append('password', password);
    }

    if (newPassword) {
      formData.append('newPassword', newPassword);
    }


    const imagen = this.usuarioForm.get('imagen')?.value;
    if (imagen instanceof File) {
      formData.append('imagen', imagen);
    } else {
      // Si no se ha seleccionado una nueva imagen, se agrega la URL de la imagen actual.
      formData.append('imagen', this.fileUrl || '');
      console.log('this.fileUrl', this.fileUrl);
    }

    this.authFaceService.updateUsuario(formData).subscribe({
      next: (response) => {

        this.nombreUsuario = this.usuarioForm.get('nombres')?.value.split(' ')[0];
        this.emailUsuario = this.usuarioForm.get("email")?.value;
        this.usuarioForm.get('password')?.setValue('');
        this.usuarioForm.get('newPassword')?.setValue('');
        ; this.toastr.success("El usuario se actualizo con éxito");
        // Forzar la detección de cambios
        this.cdr.detectChanges();

        //FUNCIONA PERO EL OTRO CODIGO ES MAS OPTIMO
        // this.authService.user$.subscribe(user => {
        //   if (user) {
        //     user.nombres = this.usuarioForm.get('nombres')?.value;

        //   }
        // })

        this.authFaceService.user$.pipe(take(1)).subscribe(user => {
          if (user) {
            user.nombres = this.usuarioForm.get('nombres')?.value;
            user.email = this.usuarioForm.get('email')?.value
            this.authFaceService.userSubject.next(user);
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.message || "Error desconocido";
        this.toastr.error("Error al actualizar usuario ", this.errorMessage);
      }
    })
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.validateFile(file);
    }

  }


  private validateFile(file: File): void {
    this.fileError = '';
    this.fileUrl = '';

    if (!file) {
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.fileError = "El tipo de archivo no esta permitido. Solo se admite images JPG, GIF, PNG";
      this.toastr.error(this.fileError);
      return;
    }

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      this.fileError = "EL tamaño del archivo excede el limite máximo de 3 MB";
      this.toastr.error(this.fileError);
      return;
    }

    this.usuarioForm.patchValue({ imagen: file });
    this.previewFile(file);
  }

  // PREVIZUALIZAR ARCHIVO DE IMAGEN
  private previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fileUrl = e.target.result;
      console.log('fileUrl', this.fileUrl);
    };

    reader.readAsDataURL(file);
  }




  togglePasswordVisibility(passwordType: 'current' | 'new') {
    if (passwordType === 'current') {
      this.showPassword = !this.showPassword
    } else if (passwordType === 'new') {
      this.showPasswordNew = !this.showPasswordNew
    }
  }
}
