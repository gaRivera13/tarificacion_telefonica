import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { OnInit } from '@angular/core';
import { NotificacionesService, Notificacion } from '../notificar/notificaciones.service';


@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})

export class MenuPrincipalComponent implements OnInit {

  rol: string | null = '';
  showLogoutMenu = false;
  sidebarVisible = false;

  notificaciones: Notificacion[] = [];
  nuevasNotificaciones: Notificacion[] = [];
  newNotifications = 0;
  showModal: boolean = false;

  constructor(
    private authService: AuthService, 
    private notificacionesService: NotificacionesService,
    private router: Router,
  
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getUserRole();
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
  const session = localStorage.getItem('user');
  const correo = session ? JSON.parse(session).correo : null;
  if (!correo) {
    console.error('No se pudo obtener el correo de usuario');
    return;
  }

  this.notificacionesService.obtenerNotificaciones(correo).subscribe(
    (data) => {
      this.notificaciones = data;
      this.nuevasNotificaciones = data.filter(n => !n.leido);
      this.newNotifications = this.nuevasNotificaciones.length; 
    },
    (error) => {
      console.error('Error al obtener notificaciones:', error);
    }
  );
}

  marcarComoLeida(notificacion: Notificacion): void {
  this.notificacionesService.marcarComoLeido(notificacion.id).subscribe(
    () => {
      notificacion.leido = true;
      this.nuevasNotificaciones = this.notificaciones.filter(n => !n.leido);
      this.newNotifications = this.nuevasNotificaciones.length;
    },
    (error) => {
      console.error('Error al marcar notificación como leída:', error);
    }
  );
}

toggleModal(): void {
  this.showModal = !this.showModal;
  if (this.showModal) {
    this.newNotifications = 0;
  }
}

  toggleLogoutMenu(): void {
    this.showLogoutMenu = !this.showLogoutMenu; 
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
