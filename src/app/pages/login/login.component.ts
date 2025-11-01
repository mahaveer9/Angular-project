import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <mat-form-field class="w-100">
        <input matInput placeholder="Username" [(ngModel)]="username">
      </mat-form-field>
      <mat-form-field class="w-100">
        <input matInput type="password" placeholder="Password" [(ngModel)]="password">
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="login()">Login</button>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 80px auto;
      padding: 20px;
      background: #2c2c2c;
      color: white;
      border-radius: 8px;
    }
    .w-100 { width: 100%; }
    button { margin-top: 10px; width: 100%; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.username, this.password);
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
