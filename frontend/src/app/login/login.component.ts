import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      if (this.loginForm.get('email')?.hasError('required')) {
        this.errorMessage = 'El correo es requerido.';
      }
      if (this.loginForm.get('password')?.hasError('required')) {
        this.errorMessage = 'La contraseña es requerida.';
      }
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        if (user?.rol === 'admin' || user?.rol === 'encargado') {
          this.router.navigate(['/menu-principal']);
        } else {
          this.errorMessage = 'Rol no reconocido.';
        }
      },
      error: () => {
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    });
  }



  irARecuperar() {
    this.router.navigate(['/recuperar']);
  }

}
