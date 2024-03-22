import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  userLoggedIn = new EventEmitter<void>();

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

  updateUser(user: any): Observable<any> {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    console.log(user);
    return user;
  }
}
