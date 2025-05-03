import { Routes } from '@angular/router';
import { HomeComponent } from './profile/home/home.component';

export const routes: Routes = [
    {path:"profile/home",component:HomeComponent},
    {path:"profile",redirectTo:"profile/home", pathMatch:"full"},
    {path:"",redirectTo:"profile/home", pathMatch:"full"}
];
