import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private testUser = {
    email: 'hil.torres@duocuc.cl',
    password: '1234'
  };

  login(email: string, password: string): Observable<{success: boolean, message?: string, token?: string}> {
    if(email === this.testUser.email && password === this.testUser.password) {
      return of({ success: true, token: 'fake-jwt-token' }).pipe(delay(1000));
    } else {
      return of({ success: false, message: 'Correo o contraseña incorrectos' }).pipe(delay(1000));
    }
  }
}
