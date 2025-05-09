import { Component, OnInit } from '@angular/core';
import { DepartamentoService, Departamento, Facultad } from '../departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from "../../compartido/menu/menu.component";

@Component({
  selector: 'app-gestion-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
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

  constructor(private deptoService: DepartamentoService) {}

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
      alert('Todos los campos son obligatorios.');
      return;
    }

    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetrasRegex.test(this.nuevoNombre)) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }

    if (!soloLetrasRegex.test(this.nuevasSiglas)) {
      alert('Las siglas solo pueden contener letras.');
      return;
    }

    const nuevoDepto: Partial<Departamento> = {
      nombre_depto: this.nuevoNombre.trim(),
      siglas_depto: this.nuevasSiglas.trim(),
      id_facultad: this.nuevaFacultadId  // ✅ ID numérico
    };

    this.deptoService.agregarDepartamento(nuevoDepto).subscribe(() => {
      this.cargarDepartamentos();
      this.cerrarModalAgregar();
    }, (error) => {
      console.error('Error al agregar departamento:', error);
      alert('Ocurrió un error al agregar el departamento.');
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
    this.editFacultadId = depto.id_facultad;  // ✅ Asumimos que es un ID numérico (según API modificada)
  }

  guardarCambios(id: number) {
    const deptoEditado: Partial<Departamento> = {
      nombre_depto: this.editNombre,
      siglas_depto: this.editSiglas,
      id_facultad: this.editFacultadId  // ✅ Enviamos solo el número
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
