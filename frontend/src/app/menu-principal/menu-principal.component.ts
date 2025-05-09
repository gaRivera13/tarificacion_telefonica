import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { OnInit } from '@angular/core';
import { MenuComponent } from "../compartido/menu/menu.component";

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})

export class MenuPrincipalComponent implements OnInit {
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
