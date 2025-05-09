import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService,) {}

  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const userRole = this.authService.getUserRole(); // Obtener el rol del usuario desde el localStorage

      // Si el rol del usuario no es el adecuado, redirigir a otra página
      if (route.data['roles'] && !route.data['roles'].includes(userRole)) {
        this.router.navigate(['/menu-principal']); // Redirigir a la página principal o alguna página de acceso denegado
        return false;
      }

      return true; // Permitir el acceso si el rol coincide
    }
    
}
