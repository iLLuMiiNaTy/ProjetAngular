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
  newId: number = 100

  // utilisé pour gérer une amitié
  searchTerm: string = '';
  foundUsers: UserDetails[] = [];

  newUser = {
    id: this.newId,
    nom: '',
    prenom: '',
    password: '',
    email: '',
    phone_number: '',
    id_blog: this.newId,
    friends: []
  };

  ngOnInit(): void {
    this.authService.userLoggedIn().subscribe(() => {
      this.isLogged = !!this.authService.getUser();
      this.user = this.authService.getUser();
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
        this.users.push(this.newUser);
        this.newId = this.users.length + 1; // Générer un nouvel ID
        this.newUser.id = this.newId;
        this.newUser.id_blog = this.newId;
        localStorage.setItem('users', JSON.stringify(this.users));
      } else {
        alert('Cet utilisateur existe déjà');
      }
      this.newUser = {
        id: this.newId,
        nom: '',
        prenom: '',
        password: '',
        email: '',
        phone_number: '',
        id_blog: this.newId,
        friends: []
      };
    } else {
      alert('Veuillez compléter tous les champs');
    }
  }

  updateUser() {
    if (this.newUser.nom && this.newUser.prenom && this.newUser.phone_number && this.newUser.email && this.newUser.password) {
      const userIndex = this.users.findIndex(user => user.email === this.newUser.email);
      if (userIndex !== -1) {
        this.newId = this.users.length + 1; // Générer un nouvel ID
        this.newUser.id = this.newId;
        this.newUser.id_blog = this.newId;
        this.authService.updateUser(this.newUser)
        this.users[userIndex] = this.newUser;
        localStorage.setItem('users', JSON.stringify(this.users));
        this.authService.setUser(this.newUser);
        }
      }  
      this.newUser = {
        id: this.newId,
        nom: '',
        prenom: '',
        password: '',
        email: '',
        phone_number: '',
        id_blog: this.newId,
        friends: []
    };
    //this.reloadPage();
  }

  handleLogin() {
    if (this.newUser.email && this.newUser.password) {
    const user = this.users.find(user => user.email === this.newUser.email && user.password === this.newUser.password);
      if (user) {
        alert('Connexion réussie');
        this.authService.setUser(user);
        this.isLogged = true;
        this.reloadPage();
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

  
  searchUser() {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
  
    this.foundUsers = this.users.filter(user => 
      (user.nom.toLowerCase().includes(lowerCaseSearchTerm) || user.email.toLowerCase().includes(lowerCaseSearchTerm)) &&
      !this.user.friends.some((friend: { id: number; }) => friend.id === user.id)
    );
  }

  addFriend(user: UserDetails) {
    if (!this.user.friends) {
      this.user.friends = [];
    }

    // Vérifiez si l'utilisateur est déjà un ami
  if (!this.user.friends.some((friend: { id: number; }) => friend.id === user.id)) {
    this.user.friends.push(user);
    // Mettre à jour l'utilisateur dans le localStorage
    const userIndex = this.users.findIndex(u => u.id === this.user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.user;
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  } else {
    alert('Cet utilisateur est déjà votre ami');
  }
  }
}
