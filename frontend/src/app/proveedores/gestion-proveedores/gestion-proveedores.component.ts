import { Component, OnInit } from '@angular/core';
import { ProveedorService, ProveedorTelefono } from '../proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '../../alerta-service.service';


@Component({
  selector: 'app-gestion-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-proveedores.component.html',
  styleUrl: './gestion-proveedores.component.css'
})
export class ProveedoresComponent implements OnInit {
  proveedores: ProveedorTelefono[] = [];

  nuevo: Partial<ProveedorTelefono> = {};

  editarId: number | null = null;
  proveedorEditando: Partial<ProveedorTelefono> = {};

  mostrarModalAgregar = false;

  constructor(private proveedorService: ProveedorService, private alertaService: AlertaService) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
    });
  }

  abrirModalAgregar(): void {
    this.nuevo = {
      siglas_proveedor: '',
      nombre_proveedor: '',
      costo_seg_cel: 0,
      costo_seg_slm: 0,
      costo_seg_ldi: 0
    };
    this.mostrarModalAgregar = true;
  }

  cerrarModalAgregar(): void {
    this.mostrarModalAgregar = false;
    this.nuevo = {};
  }

  validarTextoCampo(valor: string | undefined): boolean {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
    return regex.test(valor || '');
  }

  confirmarAgregar(): void {
    const nuevoProveedor = { ...this.nuevo }; 

    if (!nuevoProveedor.nombre_proveedor?.trim() || !nuevoProveedor.siglas_proveedor?.trim()) {
      this.alertaService.mostrar('Todos los campos son obligatorios.');
      return;
    }

    if (
      this.validarTextoCampo(nuevoProveedor.nombre_proveedor) &&
      this.validarTextoCampo(nuevoProveedor.siglas_proveedor)
    ) {
      this.proveedorService.agregarProveedor(nuevoProveedor as any).subscribe(() => {
        this.cargarProveedores();
        this.cerrarModalAgregar();
      });
    } else {
      this.alertaService.mostrar('Por favor, ingrese solo letras en el nombre y las siglas.');
    }
  }

  editarProveedor(proveedor: ProveedorTelefono): void {
    this.editarId = proveedor.id_proveedor;
    this.proveedorEditando = { ...proveedor };
  }

  cancelarEdicion(): void {
    this.editarId = null;
    this.proveedorEditando = {};
  }

  guardarCambios(id: number): void {
    const editado = { ...this.proveedorEditando };

    if (
      this.validarTextoCampo(editado.nombre_proveedor) &&
      this.validarTextoCampo(editado.siglas_proveedor)
    ) {
      this.proveedorService.actualizarProveedor(id, editado as any).subscribe(() => {
        this.cargarProveedores();
        this.cancelarEdicion();
      });
    } else {
      this.alertaService.mostrar('Por favor, ingrese solo letras en el nombre y las siglas.');
    }
  }

  eliminarProveedor(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe(() => {
        this.cargarProveedores();
      });
    }
  }

  formatCurrency(value: number): string {
    if (value == null) return '';
    const integerValue = Math.floor(value);
    const formattedValue = integerValue.toLocaleString('es-AR');
    return `$ ${formattedValue}`;
  }
}
