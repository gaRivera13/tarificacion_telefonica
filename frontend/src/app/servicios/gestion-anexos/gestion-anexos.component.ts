import { Component, OnInit } from '@angular/core';
import { AnexoService } from '../anexo.service';
import { DepartamentoService } from '../departamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-gestion-anexos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './gestion-anexos.component.html',
  styleUrls: ['./gestion-anexos.component.css']
})
export class GestionAnexosComponent implements OnInit {
  displayedColumns: string[] = ['id_anexo', 'nombre_anexo', 'fecha_creacion', 'archivo_url'];
  anexos: any[] = [];
  facultades: any[] = [];
  unidades: any[] = [];

  nombreAnexo: string = '';
  unidadBusqueda: string = '';
  idFacultad: number = 1;
  idUnidad: number = 1;
  idAnexoEditando: number | null = null;
  selectedFile: File | null = null;
  fileError: string = '';
  mostrarModalAnexo = false;
  archivoAnterior: string | null = null;

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

  obtenerFacultades(): void {
    this.deptoService.obtenerFacultades().subscribe((data) => {
      this.facultades = data;
    });
  }

  obtenerUnidades(): void {
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
  const formData = new FormData();
  const esEdicion = this.idAnexoEditando !== null;

  // Si es creación, archivo es obligatorio
  if (!esEdicion && !this.selectedFile) {
    this.fileError = 'Debe seleccionar un archivo';
    return;
  }

  // Si hay archivo nuevo, lo subimos
  if (this.selectedFile) {
    formData.append('archivo', this.selectedFile);
  }

  formData.append('nombre_anexo', this.nombreAnexo);
  formData.append('id_facultad', this.idFacultad.toString());
  formData.append('id_unidad', this.idUnidad.toString());

  if (esEdicion) {
    this.anexoService.actualizarAnexo(this.idAnexoEditando!, formData).subscribe({
      next: () => {
        this.cargarAnexos();
        this.cerrarModalAnexo();
      },
      error: (err) => {
        console.error('Error al actualizar anexo:', err);
        this.fileError = "Error al actualizar anexo";
      }
    });
  } else {
    this.anexoService.subirAnexo(formData).subscribe({
      next: () => {
        this.cargarAnexos();
        this.cerrarModalAnexo();
      },
      error: (err) => {
        console.error('Error al subir anexo', err);
        this.fileError = 'Error al subir anexo';
      }
    });
  }
}


  eliminarAnexo(id: number): void {
    this.anexoService.deleteAnexo(id).subscribe({
      next: () => this.cargarAnexos(),
      error: (err) => console.error('Error al eliminar anexo:', err)
    });
  }

  buscarAnexosPorUnidad(): void {
    if (this.unidadBusqueda.trim()) {
      this.anexoService.buscarAnexosPorUnidad(this.unidadBusqueda).subscribe({
        next: data => this.anexos = data,
        error: err => console.error('Error al buscar anexos', err)
      });
    } else {
      this.cargarAnexos();
    }
  }

  obtenerNombreArchivo(url: string): string {
    return url.split('/').pop() ?? 'archivo.xlsx';
  }

  editarAnexo(anexo: any): void {
    this.nombreAnexo = anexo.nombre_anexo;
    this.idFacultad = anexo.id_facultad.id_facultad ?? anexo.id_facultad;
    this.idUnidad = anexo.id_unidad.id_unidad ?? anexo.id_unidad;
    this.idAnexoEditando = anexo.id_anexo;
    this.archivoAnterior = anexo.archivo;
    this.mostrarModalAnexo = true;
  }

  abrirModalAnexo(): void {
    this.mostrarModalAnexo = true;
  }

  cerrarModalAnexo(): void {
    this.mostrarModalAnexo = false;
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.nombreAnexo = '';
    this.idFacultad = this.facultades.length > 0 ? this.facultades[0].id_facultad : 0;
    this.idUnidad = this.unidades.length > 0 ? this.unidades[0].id_unidad : 0;
    this.selectedFile = null;
    this.fileError = '';
    this.idAnexoEditando = null;
    this.archivoAnterior = null;
  }

  
}
