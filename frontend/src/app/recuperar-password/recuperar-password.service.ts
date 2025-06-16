import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecuperarPasswordService {
  private apiUrl = 'http://localhost:8000/core/recuperar-password-confirm/';

  constructor(private http: HttpClient) {}

  confirmar(email: string, username: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, username });
  }
}