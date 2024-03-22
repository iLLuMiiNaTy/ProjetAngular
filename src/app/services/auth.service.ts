import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor() { }

  setUser(user: any) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('user') as string);
    }
    return this.user;
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }
}