import { Component } from '@angular/core'; 
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, RouterOutlet],
  template: `
   <mat-toolbar color="primary" class="dark-toolbar">
  <span>RBAC Web App</span>
  <span class="spacer"></span>
  <button mat-button routerLink="/dashboard">Dashboard</button>
  <button mat-button *ngIf="auth.getUser()?.role==='admin'" routerLink="/users">Users</button>
  <button mat-button *ngIf="auth.getUser()?.role==='manager'" routerLink="/users">Users</button>
  <button mat-button *ngIf="auth.getUser()?.role==='admin'" routerLink="/roles">Roles</button>
  <button mat-button *ngIf="auth.isLoggedIn()" (click)="logout()">Logout</button>
</mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  logout() {
    localStorage.removeItem('rbac_user');
    window.location.href = '/login';
  }
}
