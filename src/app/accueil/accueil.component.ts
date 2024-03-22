import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { BlogService } from '../services/blog.service';
import { BlogDetails } from '../interface/blog-details';

const imgUrl = environment.imgUrl

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
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

ngOnInit(): void {
  this.loadMovies();
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
}
