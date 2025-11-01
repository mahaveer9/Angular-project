import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.auth.getUser();
    const allowedRole = route.data['role'];

    if (!user) {
      window.location.href = '/login';
      return false;
    }

    if (allowedRole && user.role !== allowedRole) {
      alert('Access denied!');
      window.location.href = '/dashboard';
      return false;
    }

    return true;
  }
}
