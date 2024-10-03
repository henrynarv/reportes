import { Component } from '@angular/core';
import { ReporteService } from '../../../services/reporte.service';
import { Reporte } from 'src/app/models/reporte.interface';

@Component({
  selector: 'app-listar-reportes',
  templateUrl: './listar-reportes.component.html',
  styleUrls: ['./listar-reportes.component.css']
})
export class ListarReportesComponent {

  isModalOpen: boolean = false;
  selectedReporte: Reporte | null = null;

  reportes: Reporte[] = []
  constructor(private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.listarReportes()
  }

  listarReportes() {
    this.reporteService.listarReportes().subscribe({
      next:
        (response) => {
          this.reportes = response
          console.log("lista de reportes: ", this.reportes);
        },
      error:
        (err) => {
          console.log(" no se puede listar los reportes");
        }


    })
  }





  openModal(reporte: Reporte): void {
    if (reporte && reporte.id) {
      this.selectedReporte = reporte; // Asegúrate de que 'reporte' no sea undefined
      this.isModalOpen = true;
    } else {
      console.error("El reporte no es válido o no tiene ID mensaje desde el padre");
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedReporte = null;
  }
}
