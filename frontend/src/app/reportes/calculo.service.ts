
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculoService {

  private baseUrl: string= '/core/calculo';

  constructor(private http: HttpClient) { }

  getAnexos(facultadId?: number, unidadId?: number): Observable<any[]> {
    let url = `${this.baseUrl}/anexos/`;
    if (facultadId) {
      url += `?facultad=${facultadId}`;
    }
    if (unidadId) {
      url += `&unidad=${unidadId}`;
    }
    return this.http.get<any[]>(url);
  }

  // Obtener los proveedores
  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/proveedores/`);
  }

  // Obtener los registros de llamadas según el anexo
  getRegistrosLlamadas(anexoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/registro-llamadas/?anexo=${anexoId}`);
  }

  // Calcular el reporte
  calcularReporte(facultadId: number, unidadId: number, proveedorId: number, esFacultad: boolean): Observable<any> {
    const url = `${this.baseUrl}/calculo-reporte/`;
    const body = { facultadId, unidadId, proveedorId, esFacultad };

    return this.http.post<any>(url, body);
  }
}
