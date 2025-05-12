import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';  // Asegúrate de importar RouterModule
import { routes } from './app.routes';  // Si estás usando un archivo de rutas
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './compartido/menu/menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,  // Asegúrate de que ReactiveFormsModule esté aquí
    HttpClientModule,
    LoginComponent,
    MenuComponent,
    AppComponent,
    BrowserModule,
    FormsModule
  ],
  providers: [],
  // Removed bootstrap array as AppComponent is a standalone component
})
export class AppModule { }
