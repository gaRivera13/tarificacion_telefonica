import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertaService } from './alerta-service.service';
import { CommonModule } from '@angular/common'; // <-- IMPORTA ESTO


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  alertaGlobalVisible = false;
  alertaGlobalMensaje = '';

  constructor(private alertaService: AlertaService) {
    this.alertaService.alerta$.subscribe(msg => {
      this.alertaGlobalMensaje = msg;
      this.alertaGlobalVisible = true;
      setTimeout(() => this.alertaGlobalVisible = false, 4000);
    });
  }

  cerrarAlertaGlobal() {
    this.alertaGlobalVisible = false;
  }
}
