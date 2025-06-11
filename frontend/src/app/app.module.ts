import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; 
import { routes } from './app.routes'; 
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,  
    HttpClientModule,
    LoginComponent,
    AppComponent,
    BrowserModule,
    FormsModule
  ],
  providers: [],

})
export class AppModule { }
