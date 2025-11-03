import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

interface Role {
  name: string;
  permissions: string[];
}

@Component({
  selector: 'app-roles',
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
    <h2>Roles</h2>

    <!-- Add button only if admin -->
    <button
      *ngIf="auth.getUser()?.role === 'admin'"
      mat-raised-button color="primary"
      (click)="startAdd()">
      Add Role
    </button>

    <!-- Inline Add/Edit Form -->
    <div *ngIf="editingRole" class="edit-form">
      <mat-form-field class="w-100">
        <input matInput placeholder="Role Name" [(ngModel)]="editingRole.name" />
      </mat-form-field>

      <mat-form-field class="w-100">
        <input matInput
          placeholder="Permissions (comma-separated)"
          [(ngModel)]="permissionsInput" />
      </mat-form-field>

      <button mat-raised-button color="primary" (click)="saveRole()">Save</button>
      <button mat-raised-button (click)="cancelEdit()">Cancel</button>
    </div>

    <table mat-table [dataSource]="roles" class="mat-elevation-z8 dark-table">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Role Name</th>
        <td mat-cell *matCellDef="let role">{{role.name}}</td>
      </ng-container>

      <ng-container matColumnDef="permissions">
        <th mat-header-cell *matHeaderCellDef>Permissions</th>
        <td mat-cell *matCellDef="let role">{{role.permissions.join(', ')}}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let role; let i = index">
          <button mat-icon-button color="primary" *ngIf="auth.getUser()?.role === 'admin'" (click)="startEdit(i)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" *ngIf="auth.getUser()?.role === 'admin'" (click)="deleteRole(i)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="['name', 'permissions', 'actions']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['name', 'permissions', 'actions']"></tr>
    </table>
  `,
  styles: [`
    .dark-table { width: 100%; margin-top: 15px; }
    th, td { padding: 10px; text-align: left; }
    .edit-form { margin: 10px 0; padding: 10px; }
    .w-100 { width: 100%; }
    button { margin-right: 8px; }
  `]
})
export class RolesComponent {
  roles: Role[] = [];
  editingRole: Role | null = null;
  editingIndex: number | null = null;
  permissionsInput = '';

  constructor(public auth: AuthService) {
    this.loadRoles();
  }

  loadRoles() {
    const stored = localStorage.getItem('rbac_roles');
    if (stored) {
      this.roles = JSON.parse(stored);
    } else {
      // default roles if not present
      this.roles = [
        { name: 'Admin', permissions: ['addUser','editUser','deleteUser','addRole','editRole','deleteRole'] },
        { name: 'Manager', permissions: ['addUser','editUser'] },
        { name: 'Employee', permissions: ['addUser'] }
      ];
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('rbac_roles', JSON.stringify(this.roles));
  }

  startAdd() {
    this.editingRole = { name: '', permissions: [] };
    this.permissionsInput = '';
    this.editingIndex = null;
  }

  startEdit(index: number) {
    this.editingRole = { ...this.roles[index] };
    this.permissionsInput = this.editingRole.permissions.join(', ');
    this.editingIndex = index;
  }

  saveRole() {
    if (!this.editingRole) return;
    this.editingRole.permissions = this.permissionsInput
      .split(',')
      .map(p => p.trim())
      .filter(p => !!p);

    if (this.editingIndex !== null) {
      this.roles[this.editingIndex] = this.editingRole;
    } else {
      this.roles.push(this.editingRole);
    }

    this.saveToLocalStorage();
    this.roles = [...this.roles];
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingRole = null;
    this.editingIndex = null;
    this.permissionsInput = '';
  }

  deleteRole(index: number) {
    if (window.confirm('Are you sure you want to delete this role?')) {
      this.roles.splice(index, 1);
      this.saveToLocalStorage();
      this.roles = [...this.roles];
    }
  }
}