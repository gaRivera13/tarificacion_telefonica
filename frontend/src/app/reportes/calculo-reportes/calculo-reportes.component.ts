import { Component, OnInit } from '@angular/core';
import { CalculoService } from '../calculo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartamentoService, Facultad, Departamento } from '../../servicios/departamento.service';
import { AlertaService } from '../../alerta-service.service';


@Component({
  selector: 'app-calculo-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculo-reportes.component.html',
  styleUrls: ['./calculo-reportes.component.css']
})
export class CalculoReportesComponent implements OnInit {

  facultades: any[] = [];
  unidades : any[] = [];
  selectedFacultad: string = '';
  selectedDepartamento: string = '';
  selectedTipo: string = 'unidad';  
  reporteGenerado: any;
  mensaje: string = '';
  mostrarModal: boolean = false;
  modalEliminarVisible: boolean = false;
  idReporteAEliminar: number | null = null;
  reportes: any[] = [];

  constructor(
    private calculoService: CalculoService,
    private deptoService: DepartamentoService,
    private alertaService: AlertaService
  ) {}

  ngOnInit() {
    this.cargarFacultades();
    this.cargarDepartamentos();
    this.cargarReportes();
  }

  cargarFacultades() {
    this.deptoService.obtenerFacultades().subscribe((data) => {
      this.facultades = data;
    });
  }

  cargarDepartamentos() {
    this.deptoService.obtenerDepartamentos().subscribe((data) => {
      this.unidades = data;
    });
  }
  
  cargarReportes() {
    const facultadId = this.selectedFacultad;
    const unidadId = this.selectedTipo === 'unidad' ? this.selectedDepartamento : null;
    
    this.calculoService.listarReportes(facultadId, unidadId).subscribe({
      next: (data) => {
        this.reportes = data;
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
      }
    });
  }

  eliminarReporte(id: number) {
  if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
    this.calculoService.eliminarReporte(id).subscribe({
      next: () => {
        this.cargarReportes();
      },
      error: (err) => {
        console.error('Error al eliminar reporte:', err);
      }
    });
  }
}

descargarURL(id: number): string {
  return `/api/descargar_reporte/${id}/`;
}

generarReporte() {
  if (this.selectedTipo === 'unidad' && this.selectedFacultad && this.selectedDepartamento) {
    const unidad = this.unidades.find(u => u.id_unidad === Number(this.selectedDepartamento))?.nombre_depto || '';
    const fecha = new Date();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    const nombre_calculo = `Cálculo por Unidad - ${unidad} - ${mes} ${anio}`;
    this.calculoService.calculoPorUnidad(
      Number(this.selectedFacultad),
      Number(this.selectedDepartamento),
      nombre_calculo
    ).subscribe({
      next: () => {
        this.mensaje = 'Cálculo por unidad realizado correctamente.';
        this.mostrarModal = true;
        this.cargarReportes(); 
      },
      error: (err) => {
        this.mensaje = 'Error al calcular por unidad.';
        this.mostrarModal = true;
        console.error(err);
      }
    });

  } else if (this.selectedTipo === 'facultad' && this.selectedFacultad) {
    const facultad = this.facultades.find(f => f.id_facultad === Number(this.selectedFacultad))?.nombre_facultad || '';
    const fecha = new Date();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    const nombre_calculo = `Cálculo por Facultad - ${facultad} - ${mes} ${anio}`;
    this.calculoService.calculoPorFacultad(
      Number(this.selectedFacultad),
      nombre_calculo
    ).subscribe({
      next: () => {
        this.mensaje = 'Cálculo por facultad realizado correctamente.';
        this.mostrarModal = true;
        this.cargarReportes();  
      },
      error: (err) => {
        this.mensaje = 'Error al calcular por facultad.';
        this.mostrarModal = true;
        console.error(err);
      }
    });

  } else {
    this.alertaService.mostrar('Por favor selecciona los datos necesarios.');
  }
}

  cerrarModal() {
    this.mostrarModal = false;
  }

  mostrarModalEliminar(id: number) {
    this.idReporteAEliminar = id;
    this.modalEliminarVisible = true;
  }

  confirmarEliminarReporte() {
    if (this.idReporteAEliminar !== null) {
      this.calculoService.eliminarReporte(this.idReporteAEliminar).subscribe({
        next: () => {
          this.cargarReportes();
          this.cerrarModalEliminar();
        },
        error: (err) => {
          console.error('Error al eliminar reporte:', err);
          this.cerrarModalEliminar();
        }
      });
    }
  }

  cerrarModalEliminar() {
    this.modalEliminarVisible = false;
    this.idReporteAEliminar = null;
  }
}