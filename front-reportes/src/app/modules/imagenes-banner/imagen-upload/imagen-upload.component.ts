import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagenPreviewPipe } from 'src/app/components/pipes/imagen-preview.pipe';
import { ImagenBannerService } from 'src/app/services/imagen-banner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-imagen-upload',
  templateUrl: './imagen-upload.component.html',
  styleUrls: ['./imagen-upload.component.css']
})
export class ImagenUploadComponent {

  maxFileSize = 5 * 1024 * 1024; // 5 MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  images: File[] = [];
  descripciones: string[] = [];


  constructor(private imagenBannerService: ImagenBannerService, private toast: ToastrService) { }


  onImagenSeleted(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const file = input.files[0];
      for (let i = 0; i < input.files.length; i++) {
        if (this.validateFile(file)) {
          this.images.push(input.files[i]);
          this.descripciones.push("");

        }

      }
    }

  }

  validateFile(file: File): boolean {
    if (file.size > this.maxFileSize) {
      this.toast.error("El tamaño de la imagen no debe ser mayor a 5 MB");
      return false;
    }
    if (!this.allowedTypes.includes(file.type)) {
      this.toast.error("Tipo de archivo no válido. Debe ser una imagen JPEG, PNG o GIF.");
      return false;

    }
    return true;
  }

  deleteImagenSelected(index: number): void {
    for (let i = 0; i < this.images.length; i++) {
      this.images.splice(index, 1);
      this.descripciones.splice(index, 1)
    }
  }

  onDescripcionChange(index: number, descripcion: string) {
    this.descripciones[index] = descripcion;
  }

  uploadImages(): void {
    if (this.images.length > 0) {
      this.imagenBannerService.uploadImagenes(this.images, this.descripciones).subscribe({
        next:
          response => {
            this.toast.success("Imagenes guardadas correctamente")
            console.log('Imagenes subidas: ', response);
          },
        error:
          error => {
            this.toast.error(error)
            console.log('Error al subir las imagenes: ', error);
          }
      })
    }
  }

}
