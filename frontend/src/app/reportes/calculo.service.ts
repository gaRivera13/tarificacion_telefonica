import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CalculoService {

  constructor(private http: HttpClient) {}

  calculoPorUnidad(id_facultad: number, id_unidad: number, nombre_calculo: string): Observable<any> {
    return this.http.post(
      `${environment.coreurl}/core/calculo-reportes/calculo-unidad/`,
      { id_facultad, id_unidad, nombre_calculo }
    );
  }

  calculoPorFacultad(id_facultad: number, nombre_calculo: string): Observable<any> {
    return this.http.post(
      `${environment.coreurl}/core/calculo-reportes/generar-calculo-general/`,
      { id_facultad, nombre_calculo }
    );
  }

  obtenerReportesPorUnidad(facultadId: number, unidadId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.coreurl}/core/reportes/?facultad=${facultadId}&unidad=${unidadId}`
    );
  }

  obtenerReportesPorFacultad(facultadId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.coreurl}/core/reportes/?facultad=${facultadId}`
    );
  }

  descargarReporte(reporteId: number): Observable<Blob> {
    return this.http.get(
      `${environment.coreurl}/core/reportes/${reporteId}/descargar/`,
      { responseType: 'blob' }
    );
  }

  listarReportes(facultadId: string, unidadId: string | null): Observable<any[]> {
    let params: any = { facultad: facultadId };
    if (unidadId) {
      params.unidad = unidadId;
    }
    return this.http.get<any[]>(
      `${environment.coreurl}/core/reportes/`,
      { params }
    );
  }

  eliminarReporte(reporteId: number): Observable<any> {
    return this.http.delete(
      `${environment.coreurl}/core/reporte/${reporteId}/`
    );
  }
}