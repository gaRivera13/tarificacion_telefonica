import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/core/login/';
  private userData: any = null;

  private fakeUsers = [
    { id: 1, correo: 'admin@example.com', password: '123456', nombre: 'Administrador', rol: 'admin' },
    { id: 2, correo: 'encargado@example.com', password: '123456', nombre: 'Encargado', rol: 'encargado' }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { correo, password }).pipe(
      tap(user => {
        if (!user || !user.rol || !user.correo) {
          throw new Error('Respuesta del servidor inválida');
        }
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(err => {
        const userFake = this.fakeUsers.find(u => u.correo === correo && u.password === password);
        if (userFake) {
          this.userData = userFake;
          localStorage.setItem('user', JSON.stringify(userFake));
          return of(userFake);
        } else {
          return throwError(() => new Error('Credenciales inválidas'));
        }
      })
    );
  }


  logout(): void {
    this.userData = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getUser(): any {
    if (!this.userData) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.userData = JSON.parse(stored);
      }
    }
    return this.userData;
  }

  getUserRole(): string | null {
    return this.getUser()?.rol || null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
