import { Routes } from '@angular/router';
import { HomeComponent } from './profile/home/home.component';
import { LoginComponent } from './login/login.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { GestionUnidadesComponent } from './servicios/gestion-unidades/gestion-unidades.component';
import { ProveedoresComponent } from './proveedores/gestion-proveedores/gestion-proveedores.component';
import { GestionFacultadComponent } from './servicios/gestion-facultad/gestion-facultad.component';
import { GestionAnexosComponent } from './servicios/gestion-anexos/gestion-anexos.component';
import { CalculoReportesComponent } from './reportes/calculo-reportes/calculo-reportes.component';
import { RoleGuard } from './guards/role.guard';
import { ConsultarReportesComponent } from './reportes/consultar-reportes/consultar-reportes.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'recuperar', component: RecuperarPasswordComponent },

  {
    path: 'menu-principal',
    component: MenuPrincipalComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'encargado'] },
    children: [
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
        component: ProveedoresComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'gestion-anexos',
        component: GestionAnexosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'calculo-reportes',
        component: CalculoReportesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'consulta-reportes',
        component: ConsultarReportesComponent, // Cambia esto si tienes un componente específico para consulta
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'encargado'] }
      },
      {
        path: 'gestion-usuarios',
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      { path: '', redirectTo: 'gestion-usuarios', pathMatch: 'full' }
    ]
  },

  // Redirección por defecto
  { path: '**', redirectTo: '' }
];
