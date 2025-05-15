import { Component, OnInit } from '@angular/core';
import { AnexoService } from '../anexo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartamentoService } from '../departamento.service';



@Component({
  selector: 'app-gestion-anexos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-anexos.component.html',
  styleUrl: './gestion-anexos.component.css'
})
export class GestionAnexosComponent implements OnInit {

  anexos: any[] = [];
  facultades: any[] = [];
  unidades: any[] = [];
  

  nombreAnexo: string = '';
  fechaCreacion: string = '';
  idFacultad: number = 1;
  idUnidad: number = 1;
  selectedFile: File | null = null;

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
        console.error('Error al obtener anexos:', err)
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
    this.selectedFile = event.target.files[0];
  }

  subirAnexo(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('archivo', this.selectedFile);
    formData.append('nombre_anexo', this.nombreAnexo);
    formData.append('fecha_creacion', this.fechaCreacion);
    formData.append('id_facultad', this.idFacultad.toString());
    formData.append('id_unidad', this.idUnidad.toString());

    this.anexoService.uploadAnexo(formData).subscribe({
      next: () => {
        this.cargarAnexos();
        this.selectedFile = null;
        this.nombreAnexo = '';
        this.fechaCreacion = '';
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

}
