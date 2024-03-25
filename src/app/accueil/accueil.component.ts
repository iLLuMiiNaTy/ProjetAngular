import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { BlogService } from '../services/blog.service';
import { BlogDetails } from '../interface/blog-details';
import { UserDetails } from '../interface/user-details';
import { CommentDetails } from '../interface/comment-details';
import { AuthService } from '../services/auth.service';
import moment from 'moment';

const imgUrl = environment.imgUrl

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  isLogged = false;
  private blogService = inject(BlogService);
  blogs: BlogDetails[] = [];
  users: UserDetails[] = [];
  user: any;

  selectedBlog: BlogDetails | null = null; // Variable pour stocker le blog sélectionné

    isModalOpen = false; // Variable pour indiquer si la fenêtre modale est ouverte
 // Méthode pour ouvrir la fenêtre modale avec les détails du blog sélectionné
 openModal(blog: BlogDetails) {
  this.selectedBlog = blog;
  // Afficher la fenêtre modale
  document.getElementById('blog-details-modal')!.classList.remove('hidden');
}

// Méthode pour fermer la fenêtre modale// Méthode pour fermer la fenêtre modale
closeModal() {
  this.selectedBlog = null;
  // Cacher la fenêtre modale
  document.getElementById('blog-details-modal')!.classList.add('hidden');
}

  ngOnInit(): void {
    this.loadMovies();
    this.authService.userLoggedIn().subscribe(() => {
      this.isLogged = !!this.authService.getUser();
      this.user = this.authService.getUser();
    });
  }

  constructor(private authService: AuthService) {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
    console.log('Users', this.users);
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      this.blogs = JSON.parse(storedBlogs);
    }
    console.log('Blogs', this.blogs);
  }

  loadMovies() {
    this.blogService.getMovies().subscribe({
      next: (res: any) => {
        const fetchedBlogs = res.results as BlogDetails[];
        this.blogs = fetchedBlogs.slice().sort((b, a) => a.vote_count - b.vote_count); // Sort fetched data
        console.log('LoadMovies', this.blogs); // Verify sorted blogs
      },
      error: (error) => console.log('Error fetching movies:', error)
    });
  }

  getFullImageUrl(posterPath: String, newUrl: boolean) : String{
    if(!newUrl){//Si l'url est importé d'un json placeholder
      return imgUrl + posterPath;
    } else{//Si l'url est importé manuellement
      return posterPath;
    }
  }

    toggleLike(selectedBlog: BlogDetails, userId: number) {
      // Si le blog n'a pas encore de liste likedBy, initialisez-le avec un tableau vide
      if (!selectedBlog.likedBy) {
        selectedBlog.likedBy = [];
      }
    
      // Vérifiez si l'utilisateur a déjà aimé le blog
      const userHasLiked = selectedBlog.likedBy.includes(userId);
    
      if (userHasLiked) {
        // Si l'utilisateur a déjà aimé le blog, enlevez son like
        selectedBlog.vote_count--;
        // Enlevez l'ID de l'utilisateur de la liste likedBy
        selectedBlog.likedBy = selectedBlog.likedBy.filter(id => id !== userId);
      } else {
        // Si l'utilisateur n'a pas encore aimé le blog, ajoutez son like
        selectedBlog.vote_count++;
        // Ajoutez l'ID de l'utilisateur à la liste likedBy
        selectedBlog.likedBy.push(userId);
      }
    
      // Récupérer la liste des blogs du localStorage
      let blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
      // Trouver l'index du blog sélectionné
      const index: number = blogs.findIndex((blog: BlogDetails) => blog.id === selectedBlog.id);
      // Mettre à jour le blog dans la liste
      blogs[index] = selectedBlog;
      // Réenregistrer la liste des blogs dans le localStorage
      localStorage.setItem('blogs', JSON.stringify(blogs));
    }
}
