import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';
  loginForm!: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.login(email, password)
        .pipe(
          tap(response => {
            if (response.success) {
              this.successMessage = 'Login exitoso. ¡Bienvenido!';
              // Aquí podrías redirigir o guardar token, etc.
            } else {
              this.errorMessage = response.message || 'Credenciales incorrectas';
            }
          })
        )
        .subscribe({
          error: () => {
            this.errorMessage = 'Error en el servidor. Intente nuevamente más tarde.';
          }
        });
    } else {
      this.errorMessage = 'Por favor ingrese un correo y contraseña válidos.';
    }
  }
}
