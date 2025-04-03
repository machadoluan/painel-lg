import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticado()) {
      this.router.navigate(['/dashboard']); // Redireciona se já autenticado
      return false;
    }
    return true; // Permite acesso se não autenticado
  }
}
