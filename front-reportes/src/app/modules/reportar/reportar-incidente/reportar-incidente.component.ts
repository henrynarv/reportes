import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { map } from 'rxjs';
import { TipoReporte } from 'src/app/models/tipoReporte.interface';
import { ReporteService } from 'src/app/services/reporte.service';
import { TipoReporteService } from 'src/app/services/tipo-reporte.service';
import { register } from 'swiper/element/bundle';
import { ToastrService } from 'ngx-toastr';
import { ReporteModel } from 'src/app/models/reporte.model';
import { Provincias } from 'src/app/models/provincia.enum';


// const customIcon = L.icon({
//   iconUrl: 'assets/images/marker-icon.png',
//   // iconRetinaUrl: 'assets/images/marker-icon-2x.png',
//   shadowUrl: 'assets/images/marker-shadow.png',

// });
const customIcon = L.icon({
  iconUrl: 'assets/images/marker-icon.png', // Ruta a tu icono
  iconSize: [25, 32], // Tamaño del icono en píxeles
  iconAnchor: [16, 32], // Punto en el que se ancla el icono (esquina inferior central)
  popupAnchor: [0, -32], // Punto desde el que se muestra el popup
  shadowUrl: 'assets/images/marker-shadow.png',

});

@Component({
  selector: 'app-reportar-incidente',
  templateUrl: './reportar-incidente.component.html',
  styleUrls: ['./reportar-incidente.component.css']
})


export class ReportarIncidenteComponent {

  provincias = Object.values(Provincias);

  reporteForm!: FormGroup;
  tiposReporte: TipoReporte[] = [];
  imagen: File | null = null;

  fileName: string | null = null;

  map!: L.Map;
  marker!: any;
  latitud!: number;
  longitud!: number;


  constructor(private fb: FormBuilder, private reporteService: ReporteService,
    private tipoReporteService: TipoReporteService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.reporteForm = this.fb.group({
      descripcion: ['', Validators.required],
      latitud: [this.latitud, [Validators.min(-90), Validators.max(90)]],
      longitud: [this.longitud, [Validators.min(-180), Validators.max(180)]],
      tipoReporteId: ['', Validators.required],
      provincia: ['', Validators.required]
    });

    this.getTiposReporte();
    this.initializeMap();
    console.log('this.provincias ', this.provincias);
  }


  getTiposReporte() {
    this.tipoReporteService.obtenerTipoReporte().subscribe({
      next:
        (data) => {
          this.tiposReporte = data;
          // console.log("this.tiposReporte", this.tiposReporte);
          // this.toastr.success("Se creo el reporte con éxito");
        },
      error:
        (err) => {
          console.log("Error al crear reporte: ", err);
          // this.toastr.error("Error al crear reporte ", err)

        }
    })
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagen = input.files[0];
      this.fileName = this.imagen.name;
      console.log('Nombre del archivo: ', this.fileName);
      console.log('this.imagen: ', this.imagen);

    }
  }

  //REGISTRAR EL REPORTE
  registrarReporte() {
    const usuario = sessionStorage.getItem('user');
    let usuarioId: number;
    if (usuario) {
      const user = JSON.parse(usuario) // Convertir la cadena JSON de nuevo a objeto
      usuarioId = user.id;
      console.log("usuarioId ", usuarioId);
    } else {
      console.log('No se encontro el usuario en la session');
      return;
    }

    if (this.reporteForm.invalid || !this.imagen) {
      this.toastr.error("Por favor, completa todos los campos y seleccionana una imagen y/o video");
      return;
    }


    //CREA EL REPORTE CON LOS DATOS DEL FORMULARIO Y EL USUARIO OBTENIDO DEL ESTADO
    const reporte = new ReporteModel(
      this.reporteForm.value.descripcion,
      { latitud: this.latitud, longitud: this.longitud },
      usuarioId,
      this.reporteForm.value.tipoReporteId,
      this.reporteForm.value.provincia
    );

    //LLAMAR AL SERVICIO PARA CREAR EL REPORTE
    this.reporteService.crearReporte(reporte, this.imagen).subscribe({
      next:
        (response) => {
          this.toastr.success("Reporte creado con éxito");
          console.log("responseeee ", response);
          this.reporteForm.reset();
          this.imagen = null;
        },

      error:
        (err) => {
          this.toastr.error(err, "Error al crear el reporte")
          console.log("Error al crear el reporte ", err);
        }
    })
  }



















  ngOnDestroy(): void {
    if (this.map) {
      this.map.off(); // Limpiar eventos del mapa
    }
  }

  initializeMap(): void {
    this.map = L.map('map').setView([-8.1091, -79.0284], 12); // Coordenadas iniciales

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Define un marcador arrastrable con un icono personalizado en la ubicación predeterminada
    this.marker = L.marker([-8.1091, -79.0284], {
      icon: L.icon({ // Asume que customIcon es una instancia de L.icon
        iconUrl: 'assets/images/marker-icon.png', // Reemplaza con la URL de tu ícono
        iconSize: [25, 32], // Tamaño del icono en píxeles
        iconAnchor: [16, 32], // Punto en el que se ancla el icono (esquina inferior central)
        popupAnchor: [0, -32], // Punto desde el que se muestra el popup
      }),
      draggable: true
    }).addTo(this.map)
      .bindPopup('Ubicación actual o predeterminada')
      .openPopup();

    // Usar la API de geolocalización del navegador para obtener la ubicación actual del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Ubicación obtenida:', latitude, longitude); // Mensaje de depuración

          // Establecer la vista del mapa en la ubicación del usuario
          this.map?.setView([latitude, longitude], 12);
          this.latitud = latitude;
          this.longitud = longitude;
          console.log('this.latitudddddddddd', this.latitud, 'this.longitudddd ', this.longitud);

          // Actualizar la ubicación del marcador en la ubicación del usuario
          this.marker?.setLatLng([latitude, longitude])
            .bindPopup('Tu Ubicación actual')
            .openPopup();

          // Evento que se ejecuta cuando el marcador se mueve
          this.marker.on('dragend', (event: any) => {
            const { lat, lng } = event.target.getLatLng();
            console.log('Nueva ubicación del marcador', lat, lng);
            this.latitud = lat;
            this.longitud = lng;
            // Aquí puedes enviar las coordenadas al servidor o realizar otras acciones
            console.log('this.latitud: ', this.latitud, '\nthis.longitud', this.longitud);
          });

        },
        (error) => {
          console.log('Error al obtener la ubicación: ', error);
          // Manejo de errores o fallback a ubicación predeterminada
          this.map?.setView([-8.1091, -79.0284], 12);
          this.marker?.setLatLng([-8.1091, -79.0284])
            .bindPopup('Trujillo-Perú')
            .openPopup();

          // Configurar el evento de arrastre del marcador en la ubicación predeterminada
          this.marker?.on('dragend', (event: any) => {
            const { lat, lng } = event.target.getLatLng();
            console.log('Coordenadas del marcador después de moverlo:', lat, lng);
            // Aquí puedes enviar las coordenadas al servidor o realizar otras acciones

          });
        },
        {
          enableHighAccuracy: true, // Habilita la alta precisión
          timeout: 5000,
          maximumAge: 0 // Tiempo máximo en caché para la ubicación en milisegundos
        }
      );
    } else {
      console.log('Geolocalización no es soportada por este navegador');
      // Manejo de errores o fallback a ubicación predeterminada
      this.map?.setView([-8.1091, -79.0284], 12);
      this.marker?.setLatLng([-8.1091, -79.0284])
        .bindPopup('Trujillo-Perú')
        .openPopup();

      // Configurar el evento de arrastre del marcador en la ubicación predeterminada
      this.marker?.on('dragend', (event: any) => {
        const { lat, lng } = event.target.getLatLng();
        console.log('Coordenadas del marcador después de moverlo:', lat, lng);
        // Aquí puedes enviar las coordenadas al servidor o realizar otras acciones

      });
    }

    // Manejar el clic derecho en el mapa para agregar un nuevo marcador
    this.map.on('contextmenu', (event: L.LeafletEvent) => {
      const { latlng } = event as L.LeafletMouseEvent;
      this.addMarker(latlng.lat, latlng.lng);
      console.log('Nueva ubicación del marcador despues de hacer clic derecho para movler el marcador', latlng.lat, latlng.lng);
      this.latitud = latlng.lat;
      this.longitud = latlng.lng;
      // Aquí puedes enviar las coordenadas al servidor o realizar otras acciones
      console.log('this.latitud: ', this.latitud, '\nthis.longitud', this.longitud);
    });
  }

  addMarker(lat: number, lng: number): void {
    // Elimina el marcador existente si hay uno
    if (this.marker) {
      this.marker.remove();
    }

    // Crear y agregar el nuevo marcador en la ubicación del clic derecho
    this.marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'assets/images/marker-icon.png', // Reemplaza con la URL de tu ícono
        iconSize: [25, 32], // Tamaño del icono en píxeles
        iconAnchor: [16, 32], // Punto en el que se ancla el icono (esquina inferior central)
        popupAnchor: [0, -32], // Punto desde el que se muestra el popup
      }),
      draggable: true
    }).addTo(this.map)
      .bindPopup('Nuevo marcador')
      .openPopup();

    // Configurar el evento de arrastre del nuevo marcador
    this.marker.on('dragend', (event: any) => {
      const { lat, lng } = event.target.getLatLng();
      console.log('Nueva ubicación del marcador después de arrastrar y hacer clic derecho para movler el marcador', lat, lng);
      this.latitud = lat;
      this.longitud = lng;
      // Aquí puedes enviar las coordenadas al servidor o realizar otras acciones
      console.log('this.latitud: ', this.latitud, '\nthis.longitud', this.longitud);

    });
  }

}
