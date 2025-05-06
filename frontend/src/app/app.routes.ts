import { Routes } from '@angular/router';
import { HomeComponent } from './profile/home/home.component';
import { LoginComponent } from './login/login.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { GestionUnidadesComponent } from './gestion-unidades/gestion-unidades.component';
import { GestionProveedoresComponent } from './gestion-proveedores/gestion-proveedores.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'recuperar', component: RecuperarPasswordComponent },
    { path: 'menu-principal', component: MenuPrincipalComponent },
    { path: 'gestion-unidades', component: GestionUnidadesComponent},
    { path: 'gestion-proveedores', component: GestionProveedoresComponent},
    {path:"profile/home",component:HomeComponent},
    {path:"profile",redirectTo:"profile/home", pathMatch:"full"},
];
