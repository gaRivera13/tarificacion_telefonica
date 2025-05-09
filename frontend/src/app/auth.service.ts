import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/login/'; // Asegúrate de que sea tu URL real
  private userData: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, password: string): Observable<any> {
    const fakeUsers = [
      {
        nombre: 'Admin',
        correo: 'admin@example.com',
        rol: 'admin',
        username: 'adminuser'
      },
      {
        nombre: 'Encargado',
        correo: 'encargado@example.com',
        rol: 'encargado',
        username: 'encargado'
      }
    ];

    const user = fakeUsers.find(u => u.correo === correo);

    if (user && password === '123456') {
      this.userData = user;
      localStorage.setItem('user', JSON.stringify(user));
      return of(user); // observable simulado
    } else {
      return of(null);
    }
  }

  // LOGIN PRINCIPAL, LO OTRO ES DE PRUEBA
/*
  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { correo, password }).pipe(
      tap(user => {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(user));  // Guardamos el usuario localmente
      })
    );
  }
*/
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
