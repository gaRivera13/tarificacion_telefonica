// src/app/gestion-unidades/gestion-unidades.component.ts
import { Component, OnInit } from '@angular/core';
import { DepartamentoService, Departamento, Facultad } from '../departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-unidades.component.html',
  styleUrl: './gestion-unidades.component.css'
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

  constructor(private deptoService: DepartamentoService) {}

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarFacultades(); // 👈 nuevo
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
    // Validación de campos vacíos
    if (!this.nuevoNombre.trim() || !this.nuevasSiglas.trim()) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    // Validación solo letras (con espacios permitidos)
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  
    if (!soloLetrasRegex.test(this.nuevoNombre)) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }
  
    if (!soloLetrasRegex.test(this.nuevasSiglas)) {
      alert('Las siglas solo pueden contener letras.');
      return;
    }
  
    const facultadSeleccionada = this.facultades.find(f => f.id_facultad === this.nuevaFacultadId);
    if (!facultadSeleccionada) {
      alert('Debe seleccionar una facultad válida.');
      return;
    }
  
    const nuevoDepto: Partial<Departamento> = {
      nombre_depto: this.nuevoNombre.trim(),
      siglas_depto: this.nuevasSiglas.trim(),
      id_facultad: facultadSeleccionada
    };
  
    this.deptoService.agregarDepartamento(nuevoDepto).subscribe(() => {
      this.cargarDepartamentos();
      this.cerrarModalAgregar();
    }, (error) => {
      console.error('Error al agregar departamento:', error);
      alert('Ocurrió un error al agregar el departamento.');
    });
  }
  
  agregarDepartamento() {
    const facultadSeleccionada = this.facultades.find(f => f.id_facultad === this.nuevaFacultadId);
  
    if (!facultadSeleccionada) {
      console.error('Facultad no encontrada para el nuevo departamento');
      return;
    }
  
    const nuevoDepto: Partial<Departamento> = {
      nombre_depto: this.nuevoNombre,
      siglas_depto: this.nuevasSiglas,
      id_facultad: facultadSeleccionada
    };
  
    this.deptoService.agregarDepartamento(nuevoDepto).subscribe(() => {
      this.cargarDepartamentos();  // recarga la lista
      // limpiar formulario
      this.nuevoNombre = '';
      this.nuevasSiglas = '';
      this.nuevaFacultadId = 0;
    });
  }
  

  cargarFacultades() {
    this.deptoService.obtenerFacultades().subscribe(data => {
      this.facultades = data;
    });
  }

  editarDepartamento(depto: Departamento) {
    this.editarId = depto.id_unidad;
    this.editNombre = depto.nombre_depto;
    this.editSiglas = depto.siglas_depto;
    this.editFacultadId = depto.id_facultad.id_facultad;
  }
  
  guardarCambios(id: number) {
    const facultadSeleccionada = this.facultades.find(f => f.id_facultad === this.editFacultadId);
  
    if (!facultadSeleccionada) {
      console.error('Facultad no encontrada');
      return;
    }
  
    const deptoEditado: Partial<Departamento> = {
      nombre_depto: this.editNombre,
      siglas_depto: this.editSiglas,
      id_facultad: facultadSeleccionada  // 👈 se envía como objeto
    };
  
    this.deptoService.editarDepartamento(id, deptoEditado).subscribe(() => {
      this.cargarDepartamentos();
      this.cancelarEdicion();
    });
  }
  
  cancelarEdicion() {
    this.editarId = null;
    this.editNombre = '';
    this.editSiglas = '';
    this.editFacultadId = 0;
  }

  cargarDepartamentos() {
    this.deptoService.obtenerDepartamentos().subscribe(data => {
      this.departamentos = data;
    });
  }

  eliminarDepartamento(id: number) {
    this.deptoService.eliminarDepartamento(id).subscribe(() => {
      this.departamentos = this.departamentos.filter(d => d.id_unidad !== id);
    });
  }
}
