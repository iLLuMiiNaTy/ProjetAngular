import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../interface/user-details';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
  
})
export class LoginComponent {
  isLoggedIn = false;
  users: UserDetails[] = [];

  newUser = {
    id: 100,
    nom: '',
    prenom: '',
    password: '',
    email: '',
    phone_number: '',
    subscription: false
  };

  ngOnInit(): void {}

  ajouterUser() {
    if (this.newUser.nom && this.newUser.prenom && this.newUser.phone_number && this.newUser.email && this.newUser.password) {
      this.newUser.subscription = true;
      this.users.push(this.newUser);
      console.log(this.users);
      localStorage.setItem('users', JSON.stringify(this.users));
      this.newUser = {
        id: this.generateNewId(),
        nom: '',
        prenom: '',
        password: '',
        email: '',
        phone_number: '',
        subscription: false
      };
    } else {
      alert('Veuillez compléter tous les champs');
    }
  }

  generateNewId(): number {
    const maxId = Math.max(...this.users.map(user => user.id));
    return maxId + 1;
  }

  handleLogin() {
    if (this.newUser.email && this.newUser.password) {
    const user = this.users.find(user => user.email === this.newUser.email && user.password === this.newUser.password);
    if (user) {
      alert('Connexion réussie');
      this.isLoggedIn = true;
    } else {
      alert('Email ou mot de passe incorrect');
    } 
}
}
}
