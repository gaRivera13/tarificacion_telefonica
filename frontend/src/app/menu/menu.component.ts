import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
rol: string | null = '';
  showLogoutMenu = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Obtener el rol del usuario desde el servicio de autenticación
    this.rol = this.authService.getUserRole();
  }

  toggleLogoutMenu(): void {
    this.showLogoutMenu = !this.showLogoutMenu; // Alterna la visibilidad
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
  }
}
