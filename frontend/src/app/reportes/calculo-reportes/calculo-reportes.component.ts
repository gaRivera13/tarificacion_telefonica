import { Component, OnInit } from '@angular/core';
import { CalculoService } from '../calculo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartamentoService, Facultad, Departamento } from '../../servicios/departamento.service';


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
  selectedTipo: string = 'unidad';  // por defecto
  reporteGenerado: any;
  mensaje: string = '';
  mostrarModal: boolean = false;
  reportes: any[] = [];

  constructor(
    private calculoService: CalculoService,
    private deptoService: DepartamentoService
  
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
    const nombre_calculo = 'Cálculo por Unidad';
    this.calculoService.calculoPorUnidad(
      Number(this.selectedFacultad),
      Number(this.selectedDepartamento),
      nombre_calculo
    ).subscribe({
      next: (data) => {
        this.mensaje = 'Cálculo por unidad realizado correctamente.';
        this.mostrarModal = true;
        this.cargarReportes();  // ✅ actualiza la tabla
      },
      error: (err) => {
        this.mensaje = 'Error al calcular por unidad.';
        this.mostrarModal = true;
        console.error(err);
      }
    });

  } else if (this.selectedTipo === 'facultad' && this.selectedFacultad) {
    const nombre_calculo = 'Cálculo por Facultad';
    this.calculoService.calculoPorFacultad(
      Number(this.selectedFacultad),
      nombre_calculo
    ).subscribe({
      next: (data) => {
        this.mensaje = 'Cálculo por facultad realizado correctamente.';
        this.mostrarModal = true;
        this.cargarReportes();  // ✅ actualiza la tabla
      },
      error: (err) => {
        this.mensaje = 'Error al calcular por facultad.';
        this.mostrarModal = true;
        console.error(err);
      }
    });

  } else {
    alert('Por favor selecciona los datos necesarios.');
  }
}
  cerrarModal() {
    this.mostrarModal = false;
  }
}