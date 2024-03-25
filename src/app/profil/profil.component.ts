import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../interface/user-details';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  isLogged = false;
  users: UserDetails[] = [];
  user: any;

  // utilisé pour gérer une amitié
  searchTerm: string = '';
  foundUsers: UserDetails[] = [];

  newUser = {
    id: 100,
    nom: '',
    prenom: '',
    password: '',
    email: '',
    phone_number: '',
    id_blog: 100,
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
        id_blog: this.generateNewId(),
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
        this.authService.updateUser(this.newUser)
        this.users[userIndex] = this.newUser;
        localStorage.setItem('users', JSON.stringify(this.users));
        this.authService.setUser(this.newUser);
        }
      }  
      this.newUser = {
        id: this.generateNewId(),
        nom: '',
        prenom: '',
        password: '',
        email: '',
        phone_number: '',
        id_blog: this.generateNewId(),
        friends: []
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
        this.reloadPage();
      } else {
        alert('Email ou mot de passe incorrect');
      } 
    }
  }
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
    const passwordToggleIcon = document.getElementById('passwordToggleIcon');
    if (passwordInput && passwordToggleIcon) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordToggleIcon.classList.remove('fa-eye');
            passwordToggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = "password";
            passwordToggleIcon.classList.remove('fa-eye-slash');
            passwordToggleIcon.classList.add('fa-eye');
        }
    }
}
  handleLogout() {
    this.authService.clearUser();
    this.isLogged = false;
    // Navigate to home page
    this.router.navigate(['/accueil']);
  }

  getFullImageUrl(posterPath: String) : String{
    return posterPath;
  }

  searchUser() {
    if (!this.searchTerm.trim()) {
      this.foundUsers = [];
      return;
    }
    
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
    alert('Utilisateur ajouté avec succès');
    // Supprimer l'utilisateur de la liste foundUsers
    const index = this.foundUsers.indexOf(user);
    if (index > -1) {
        this.foundUsers.splice(index, 1);
    }
  } else {
    alert('Cet utilisateur est déjà votre ami');
  }
  }
}