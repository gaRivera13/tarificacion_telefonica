import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface ProveedorTelefono {
  id_proveedor: number;
  siglas_proveedor: string;
  nombre_proveedor: string;
  costo_seg_cel: number;
  costo_seg_sim: number;
  costo_seg_idi: number;
}

export interface Facultad {
  id_facultad: number;
  nombre_facultad: string;
  siglas_facultad: string;
  id_proveedor: number;        
  proveedor_detalle: ProveedorTelefono; 
}

export interface Departamento {
  id_unidad: number;
  nombre_depto: string;
  siglas_depto: string;
  id_facultad: number;              
  facultad_detalle: Facultad;      
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private deptoBaseUrl: string = '/core/departamentos';
  private facuBaseUrl: string = '/core/facultades';  
  private provBaseUrl: string = '/core/proveedores'; 

  constructor(private http: HttpClient) {}

  // Departamentos
  obtenerDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${environment.coreurl}${this.deptoBaseUrl}/`);
  }

  obtenerProveedores(): Observable<ProveedorTelefono[]> {
  return this.http.get<ProveedorTelefono[]>(`${environment.coreurl}${this.provBaseUrl}/`);
  }

  agregarDepartamento(depto: Partial<Departamento>): Observable<Departamento> {
    return this.http.post<Departamento>(`${environment.coreurl}${this.deptoBaseUrl}/`, depto);
  }

  editarDepartamento(id: number, depto: Partial<Departamento>): Observable<Departamento> {
    return this.http.put<Departamento>(`${environment.coreurl}${this.deptoBaseUrl}/${id}/`, depto);
  }

  eliminarDepartamento(id: number): Observable<any> {
    return this.http.delete(`${environment.coreurl}${this.deptoBaseUrl}/${id}/`);
  }

  // Facultades
  obtenerFacultades(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(`${environment.coreurl}${this.facuBaseUrl}/`);
  }

  agregarFacultad(facultad: Partial<Facultad>): Observable<Facultad> {
    return this.http.post<Facultad>(`${environment.coreurl}${this.facuBaseUrl}/`, facultad);
  }

  editarFacultad(id: number, facultad: Partial<Facultad>): Observable<Facultad> {
    return this.http.put<Facultad>(`${environment.coreurl}${this.facuBaseUrl}/${id}/`, facultad);
  }

  eliminarFacultad(id: number): Observable<any> {
    return this.http.delete(`${environment.coreurl}${this.facuBaseUrl}/${id}/`);
  }

  obtenerDepartamentosPorFacultad(idFacultad: number): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${environment.coreurl}${this.deptoBaseUrl}/?id_facultad=${idFacultad}`);
  }

}
