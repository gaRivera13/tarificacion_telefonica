import { Component, OnInit } from '@angular/core';
import { DepartamentoService, Facultad } from '../departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-facultad',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    const nuevaFacultad: Partial<Facultad> = {
      nombre_facultad: this.nuevoNombreFacultad,
      siglas_facultad: this.nuevasSiglasFacultad
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
    const actualizada: Partial<Facultad> = {
      nombre_facultad: this.editNombreFacultad,
      siglas_facultad: this.editSiglasFacultad
    };
  
    this.deptoService.editarFacultad(id, actualizada).subscribe(() => {
      this.editarFacultadId = null;
      this.cargarFacultades();
    });
  }
  
  eliminarFacultad(id: number) {
    this.deptoService.eliminarFacultad(id).subscribe(() => {
      this.cargarFacultades();
    });
  }
  
  cancelarEdicionFacultad() {
    this.editarFacultadId = null;
  }
  

}
