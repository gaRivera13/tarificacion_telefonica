import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AnexoService {

  private baseUrl: string = '/core/anexos';

  constructor(private http: HttpClient) { }

  getAnexos(): Observable<any> {
    return this.http.get(`${environment.coreurl}${this.baseUrl}/`);
  }

  subirAnexo(formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/`, formData);
}

  deleteAnexo(id: number): Observable<any> {
    return this.http.delete(`${environment.coreurl}${this.baseUrl}/${id}/`);
  }

  buscarAnexosPorUnidad(unidadBusqueda: string): Observable<any> {
  const url = `${this.baseUrl}?unidad=${unidadBusqueda}`;
  return this.http.get(url);
}

actualizarAnexo(id: number, formData: FormData): Observable<any> {
  return this.http.put(`${environment.coreurl}${this.baseUrl}/${id}/`, formData);
}
}