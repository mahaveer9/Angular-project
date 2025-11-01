import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  template: `
    <h2>Roles</h2>
    <table mat-table [dataSource]="roles" class="mat-elevation-z8 dark-table">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Role Name</th>
        <td mat-cell *matCellDef="let role">{{role.name}}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let role">
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="['name','actions']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['name','actions']"></tr>
    </table>
  `,
  styles: [`
    .dark-table {
      width: 100%;
    }
    th, td { padding: 10px; }
  `]
})
export class RolesComponent {
  roles = [{name: 'admin'}, {name: 'manager'}, {name: 'employee'}];
  delete(role:any) { window.alert('Deleted '+role.name); }
}
