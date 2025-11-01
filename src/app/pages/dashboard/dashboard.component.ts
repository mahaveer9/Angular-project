import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2>Welcome to Dashboard</h2>
  `
})
export class DashboardComponent {
  constructor(public auth: AuthService) {} // inject auth
}
