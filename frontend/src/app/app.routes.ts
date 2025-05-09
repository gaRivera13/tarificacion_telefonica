import { Routes } from '@angular/router';
import { HomeComponent } from './profile/home/home.component';
import { LoginComponent } from './login/login.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { GestionUnidadesComponent } from './servicios/gestion-unidades/gestion-unidades.component';
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';
import { GestionFacultadComponent } from './servicios/gestion-facultad/gestion-facultad.component';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'recuperar', component: RecuperarPasswordComponent },
  
  {
    path: 'menu-principal',
    component: MenuPrincipalComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'encargado'] }
  },
  {
    path: 'gestion-unidades',
    component: GestionUnidadesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'gestion-facultad',
    component: GestionFacultadComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'gestion-proveedores',
    component: GestionProveedoresComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'profile/home',
    component: HomeComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'profile',
    redirectTo: 'profile/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
