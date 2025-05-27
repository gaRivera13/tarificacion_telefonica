import { Component, OnInit } from '@angular/core';
import { CalculoService } from '../calculo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculo-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculo-reportes.component.html',
  styleUrls: ['./calculo-reportes.component.css']
})
export class CalculoReportesComponent implements OnInit {

  facultades: any[] = [];
  departamentos: any[] = [];
  proveedores: any[] = [];
  anexos: any[] = [];
  selectedFacultad: string = '';
  selectedDepartamento: string = '';
  selectedProveedor: string = '';
  selectedTipo: string = '';
  selectedAnexo: string = '';
  reporteGenerado: any;

  constructor(private calculoService: CalculoService) {}

  ngOnInit() {
    this.cargarFacultades();
    this.cargarDepartamentos();
  }

  // Carga facultades
  cargarFacultades() {
    this.calculoService.getProveedores().subscribe(
      (data) => {
        this.facultades = data;
      },
      (error) => {
        console.error('Error al cargar facultades:', error);
      }
    );
  }

  // cargar departamentos
  cargarDepartamentos() {
    this.calculoService.getProveedores().subscribe(
      (data) => {
        this.departamentos = data;
      },
      (error) => {
        console.error('Error al cargar departamentos:', error);
      }
    );
  }

  // Carga anexos
  cargarAnexos() {
    if (this.selectedTipo === 'facultad') {
      this.calculoService.getAnexos(Number(this.selectedFacultad)).subscribe(
        (data) => {
          this.anexos = data;
        },
        (error) => {
          console.error('Error al cargar anexos:', error);
        }
      );
    } else {
      this.calculoService.getAnexos(undefined, Number(this.selectedDepartamento)).subscribe(
        (data) => {
          this.anexos = data;
        },
        (error) => {
          console.error('Error al cargar anexos:', error);
        }
      );
    }
  }

    // Realizar el cálculo del reporte
  generarReporte() {
    if (this.selectedFacultad && this.selectedDepartamento && this.selectedProveedor) {
      this.calculoService.calcularReporte(
        Number(this.selectedFacultad), 
        Number(this.selectedDepartamento), 
        Number(this.selectedProveedor),
        this.selectedTipo === 'facultad'
      ).subscribe(
        (data) => {
          this.reporteGenerado = data; // Muestra los resultados
          console.log('Reporte generado', this.reporteGenerado);
        },
        (error) => {
          console.error('Error al generar reporte:', error);
        }
      );
    } else {
      alert('Por favor selecciona todos los campos');
    }
  }
}
