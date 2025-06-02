import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CalculoService {
  private baseUrl: string = '/core/calculo-reportes';

  constructor(private http: HttpClient) {}

  calculoPorUnidad(id_facultad: number, id_unidad: number, nombre_calculo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/calculo-unidad/`, {
      id_facultad,
      id_unidad,
      nombre_calculo
    });
  }

  calculoPorFacultad(id_facultad: number, nombre_calculo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/generar-calculo-general/`, {
      id_facultad,
      nombre_calculo
    });
  }

  obtenerReportesPorUnidad(facultadId: number, unidadId: number) {
    return this.http.get<any[]>(`/core/reportes/?facultad=${facultadId}&unidad=${unidadId}`);
  }

  obtenerReportesPorFacultad(facultadId: number) {
    return this.http.get<any[]>(`/core/reportes/?facultad=${facultadId}`);
  }

  descargarReporte(reporteId: number) {
    return this.http.get(`/core/reportes/${reporteId}/descargar/`, {
      responseType: 'blob'
    });
  }
}
