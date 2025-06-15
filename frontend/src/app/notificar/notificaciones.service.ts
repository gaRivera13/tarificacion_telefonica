import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private baseUrl: string = '/core/notificaciones';

  constructor(private http: HttpClient) {}

  obtenerNotificaciones(username: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.baseUrl}/${username}/`);
  }

  marcarComoLeido(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/marcar/${id}/`, {});
  }
}

