import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

interface User {
  name: string;
  role: string;
  password: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2>Users</h2>
    <button mat-raised-button color="primary" (click)="startAdd()">Add User</button>

    <!-- Inline Add/Edit Form -->
    <div *ngIf="editingUser" class="edit-form">
      <mat-form-field class="w-100">
        <input matInput placeholder="Name" [(ngModel)]="editingUser.name" />
      </mat-form-field>
      <mat-form-field class="w-100">
        <input matInput placeholder="Role" [(ngModel)]="editingUser.role" />
      </mat-form-field>
      <mat-form-field class="w-100">
        <input matInput placeholder="Password" type="password" [(ngModel)]="editingUser.password" />
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="saveUser()">Save</button>
      <button mat-raised-button (click)="cancelEdit()">Cancel</button>
    </div>

    <table mat-table [dataSource]="users" class="mat-elevation-z8 dark-table">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let user">{{user.name}}</td>
      </ng-container>

      <ng-container matColumnDef="role">
        <th mat-header-cell *matHeaderCellDef>Role</th>
        <td mat-cell *matCellDef="let user">{{user.role}}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let user; let i = index">
          <button mat-icon-button color="primary" (click)="startEdit(i)">
            <mat-icon>edit</mat-icon>
          </button>
          <button *ngIf="auth.getUser()?.role === 'admin'" mat-icon-button color="warn" (click)="deleteUser(i)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="['name','role','actions']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['name','role','actions']"></tr>
    </table>
  `,
  styles: [`
    .dark-table { width: 100%; margin-top: 15px; }
    th, td { padding: 10px; text-align: left; }
    .w-100 { width: 100%; }
    .edit-form { margin: 10px 0; padding: 10px; }
    button { margin-right: 8px; }
  `]
})
export class UsersComponent {
  users: User[] = [];
  editingUser: User | null = null;
  editingIndex: number | null = null;

  constructor(public auth: AuthService) {
    this.loadUsers();
  }

  loadUsers() {
    const stored = localStorage.getItem('rbac_users');
    this.users = stored ? JSON.parse(stored) : [];
  }

  saveToLocalStorage() {
    localStorage.setItem('rbac_users', JSON.stringify(this.users));
  }

  startAdd() {
    this.editingUser = { name: '', role: '', password: '' };
    this.editingIndex = null;
  }

  startEdit(index: number) {
    this.editingUser = { ...this.users[index] };
    this.editingIndex = index;
  }

  saveUser() {
    if (!this.editingUser) return;

    if (this.editingIndex !== null) {
      this.users[this.editingIndex] = this.editingUser;
    } else {
      this.users.push(this.editingUser);
    }

    // Update localStorage
    this.saveToLocalStorage();

    // Reassign array so mat-table detects changes
    this.users = [...this.users];

    this.cancelEdit();
  }

  cancelEdit() {
    this.editingUser = null;
    this.editingIndex = null;
  }

  deleteUser(index: number) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      this.users.splice(index, 1);

      // Update localStorage
      this.saveToLocalStorage();

      // Reassign array so mat-table detects changes
      this.users = [...this.users];
    }
  }
}
