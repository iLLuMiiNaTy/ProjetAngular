import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../interface/user-details';
import { BlogDetails } from '../interface/blog-details';
import { AuthService } from '../services/auth.service';
import moment from 'moment';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
  
})
export class LoginComponent {
  isLogged = false;
  blogs: BlogDetails[] = [];
  users: UserDetails[] = [];
  user: any;
/*
  nouveauBlog = {
    id: 100,
    title: '',
    overview: '',
    poster_path: '',
    release_date: '',
    author: '',
    vote_count: 0,
    newUrl: true,
    visibility: '',
    restricted_users: []
  };

  ngOnInit(): void {
    this.authService.userLoggedIn.subscribe(() => {
      this.isLogged = !!this.authService.getUser();
      this.user = this.authService.getUser();
      console.log(this.user);
    });
  }

  constructor(private authService: AuthService) {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  generateNewId(): number {
    const maxId = Math.max(...this.users.map(user => user.id));
    return maxId + 1;
  }
  
  getFullImageUrl(posterPath: String) : String{
    return posterPath;
  }

  ajouterBlog() {
    if (this.nouveauBlog.title && this.nouveauBlog.poster_path && this.nouveauBlog.overview) {
      const dateAujourdHui = new Date();
      const dateFormatee = moment(dateAujourdHui).format('DD/MM/YYYY');
      this.nouveauBlog.release_date = dateFormatee;
      this.blogs.push({...this.nouveauBlog});
      console.log(this.blogs);
      localStorage.setItem('blogs', JSON.stringify(this.blogs));
      this.nouveauBlog = {
        title: '',
        overview: '',
        poster_path: '',
        release_date: '',
        vote_count: 0,
        author: '',
        newUrl: true,
        id: this.generateNewId(),
        visibility: '',
        restricted_users: []
      };
    } else {
      alert('Veuillez compléter tous les champs');
    }
  }

  supprimerBlog(id: number) {
    // Trouver l'index du blog avec l'ID spécifié
    const index = this.blogs.findIndex(blog => blog.id === id);
  
    // Si l'ID est trouvé
    if (index !== -1) {
      // Supprimer le blog à l'index trouvé
      this.blogs.splice(index, 1);
  
      // Mettre à jour le localStorage
      localStorage.setItem('blogs', JSON.stringify(this.blogs));
    } else {
      // Afficher un message d'erreur si l'ID n'est pas trouvé
      console.error(`Blog avec l'ID ${id} non trouvé`);
    }
  }*/
}
