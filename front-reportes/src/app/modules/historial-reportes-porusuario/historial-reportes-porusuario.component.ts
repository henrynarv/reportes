import { Component, SimpleChanges } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { Reporte } from 'src/app/models/reporte.interface';
import * as L from 'leaflet';
import { EstadoReporte } from '../../models/estadoReporte.enum';

@Component({
  selector: 'app-historial-reportes-porusuario',
  templateUrl: './historial-reportes-porusuario.component.html',
  styleUrls: ['./historial-reportes-porusuario.component.css']
})
export class HistorialReportesPorusuarioComponent {

  private map: L.Map | undefined;

  estadoReporte!: EstadoReporte;


  // Variables para manejar el orden
  sortDirection: 'asc' | 'desc' | null = null;

  reportes: Reporte[] = [];
  selectedReporte: Reporte | null = null;

  constructor(private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.listarReportesPorUsuario();
    this.initMap();

  }


  selectReporte(reporte: Reporte) {
    this.selectedReporte = reporte;
    console.log("this.selectedReporte:  ", this.selectedReporte);
    this.initMap();
  }

  listarReportesPorUsuario() {
    const usuario = sessionStorage.getItem('user');
    let usuarioId: number;
    if (usuario) {
      const user = JSON.parse(usuario);
      usuarioId = user.id;
      console.log('UsuarioId de historial ', usuarioId);

    } else {
      console.log('No se encontro el usuario en la sesion');
      return;
    }


    this.reporteService.obtenerReportesPorUsuario(usuarioId).subscribe({
      next:
        (response) => {
          this.reportes = response;
          if (this.reportes.length > 0) {
            this.selectReporte(this.reportes[0]);
          }
          console.log('this.reportes de historial: ', this.reportes);
        },
      error:
        (err) => {
          console.log("Error al obtener los repprtes por usuario: ", err)
        }
    })
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    // Esperar un momento para asegurar que el contenedor del mapa esté disponible
    setTimeout(() => {
      const lat = this.selectedReporte?.ubicacion?.latitud! // Latitud del reporte
      const lng = this.selectedReporte?.ubicacion?.longitud!;  // Longitud del reporte

      console.log('lat', lat);
      console.log('lng', lng);
      this.map = L.map('map').setView([lat, lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      const customIcon = L.icon({
        iconUrl: 'assets/images/marker-icon.png',
        iconSize: [25, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      L.marker([lat, lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup('Ubicación del incidente')
        .openPopup();
    }, 0);
  }


  sortReportes() {
    // EL VALOR INICIAL ES NULL OSEA FALSO Y PASA AL ELSE
    if (this.sortDirection === 'asc') {
      // ORDENA DE FORMA ASCENDENTE
      this.reportes.sort((a, b) => new Date(a.fechaHoraReporte).getTime() - new Date(b.fechaHoraReporte).getTime());
      this.sortDirection = 'desc';
    } else {
      // ORDENA DE FORMA DESCENDENTE
      this.reportes.sort((a, b) => new Date(b.fechaHoraReporte).getTime() - new Date(a.fechaHoraReporte).getTime());
      this.sortDirection = 'asc';
    }
  }
}
