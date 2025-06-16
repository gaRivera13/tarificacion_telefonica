import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecuperarPasswordService } from './recuperar-password.service';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';


@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
  providers: [RecuperarPasswordService]
})
export class RecuperarPasswordComponent {
  paso: number = 1;
  correoForm: FormGroup;
  usuarioForm: FormGroup;
  errorMessage: string = '';
  emailIngresado: string = '';
  passwordMostrada: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recuperarService: RecuperarPasswordService
  ) {
    this.correoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required]]
    });
  }

  enviarCorreo() {
    if (this.correoForm.invalid) return;
    this.errorMessage = '';
    this.emailIngresado = this.correoForm.value.email;
    this.paso = 2;
  }

  enviarUsuario() {
    if (this.usuarioForm.invalid) return;
    this.errorMessage = '';
    const username = this.usuarioForm.value.username;
    this.recuperarService.confirmar(this.emailIngresado, username).subscribe({
      next: (resp) => {
        this.passwordMostrada = resp.password;
        this.paso = 3;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Datos incorrectos.';
      }
    });
  }


}