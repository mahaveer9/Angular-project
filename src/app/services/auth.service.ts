import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private generateUniqueId() {
    // Simple unique ID generator using timestamp + random number
    return 'user_' + new Date().getTime() + '_' + Math.floor(Math.random() * 10000);
  }

  login(username: string, password: string) {
    let user;

    // Check localStorage users first
    const storedUsers = JSON.parse(localStorage.getItem('rbac_users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.name === username && u.password === password);
    console.log("Found User;",foundUser)
    if (foundUser) {
      // If user is Admin
      if (foundUser.role === 'admin') {
        user = {
          unique_id: foundUser.unique_id || this.generateUniqueId(),
          name: foundUser.name,
          role: 'admin',
          permissions: ['addUser','editUser','deleteUser','addRole','editRole','deleteRole']
        };
      } else {
        // Non-admin user permissions
        let permissions: string[] = [];
        switch (foundUser.role) {
          case 'manager':
            permissions = ['addUser','editUser'];
            break;
          case 'employee':
            permissions = ['addUser'];
            break;
          default:
            permissions = [];
        }
        user = {
          unique_id: foundUser.unique_id || this.generateUniqueId(),
          name: foundUser.name,
          role: foundUser.role,
          permissions
        };
      }
    } else if (username === 'admin' && password === 'admin') {
      // Hardcoded default Admin
      user = {
        unique_id: this.generateUniqueId(),
        name: 'admin',
        role: 'admin',
        permissions: ['addUser','editUser','deleteUser','addRole','editRole','deleteRole']
      };
    } else {
      // Invalid login
      window.alert("Invalid credentials");
      return null;
    }

    // Update localStorage user record with unique_id
    const updatedUsers = storedUsers.filter((u: any) => u.name !== username);
    updatedUsers.push(user);
    localStorage.setItem('rbac_users', JSON.stringify(updatedUsers));

    // Set current logged-in user
    localStorage.setItem('rbac_user', JSON.stringify(user));

    return user;
  }

  logout() {
    localStorage.removeItem('rbac_user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('rbac_user');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('rbac_user')!);
  }

  hasFeature(feature: string) {
    const user = this.getUser();
    return user?.permissions?.includes(feature);
  }
}
