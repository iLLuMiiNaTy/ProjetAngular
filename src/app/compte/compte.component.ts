import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../interface/user-details';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css'
})
export class CompteComponent {
  isLogged = false;
  users: UserDetails[] = [];
  user: any;

  newUser = {
    id: 100,
    nom: '',
    prenom: '',
    password: '',
    email: '',
    phone_number: '',
    isLogged: false
  };

  ngOnInit(): void {
    this.authService.userLoggedIn.subscribe(() => {
      this.isLogged = !!this.authService.getUser();
      this.user = this.authService.getUser();
      console.log(this.user);
    });
  }

  constructor(private authService: AuthService, private router: Router) {
    //localStorage.clear();
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/compte']);
    });
  }

  ajouterUser() {
    if (this.newUser.nom && this.newUser.prenom && this.newUser.phone_number && this.newUser.email && this.newUser.password) {
      if (!this.users.some(user => user.email === this.newUser.email)) {
        this.newUser.isLogged = true;
        this.users.push(this.newUser);
        console.log(this.users);
        localStorage.setItem('users', JSON.stringify(this.users));
      } else {
        alert('Cet utilisateur existe déjà');
      }
      this.newUser = {
        id: this.generateNewId(),
        nom: '',
        prenom: '',
        password: '',
        email: '',
        phone_number: '',
        isLogged: false
      };
    } else {
      alert('Veuillez compléter tous les champs');
    }
  }

  updateUser() {
    if (this.newUser.nom && this.newUser.prenom && this.newUser.phone_number && this.newUser.email && this.newUser.password) {
      const userIndex = this.users.findIndex(user => user.email === this.newUser.email);
      if (userIndex !== -1) {
        this.authService.updateUser(this.newUser)
        this.newUser.isLogged = true;
        this.users[userIndex] = this.newUser;
        localStorage.setItem('users', JSON.stringify(this.users));
        this.authService.setUser(this.newUser);
        this.authService.userLoggedIn.emit();
        }
      }  
      this.newUser = {
        id: this.generateNewId(),
        nom: '',
        prenom: '',
        password: '',
        email: '',
        phone_number: '',
        isLogged: false
    };
    //this.reloadPage();
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
        this.authService.setUser(user);
        this.isLogged = true;
        this.authService.userLoggedIn.emit();
      } else {
        alert('Email ou mot de passe incorrect');
      } 
    }
  }

  handleLogout() {
    this.authService.clearUser();
    this.isLogged = false;
  }

  getFullImageUrl(posterPath: String) : String{
    return posterPath;
  }
}
