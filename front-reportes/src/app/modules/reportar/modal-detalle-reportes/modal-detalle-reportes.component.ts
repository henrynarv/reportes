import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Reporte } from 'src/app/models/reporte.interface';
import * as L from 'leaflet';
import { ReporteService } from '../../../services/reporte.service';
import { HistorialEstadoService } from '../../../services/historial-estado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-detalle-reportes',
  templateUrl: './modal-detalle-reportes.component.html',
  styleUrls: ['./modal-detalle-reportes.component.css']
})
export class ModalDetalleReportesComponent {

  @Input() isOpen = false; //CONTROLA SI EL MODAL ESTA ABIERTO
  @Input() reporte: Reporte | null = null;
  @Output() close = new EventEmitter<void>();//evento para cerrar el  modal


  historial: any[] = [];
  estados = ['PENDIENTE', 'EN_REVISION', 'RESUELTO'];
  currentEstadoIndex = 0;
  currentEstado = 'PENDIENTE'; // Estado inicial
  mensaje: string | null = null;

  constructor(private reporteService: ReporteService, private historialEstadoService: HistorialEstadoService,
    private toastr: ToastrService
  ) { }

  // ngOnInit(): void {

  //   this.cargarHistorialEstado();

  // }


  private map: L.Map | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isOpen) {
      this.initMap();
    }

    if (changes['reporte']) {
      if (this.reporte && this.reporte.id) {
        this.cargarHistorialEstado();
      } else {
        console.warn("El reporte es undefined o su ID es inválido error desde el hijo ngOnchanges");
      }
    }
  }



  initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    // Esperar un momento para asegurar que el contenedor del mapa esté disponible
    setTimeout(() => {
      const lat = this.reporte?.ubicacion.latitud! // Latitud del reporte
      const lng = this.reporte?.ubicacion.longitud!;  // Longitud del reporte

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





  cargarHistorialEstado(): void {
    if (!this.reporte || !this.reporte.id) {
      console.error("El ID del reporte es undefined");
      this.mensaje = "No se puede cargar el historial porque el ID del reporte es inválido.";
      return; // Salir de la función si el ID es inválido
    }
    this.historialEstadoService.obtenerHistorialEstado(this.reporte.id).subscribe(data => {
      this.historial = data;
      // Asignar el último estado al currentEstado
      const ultimoEstado = this.historial[this.historial.length - 1]?.estado || 'PENDIENTE';
      this.currentEstado = ultimoEstado;
      // Establecer el índice del estado actual
      this.currentEstadoIndex = this.estados.indexOf(this.currentEstado);
    });
  }


  cambiarEstado(nuevoEstado: string): void {
    if (!this.reporte || !this.reporte.id) {
      console.error("Reporte no definido o ID es undefined");
      return; // O maneja el error como desees
    }
    const nuevoEstadoIndex = this.estados.indexOf(nuevoEstado);

    // Verifica si se puede avanzar al siguiente estado
    if (nuevoEstadoIndex === this.currentEstadoIndex + 1) {
      this.reporteService.actualizarEstado(this.reporte.id, nuevoEstado).subscribe({
        next: () => {
          this.mensaje = "Estado actualizado con éxito";
          this.currentEstadoIndex = nuevoEstadoIndex;
          this.cargarHistorialEstado(); // Recarga el historial después de actualizarlo
        },
        error: (err) => {
          this.mensaje = "Error al actualizar el estado";
        }
      });
    }
  }



  closeModal() {
    this.close.emit();
  }
}

