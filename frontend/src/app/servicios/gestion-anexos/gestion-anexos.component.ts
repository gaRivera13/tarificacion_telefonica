import { Component, OnInit } from '@angular/core';
import { AnexoService } from '../anexo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartamentoService } from '../departamento.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-gestion-anexos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './gestion-anexos.component.html',
  styleUrl: './gestion-anexos.component.css'
})
export class GestionAnexosComponent implements OnInit {

  anexos: any[] = [];
  facultades: any[] = [];
  unidades: any[] = [];
  

  nombreAnexo: string = '';
  unidadBusqueda: string = '';
  idFacultad: number = 1;
  idUnidad: number = 1;
  selectedFile: File | null = null;
  fileError: string = '';

  constructor(
    private anexoService: AnexoService,
    private deptoService: DepartamentoService,
  ) {}
  
  ngOnInit(): void {
    this.cargarAnexos();
    this.obtenerFacultades();
    this.obtenerUnidades();
  }

  cargarAnexos(): void {
    this.anexoService.getAnexos().subscribe({
      next: (data) => this.anexos = data,
      error: (err) => console.error('Error al obtener anexos', err),
    });
  }

  obtenerFacultades(): void{
    this.deptoService.obtenerFacultades().subscribe((data) => {
      this.facultades = data;
    });
  }

  obtenerUnidades(): void{
    this.deptoService.obtenerDepartamentos().subscribe((data) => {
      this.unidades = data;
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const allowedExtensions = ['xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLocaleLowerCase();

    if (file && allowedExtensions.includes(fileExtension || '')){
      this.selectedFile = file;
      this.fileError = '';
    } else{
      this.selectedFile = null;
      this.fileError = 'Solo se permiten archivos Excel (.xls , .xlsx)';
    }
  }

  subirAnexo(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('archivo', this.selectedFile);
    formData.append('nombre_anexo', this.nombreAnexo);
    formData.append('fecha_creacion', new Date().toISOString());
    formData.append('id_facultad', this.idFacultad.toString());
    formData.append('id_unidad', this.idUnidad.toString());

    this.anexoService.uploadAnexo(formData).subscribe({
      next: () => {
        this.cargarAnexos();
        this.nombreAnexo = '';
        this.selectedFile = null;
        this.fileError = '';
      },
      error: (err) => console.error('Error al subir anexo:', err)
    });
  }
  
  eliminarAnexo(id: number): void {
    this.anexoService.deleteAnexo(id).subscribe({
      next: () => this.cargarAnexos(),
      error: (err) => console.error('Error al eliminar anexo:', err)
    });
  }

  buscarAnexosPorUnidad(): void {
    if (this.unidadBusqueda.trim()){
      this.anexos = this.anexos.filter(anexo =>
        anexo.id_unidad.toString().includes(this.unidadBusqueda.toLowerCase())
      );
    }else{
      this.cargarAnexos();
    }
  }
  
  editarAnexo(anexo: any): void {
    this.nombreAnexo = anexo.nombre_anexo;
    this.idFacultad = anexo.id_facultad;
    this.idUnidad = anexo.id_unidad;
  }
}
