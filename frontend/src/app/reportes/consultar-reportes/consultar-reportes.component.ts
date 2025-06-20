import { Component, OnInit } from '@angular/core';
import { CalculoService } from '../calculo.service';
import { DepartamentoService } from '../../servicios/departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertaService } from '../../alerta-service.service';


@Component({
  selector: 'app-consultar-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-reportes.component.html',
  styleUrls: ['./consultar-reportes.component.css']
})
export class ConsultarReportesComponent implements OnInit {
  facultades: any[] = [];
  unidades: any[] = [];
  filteredUnidades: any[] = [];
  selectedTipo: string = 'unidad';
  selectedFacultad: string = '';
  selectedDepartamento: string = '';
  reportes: any[] = [];
  buscando: boolean = false;

  constructor(
    private calculoService: CalculoService,
    private deptoService: DepartamentoService,
    private alertaService: AlertaService
  ) {}

  ngOnInit() {
    this.cargarFacultades();
    this.cargarDepartamentos();
  }

  cargarFacultades() {
    this.deptoService.obtenerFacultades().subscribe((data) => {
      this.facultades = data;
    });
  }

  cargarDepartamentos() {
    this.deptoService.obtenerDepartamentos().subscribe((data) => {
      this.unidades = data;
      this.filtrarUnidadesPorFacultad();
    });
  }

  setTipo(tipo: string) {
    this.selectedTipo = tipo;
    if (tipo === 'facultad') {
      this.selectedDepartamento = '';
    }
  }

  onFacultadChange() {
    this.filtrarUnidadesPorFacultad();
    this.selectedDepartamento = '';
  }

  filtrarUnidadesPorFacultad() {
    if (this.selectedFacultad) {
      this.filteredUnidades = this.unidades.filter(
        unidad => String(unidad.id_facultad) === String(this.selectedFacultad)
      );
    } else {
      this.filteredUnidades = [];
    }
  }

  buscarReportes() {
    this.buscando = true;
    const facultadId = Number(this.selectedFacultad);
    const departamentoId = Number(this.selectedDepartamento);

    if (this.selectedTipo === 'unidad' && facultadId && departamentoId) {
      const unidad = this.unidades.find(u => u.id_unidad === departamentoId);
      if (!unidad || String(unidad.id_facultad) !== String(this.selectedFacultad)) {
        this.reportes = [];
        this.buscando = false;
        this.alertaService.mostrar('La unidad seleccionada no pertenece a la facultad elegida o no existe.');
        return;
      }
      this.calculoService.obtenerReportesPorUnidad(
        facultadId,
        departamentoId
      ).subscribe((data) => {
        this.reportes = data;
        this.buscando = false;
      });
    } else if (this.selectedTipo === 'facultad' && facultadId) {
      this.calculoService.obtenerReportesPorFacultad(
        facultadId
      ).subscribe((data) => {
        this.reportes = data;
        this.buscando = false;
      });
    } else {
      this.reportes = [];
      this.buscando = false;
      this.alertaService.mostrar('Por favor selecciona los datos necesarios.');
    }
  }

  descargarReporte(rep: any) {
    this.calculoService.descargarReporte(rep.id).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (rep.nombre || 'reporte') + '.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }


}
