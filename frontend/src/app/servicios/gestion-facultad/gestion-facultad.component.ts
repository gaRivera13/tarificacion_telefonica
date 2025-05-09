import { Component, OnInit } from '@angular/core';
import { DepartamentoService, Facultad } from '../departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from "../../compartido/menu/menu.component";

@Component({
  selector: 'app-gestion-facultad',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './gestion-facultad.component.html',
  styleUrl: './gestion-facultad.component.css'
})
export class GestionFacultadComponent implements OnInit {


  facultades: Facultad[] = [];
  editarFacultadId: number | null = null;
  editNombreFacultad = '';
  editSiglasFacultad = '';

  nuevoNombreFacultad = '';
  nuevasSiglasFacultad = '';
  mostrarModalAgregarFacultad = false;

  ngOnInit(): void {
    this.cargarFacultades(); // 👈 nuevo
  }

  constructor(private deptoService: DepartamentoService) {}

  cargarFacultades() {
    this.deptoService.obtenerFacultades().subscribe((data) => {
      this.facultades = data;
    });
  }
  
  abrirModalAgregarFacultad() {
    this.nuevoNombreFacultad = '';
    this.nuevasSiglasFacultad = '';
    this.mostrarModalAgregarFacultad = true;
  }
  
  cerrarModalAgregarFacultad() {
    this.mostrarModalAgregarFacultad = false;
  }
  
  confirmarAgregarFacultad() {
    // Validación: campos vacíos
    if (!this.nuevoNombreFacultad.trim() || !this.nuevasSiglasFacultad.trim()) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    // Validación: solo letras y espacios
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetrasRegex.test(this.nuevoNombreFacultad)) {
      alert('El nombre de la facultad solo puede contener letras y espacios.');
      return;
    }

    if (!soloLetrasRegex.test(this.nuevasSiglasFacultad)) {
      alert('Las siglas solo pueden contener letras.');
      return;
    }

    const nuevaFacultad: Partial<Facultad> = {
      nombre_facultad: this.nuevoNombreFacultad.trim(),
      siglas_facultad: this.nuevasSiglasFacultad.trim()
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
  }
  
  guardarCambiosFacultad(id: number) {
    // Validación: campos vacíos
    if (!this.editNombreFacultad.trim() || !this.editSiglasFacultad.trim()) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!soloLetrasRegex.test(this.editNombreFacultad)) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }

    if (!soloLetrasRegex.test(this.editSiglasFacultad)) {
      alert('Las siglas solo pueden contener letras.');
      return;
    }

    const actualizada: Partial<Facultad> = {
      nombre_facultad: this.editNombreFacultad.trim(),
      siglas_facultad: this.editSiglasFacultad.trim()
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
              this.cargarFacultades(); // Recarga las facultades
          }, error => {
              console.error('Error al eliminar la facultad', error);
          });
      }
  }


  cancelarEdicionFacultad() {
    this.editarFacultadId = null;
  }
  

}
