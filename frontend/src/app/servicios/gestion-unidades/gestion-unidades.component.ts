import { Component, OnInit } from '@angular/core';
import { DepartamentoService, Departamento, Facultad } from '../departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '../../alerta-service.service';

@Component({
  selector: 'app-gestion-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-unidades.component.html',
  styleUrls: ['./gestion-unidades.component.css']
})
export class GestionUnidadesComponent implements OnInit {

  mostrarModalAgregar = false;
  nuevoNombre: string = '';
  nuevasSiglas: string = '';
  nuevaFacultadId: number = 0;

  editarId: number | null = null;
  editNombre: string = '';
  editSiglas: string = '';
  editFacultadId: number = 0;

  departamentos: Departamento[] = [];
  facultades: Facultad[] = [];

  constructor(private deptoService: DepartamentoService, private alertaService: AlertaService) {}

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarFacultades();
  }

  abrirModalAgregar() {
    this.mostrarModalAgregar = true;
    this.nuevoNombre = '';
    this.nuevasSiglas = '';
    this.nuevaFacultadId = this.facultades.length > 0 ? this.facultades[0].id_facultad : 0;
  }

  cerrarModalAgregar() {
    this.mostrarModalAgregar = false;
  }

  confirmarAgregar() {
    if (!this.nuevoNombre.trim() || !this.nuevasSiglas.trim()) {
      this.alertaService.mostrar('Todos los campos son obligatorios.');
      return;
    }

    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetrasRegex.test(this.nuevoNombre)) {
      this.alertaService.mostrar('El nombre solo puede contener letras y espacios.');
      return;
    }

    if (!soloLetrasRegex.test(this.nuevasSiglas)) {
      this.alertaService.mostrar('Las siglas solo pueden contener letras.');
      return;
    }

    const nuevoDepto: Partial<Departamento> = {
      nombre_depto: this.nuevoNombre.trim(),
      siglas_depto: this.nuevasSiglas.trim(),
      id_facultad: this.nuevaFacultadId  
    };

    this.deptoService.agregarDepartamento(nuevoDepto).subscribe(() => {
      this.cargarDepartamentos();
      this.cerrarModalAgregar();
    }, (error) => {
      console.error('Error al agregar departamento:', error);
      this.alertaService.mostrar('Ocurrió un error al agregar el departamento.');
    });
  }

  cargarFacultades() {
    this.deptoService.obtenerFacultades().subscribe(data => {
      this.facultades = data;
    });
  }

  cargarDepartamentos() {
    this.deptoService.obtenerDepartamentos().subscribe(data => {
      this.departamentos = data;
    });
  }

  editarDepartamento(depto: Departamento) {
    this.editarId = depto.id_unidad;
    this.editNombre = depto.nombre_depto;
    this.editSiglas = depto.siglas_depto;
    this.editFacultadId = depto.id_facultad;  
  }

  guardarCambios(id: number) {
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!this.editNombre.trim() || !this.editSiglas.trim()) {
      this.alertaService.mostrar('Todos los campos son obligatorios.');
      return;
    }

    if (!soloLetrasRegex.test(this.editNombre)) {
      this.alertaService.mostrar('El nombre solo puede contener letras y espacios.');
      return;
    }

    if (!soloLetrasRegex.test(this.editSiglas)) {
      this.alertaService.mostrar('Las siglas solo pueden contener letras.');
      return;
    }

    const deptoEditado: Partial<Departamento> = {
      nombre_depto: this.editNombre.trim(),
      siglas_depto: this.editSiglas.trim(),
      id_facultad: this.editFacultadId
    };

    this.deptoService.editarDepartamento(id, deptoEditado).subscribe(() => {
      this.cargarDepartamentos();
      this.cancelarEdicion();
    }, error => {
      console.error('Error al editar departamento:', error);
    });
  }

  cancelarEdicion() {
    this.editarId = null;
    this.editNombre = '';
    this.editSiglas = '';
    this.editFacultadId = 0;
  }

  eliminarDepartamento(id: number) {
    this.deptoService.eliminarDepartamento(id).subscribe(() => {
      this.departamentos = this.departamentos.filter(d => d.id_unidad !== id);
    });
  }
}
