import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      // No ha iniciado sesión, redirigir a login
      this.router.navigate(['/']);
      return false;
    }

    const userRole = this.authService.getUserRole();

    if (route.data['roles'] && !route.data['roles'].includes(userRole)) {
      // Tiene sesión pero no tiene el rol adecuado
      this.router.navigate(['/menu-principal']);
      return false;
    }

    return true; // Usuario autenticado y con el rol adecuado
  }
}
