import { Component, OnInit } from '@angular/core';
import { DepartamentoService, Facultad, ProveedorTelefono } from '../departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '../../alerta-service.service';

@Component({
  selector: 'app-gestion-facultad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-facultad.component.html',
  styleUrl: './gestion-facultad.component.css'
})
export class GestionFacultadComponent implements OnInit {

  proveedores: ProveedorTelefono[] = [];
  facultades: Facultad[] = [];
  
  editarFacultadId: number | null = null;
  editNombreFacultad = '';
  editSiglasFacultad = '';
  editIdProveedor: number | null = null;

  nuevoIdProveedor: number | null = null;
  nuevoNombreFacultad = '';
  nuevasSiglasFacultad = '';
  mostrarModalAgregarFacultad = false;

  ngOnInit(): void {
    this.cargarFacultades(); 
    this.cargarProveedores();
  }

  constructor(private deptoService: DepartamentoService, private alertaService: AlertaService) {}

  cargarFacultades() {
    this.deptoService.obtenerFacultades().subscribe((data) => {
      this.facultades = data;
    });
  }

  cargarProveedores() {
  this.deptoService.obtenerProveedores().subscribe(data => {
    this.proveedores = data;
  });
  }
  
  abrirModalAgregarFacultad() {
    this.nuevoNombreFacultad = '';
    this.nuevasSiglasFacultad = '';
    this.nuevoIdProveedor = this.proveedores.length > 0 ? this.proveedores[0].id_proveedor : null;
    this.mostrarModalAgregarFacultad = true;
  }

  
  cerrarModalAgregarFacultad() {
    this.mostrarModalAgregarFacultad = false;
  }
  
  confirmarAgregarFacultad() {
    if (!this.nuevoNombreFacultad.trim() || !this.nuevasSiglasFacultad.trim()) {
      this.alertaService.mostrar('Todos los campos son obligatorios.');
      return;
    }

    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetrasRegex.test(this.nuevoNombreFacultad)) {
      this.alertaService.mostrar('El nombre de la facultad solo puede contener letras y espacios.');
      return;
    }

    if (!soloLetrasRegex.test(this.nuevasSiglasFacultad)) {
      this.alertaService.mostrar('Las siglas solo pueden contener letras.');
      return;
    }

    const nuevaFacultad: Partial<Facultad> = {
      nombre_facultad: this.nuevoNombreFacultad.trim(),
      siglas_facultad: this.nuevasSiglasFacultad.trim(),
      id_proveedor: this.nuevoIdProveedor !== null ? this.nuevoIdProveedor : undefined 
    };


    this.deptoService.agregarFacultad(nuevaFacultad).subscribe(() => {
      this.cargarFacultades();
      this.cerrarModalAgregarFacultad();
    });
  }
  
    editarFacultad(fac: Facultad) {
      this.editarFacultadId = fac.id_facultad;
      this.editNombreFacultad = fac.nombre_facultad;
      this.editSiglasFacultad = fac.siglas_facultad;
      this.editIdProveedor = fac.id_proveedor;
    }

  
  guardarCambiosFacultad(id: number) {
    if (!this.editNombreFacultad.trim() || !this.editSiglasFacultad.trim()) {
      this.alertaService.mostrar('Todos los campos son obligatorios.');
      return;
    }

    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetrasRegex.test(this.editNombreFacultad)) {
      this.alertaService.mostrar('El nombre solo puede contener letras y espacios.');
      return;
    }

    if (!soloLetrasRegex.test(this.editSiglasFacultad)) {
      this.alertaService.mostrar('Las siglas solo pueden contener letras.');
      return;
    }

    const actualizada: Partial<Facultad> = {
      nombre_facultad: this.editNombreFacultad.trim(),
      siglas_facultad: this.editSiglasFacultad.trim(),
      id_proveedor: this.editIdProveedor !== null ? this.editIdProveedor : undefined
    };


    this.deptoService.editarFacultad(id, actualizada).subscribe(() => {
      this.editarFacultadId = null;
      this.cargarFacultades();
    });
  }

  eliminarFacultad(id: number) {
      if (confirm('¿Estás seguro de que deseas eliminar esta facultad?')) {
          this.deptoService.eliminarFacultad(id).subscribe(() => {
              console.log(`Facultad ${id} eliminada correctamente`);
              this.cargarFacultades(); 
          }, error => {
              console.error('Error al eliminar la facultad', error);
          });
      }
  }

  cancelarEdicionFacultad() {
    this.editarFacultadId = null;
  }

}
