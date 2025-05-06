import { Routes } from '@angular/router';
import { HomeComponent } from './profile/home/home.component';
import { LoginComponent } from './login/login.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'recuperar', component: RecuperarPasswordComponent },
    { path: 'menu-principal', component: MenuPrincipalComponent },
    {path:"profile/home",component:HomeComponent},
    {path:"profile",redirectTo:"profile/home", pathMatch:"full"},
    {path:"",redirectTo:"profile/home", pathMatch:"full"}
];
