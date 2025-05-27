import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProveedorTelefono {
  id_proveedor: number;
  siglas_proveedor: string;
  nombre_proveedor: string;
  costo_seg_cel: number;
  costo_seg_slm: number;
  costo_seg_ldi: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:8000/core/proveedores/';

  constructor(private http: HttpClient) {}

  getProveedores(): Observable<ProveedorTelefono[]> {
    return this.http.get<ProveedorTelefono[]>(this.apiUrl);
  }

  agregarProveedor(proveedor: Omit<ProveedorTelefono, 'id_proveedor'>): Observable<ProveedorTelefono> {
    return this.http.post<ProveedorTelefono>(this.apiUrl, proveedor);
  }

  actualizarProveedor(id: number, proveedor: ProveedorTelefono): Observable<ProveedorTelefono> {
    return this.http.put<ProveedorTelefono>(`${this.apiUrl}${id}/`, proveedor);
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
