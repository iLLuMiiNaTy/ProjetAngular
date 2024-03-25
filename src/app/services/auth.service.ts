import { Injectable } from '@angular/core';
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
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userLogged', JSON.stringify(user));
      localStorage.setItem('userToken', 'votre_token'); // Ajoutez cette ligne

    }
  }

  getUser() {
    return this.userSubject.value;
  }

  getUserFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem('userLogged') as string);
    }
    return null;
  }

  clearUser() {
    this.userSubject.next(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('userLogged');
      localStorage.removeItem('userToken'); // Ajoutez cette ligne
    }
  }

  updateUser(user: any): Observable<any> {
    this.userSubject.next(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userLogged', JSON.stringify(user));
    }
    console.log(user);
    return user;
  }

  userLoggedIn() {
    return this.userSubject.asObservable();
    
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('userToken') !== null;

  }

}