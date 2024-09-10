import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario.interface';
import { AutenticationFaceService } from '../../../services/autentication-face.service';

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.css']
})
export class FaceRecognitionComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  private intervalId: any;
  nombre!: string;
  erroMensaje = ''

  private mediaStream: MediaStream | null = null; // Para almacenar el stream de video

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router,
    private auth: AutenticationFaceService
  ) { }

  ngOnInit(): void {
    this.startVideo();
  }

  ngOnDestroy(): void {
    this.stopVideo(); // Asegúrate de limpiar cuando el componente se destruya

  }

  startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.mediaStream = stream;
        this.startFaceDeteccion();

      })
      .catch(err => this.toastr.error("Error al acceder a la camara", err))
  }


  startFaceDeteccion() {
    this.intervalId = setInterval(() => {
      this.captureImage();
    }, 3000)
  }


  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        this.sendImageToBackend(blob)
      }
    });
  }




  sendImageToBackend(imagen: Blob) {
    const formData = new FormData();

    formData.append('imagen', imagen, 'capture.png');

    this.auth.loginface(formData)
      .subscribe({
        next:
          response => {
            this.nombre = response.nombres;

            console.log("nombreUsuario ", this.nombre);
            this.toastr.success(this.nombre, " Bienvenido")
            this.router.navigate(["/home"])
            this.stopVideo();
          },
        error:
          (error => {
            // this.toastr.error("Error durante la autenticación: ", error);
            this.erroMensaje = error.error || error.message;
            this.toastr.error(this.erroMensaje);
          })
      }


      )

  }

  stopVideo() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Limpia el intervalo de captura
    }
    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.forEach(track => track.stop()); // Detiene todos los tracks del stream
    }
    this.videoElement.nativeElement.srcObject = null; // Limpia el objeto src
  }
}
