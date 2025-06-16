import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { AlertaService } from '../../alerta-service.service';
import { environment } from '../../../environments/environment.development';

interface Proveedor {
  id_proveedor: number;
  nombre_proveedor: string;
}

interface ResultadoTrafico {
  tipo_llamada: string;
  tiempo_segundos: number;
  costo_segundo: number;
  total: number;
}

@Component({
  selector: 'app-consultar-trafico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe
  ],
  templateUrl: './consultar-trafico.component.html',
  styleUrl: './consultar-trafico.component.css'
})
export class ConsultarTraficoComponent implements OnInit {
  nombreProveedor: string = '';
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  meses = [
    { nombre: 'Enero', valor: 1 },
    { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 },
    { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 },
    { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 },
    { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 },
    { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 },
    { nombre: 'Diciembre', valor: 12 }
  ];
  mesSeleccionado: number = new Date().getMonth() + 1;
  resultados: ResultadoTrafico[] = [];
  buscando: boolean = false;

  constructor(private http: HttpClient, private alertaService: AlertaService) {}

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.http.get<Proveedor[]>(`${environment.coreurl}/core/proveedores/`).subscribe(data => {
      this.proveedores = data;
      this.proveedoresFiltrados = data;
    });
  }

  filtrarProveedores() {
    const filtro = this.nombreProveedor.toLowerCase();
    this.proveedoresFiltrados = this.proveedores.filter(p =>
      p.nombre_proveedor.toLowerCase().includes(filtro)
    );
  }

  buscarTrafico() {
    if (!this.nombreProveedor || !this.mesSeleccionado) {
      this.resultados = [];
      this.alertaService.mostrar('Por favor selecciona los datos necesarios.');
      return;
    }
    this.buscando = true;
    this.http.get<ResultadoTrafico[]>(
      `${environment.coreurl}/core/trafico/?proveedor=${encodeURIComponent(this.nombreProveedor)}&mes=${this.mesSeleccionado}`
    ).subscribe({
      next: (data) => {
        this.resultados = data;
        this.buscando = false;
      },
      error: () => {
        this.resultados = [];
        this.buscando = false;
      }
    });
  }
}
