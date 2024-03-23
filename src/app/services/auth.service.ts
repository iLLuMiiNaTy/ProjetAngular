import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;

  constructor() {
    this.userSubject = new BehaviorSubject(this.getUserFromLocalStorage());
  }

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('userLogged', JSON.stringify(user));
  }

  getUser() {
    return this.userSubject.value;
  }

  getUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem('userLogged') as string);
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('userLogged');
  }

  updateUser(user: any): Observable<any> {
    this.userSubject.next(user);
    localStorage.setItem('userLogged', JSON.stringify(user));
    console.log(user);
    return user;
  }

  userLoggedIn() {
    return this.userSubject.asObservable();
  }
}
