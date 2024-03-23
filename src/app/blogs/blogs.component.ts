import { Component, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { BlogDetails } from '../interface/blog-details';
import moment from 'moment';

const imgUrl = environment.imgUrl

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  private blogService = inject(BlogService);
  blogs: BlogDetails[] = [];

  selectedBlog: BlogDetails | null = null; // Variable pour stocker le blog sélectionné

    isModalOpen = false; // Variable pour indiquer si la fenêtre modale est ouverte
 // Méthode pour ouvrir la fenêtre modale avec les détails du blog sélectionné
 openModal(blog: BlogDetails) {
  this.selectedBlog = blog;
  // Afficher la fenêtre modale
  document.getElementById('blog-details-modal')!.classList.remove('hidden');
}

// Méthode pour fermer la fenêtre modale
closeModal() {
  this.selectedBlog = null;
  // Cacher la fenêtre modale
  document.getElementById('blog-details-modal')!.classList.add('hidden');
}

  
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
    this.loadMovies();
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      this.blogs = JSON.parse(storedBlogs);
    }
  }

  loadMovies() {
    this.blogService.getMovies().subscribe({
      next: (res: any) => {
        const fetchedBlogs = res.results as BlogDetails[];
        this.blogs = fetchedBlogs.slice().sort((b, a) => a.vote_count - b.vote_count); // Sort fetched data
        console.log(this.blogs); // Verify sorted blogs
      },
      error: (error) => console.log('Error fetching movies:', error)
    });
  }
  getFullImageUrl(posterPath: String, newUrl: boolean) : String{
    if(!newUrl){
      return imgUrl + posterPath;
    } else{
      return posterPath;
    }
  }

  ajouterBlog() {
    if (this.nouveauBlog.title && this.nouveauBlog.poster_path && this.nouveauBlog.overview) {
      const dateAujourdHui = new Date();
      const dateFormatee = moment(dateAujourdHui).format('DD/MM/YYYY');
      this.nouveauBlog.release_date = dateFormatee;
      this.blogs.push({...this.nouveauBlog});
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

  generateNewId(): number {
    const maxId = Math.max(...this.blogs.map(blog => blog.id));
    return maxId + 1;
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
  }

}

