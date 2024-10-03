import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from '../../../services/reporte.service';
import { Reporte } from 'src/app/models/reporte.interface';
import { ToastrService } from 'ngx-toastr';
import { Provincias } from '../../../models/provincia.enum';

@Component({
  selector: 'app-mapa-libertad',
  templateUrl: './mapa-libertad.component.html',
  styleUrls: ['./mapa-libertad.component.css']
})
export class MapaLibertadComponent {
  selectedProvince: string | null = null;
  provinceData: any = null;
  zoomLebel: number = 1;

  reportes: Reporte[] = [];
  provinciaYConteo: { nombre: string; conteo: number }[] = [];
  // conteoIncidentes: any;


  //DATOS POR PROVINCIA
  // provincesData: any = {
  //   TRUJILLO: { accidentes: 10, incidentes: 5, otros: 3 },
  //   VIRU: { accidentes: 3, incidentes: 7, otros: 7 }
  // }

  constructor(private http: HttpClient, private reporteService: ReporteService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSvgFromAssets();
  }

  loadSvgFromAssets() {
    this.http.get('assets/mapa-libertad.html', { responseType: 'text' })
      .subscribe(svgText => {
        // Insertamos el SVG en el contenedor
        const mapaContainer = document.getElementById('mapa-container');
        if (mapaContainer) {
          mapaContainer.innerHTML = svgText

          // Añadimos eventos de clic a cada provincia después de que el SVG haya sido cargado
          const provincias = mapaContainer.querySelectorAll('.provincia');
          console.log("provincias", provincias);
          provincias.forEach((provincia: any) => {
            provincia.addEventListener('click', () => this.onProvinceClick(provincia));
            console.log("provincia.id", provincia.id);
          });
        }
      }, error => {
        console.error('Error al cargar el svg ', error);
      })
  }

  onProvinceClick(provincia: any) {
    // Remover la clase 'seleccionada' de todas las provincias
    const provincias = document.querySelectorAll('.provincia');
    provincias.forEach((prov: any) => {
      prov.classList.remove('seleccionada');
    });

    // Añadir la clase 'seleccionada' a la provincia clicada
    provincia.classList.add('seleccionada');

    // Almacenar la provincia seleccionada y cargar los datos correspondientes
    const provinciaId = provincia.id;
    this.selectedProvince = provinciaId; // Almacena la provincia seleccionada
    this.provinceData = this.contarIncidentes || null;


    this.cargarReportes();
    this.contarIncidentes();
  }


  cargarReportes() {
    if (!this.selectedProvince) {
      console.error('No se ha seleccionado ninguna provincia');
      return;
    }
    // Llamar al servicio solo para la provincia seleccionada

    this.reporteService.getReportesPorProvincia(this.selectedProvince).subscribe({
      next:
        (data) => {

          this.reportes = data;
          console.log("this.reportes", this.selectedProvince, ":", this.reportes);
        },
      error:
        (err) => {
          this.toastr.error(err, "Error al cargar reportes");
          console.error("Error al cargar reportes ", this.selectedProvince, err);
        }
    })
  }


  contarIncidentes() {
    if (!this.selectedProvince) {
      console.error('No se ha seleccionado ninguna provincia');
      return;

    }

    this.reporteService.contarReportesPorTipoYProvincia(this.selectedProvince).subscribe({
      next:
        (data) => {
          console.log('data: ', data);
          // Procesar la respuesta y llenar 'this.provinciaYConteo'
          this.provinciaYConteo = Object.keys(data).map(key => {
            const nombre = key.match(/nombre=(.*?),/)![1]; // Extrae el nombre
            const conteo = data[key]; // Obtiene el conteo
            return { nombre, conteo }
          });
          console.log('this.contarIncidentes', this.selectedProvince, ":", this.provinciaYConteo);
        },
      error:
        (err) => {
          this.toastr.error(err, " Error al comtar incidentes: ");
          console.error("Error al comtar incidentes: ", err);
        }
    })
  }

}
