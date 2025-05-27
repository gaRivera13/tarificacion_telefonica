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
  displayedColumns: string[] = [
    'id_anexo', 
    'nombre_anexo', 
    'fecha_creacion', 
    'archivo_url']; // Columnas que quieres mostrar en la tabla
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
    next: (data) => {
      this.anexos = data; 
    },
    error: (err) => {
      console.error('Error al obtener anexos', err);
    },
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
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext !== 'xls' && ext !== 'xlsx') {
    this.fileError = 'Formato no válido. Solo se aceptan archivos .xls y .xlsx';
    this.selectedFile = null;
  } else {
    this.selectedFile = file;
    this.fileError = '';
  }
}


  
  subirAnexo(): void {
    if (!this.selectedFile) return;
    
    const formData = new FormData();
    formData.append('archivo', this.selectedFile);
    formData.append('nombre_anexo', this.nombreAnexo);
    formData.append('id_facultad', this.idFacultad.toString());
    formData.append('id_unidad', this.idUnidad.toString());
    
    this.anexoService.subirAnexo(formData).subscribe({
      next: () => {
        this.cargarAnexos();
        this.nombreAnexo = '';
        this.selectedFile = null;
        this.fileError = '';
      },
      error: (err) => {
        console.error('Error al subir anexo:', err);
        if (err.error) {
          this.fileError = err.error;
        }
      }
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
