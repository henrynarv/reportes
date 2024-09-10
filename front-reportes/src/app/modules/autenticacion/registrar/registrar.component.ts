import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoUsuario } from 'src/app/models/tipo-usuario.enum';
import { ToastrService } from 'ngx-toastr';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {
  usuarioForm!: FormGroup;
  errorMessage: string = '';

  fileError: string = '';
  fileUrl: string = '';
  nombreFile: string = '';


  constructor(private fb: FormBuilder, private toastr: ToastrService,
    private autenticacionService: AutenticacionService, private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      imagen: [null],
      TipoUsuario: ['USER']

    })
  }

  onSubmmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append("nombres", this.usuarioForm.get("nombres")?.value);
    formData.append("apellidos", this.usuarioForm.get("apellidos")?.value);
    formData.append("email", this.usuarioForm.get("email")?.value);
    formData.append("password", this.usuarioForm.get("password")?.value);
    formData.append("tipoUsuario", this.usuarioForm.get("tipoUusario")?.value);

    const imagen = this.usuarioForm.get('imagen')?.value;

    if (imagen instanceof File) {
      formData.append('imagen', imagen)
    } else {// Si no se ha seleccionado una nueva imagen, se agrega la URL de la imagen actual.
      formData.append("imagen", this.fileUrl || '');  // 'fileUrl' contiene la URL actual.
    }



    this.autenticacionService.registerUsuario(formData).subscribe({
      next:
        (response) => {
          console.log("usuario registrado ", response);
          this.toastr.success("Usuario registrado con éxito");
          this.router.navigate(['/login']);

        },
      error:
        (error) => {
          // Mostrar el código de error y el mensaje del backend
          this.errorMessage = error.message || 'Error desconocido';
          this.toastr.error(`Error al registrar usuario`, this.errorMessage);
          console.log('error.message', error.message);


        }
    })

  }

  onCancel(): void {
    this.router.navigate(['/login'])
    this.usuarioForm.reset();

  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.validateFile(file);
    }
  }

  // VALIDAR LA EL ARCHIVO IMAGEN
  private validateFile(file: File): void {
    this.nombreFile = '';
    this.fileUrl = '';
    this.fileError = '';

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

    // Si el archivo es válido, actualiza el nombre y la vista previa
    this.nombreFile = `"${file.name}"`;
    this.usuarioForm.patchValue({ imagen: file });
    this.previewFile(file);

  }


  //maneja el suelta y arrastre de archivos
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validateFile(file);
    }
  }

  //maneja el suelta y arrastre de archivos
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }




  // PREVIZUALIZA EL ARCHIVO
  private previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fileUrl = e.target.result;
      console.log('fileUrl: ', this.fileUrl);
    };

    reader.readAsDataURL(file);
  }
}
