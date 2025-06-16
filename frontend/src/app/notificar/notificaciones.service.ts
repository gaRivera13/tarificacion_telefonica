import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Notificacion {
  id: number;
  mensaje: string;
  leido: boolean;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private baseUrl: string = `${environment.coreurl}/core/notificaciones`;

  constructor(private http: HttpClient) {}

  obtenerNotificaciones(correo: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.baseUrl}/${correo}/`);
  }

  marcarComoLeido(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/marcar/${id}/`, {});
  }
}

