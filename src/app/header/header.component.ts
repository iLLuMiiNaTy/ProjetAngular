import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserDetails } from '../interface/user-details';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  users: UserDetails[] = [];
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    if (typeof localStorage !== 'undefined') {
      const storedUsers = localStorage.getItem('users');
      console.log(this.isLogged);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
    }
  }

  get isLogged() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.clearUser();
    this.router.navigate(['/compte']);
  }
}