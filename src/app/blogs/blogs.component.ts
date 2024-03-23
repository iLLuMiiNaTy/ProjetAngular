import { Component, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { BlogDetails } from '../interface/blog-details';
import moment from 'moment';
import { UserDetails } from '../interface/user-details';
import { AuthService } from '../services/auth.service';

const imgUrl = environment.imgUrl

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  isLogged = false;
  blogs: BlogDetails[] = [];
  users: UserDetails[] = [];
  user: any;
  selectedBlogType = 'all'; // Variable pour stocker le type de blog sélectionné
  newComment = ''; // Variable pour stocker le nouveau commentaire

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
    id: 0,
    title: '',
    overview: '',
    poster_path: '',
    release_date: '',
    author: '',
    vote_count: 0,
    newUrl: true,
    visibility: '',
    comments: [],
    review: ''
  };

  ngOnInit(): void {
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

  getFullImageUrl(posterPath: String, newUrl: boolean) : String{
    if(!newUrl){//Si l'url est importé d'un json placeholder
      return imgUrl + posterPath;
    } else{//Si l'url est importé manuellement
      return posterPath;
    }
  }

  ajouterBlog() {
    if (this.nouveauBlog.title && this.nouveauBlog.poster_path && this.nouveauBlog.overview) {
      //Générer une date formatée pour la création du blog
      const dateAujourdHui = new Date();
      const dateFormatee = moment(dateAujourdHui).format('DD/MM/YYYY');
      this.nouveauBlog.release_date = dateFormatee;
      //initialiser l'id du blog avec l'id du blog de l'utilisateur actuellement connecté
      this.nouveauBlog.id = this.user.id_blog;
      console.log('ID User', this.user.id_blog);
      console.log('ID Blog', this.nouveauBlog.id);
      //initialiser l'auteur du blog avec le nom et prénom de l'utilisateur actuellement connecté
      this.nouveauBlog.author = this.user.nom + ' ' + this.user.prenom;
      console.log('Nouveau Blog', this.nouveauBlog);
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
        id: 0,
        visibility: '',
        comments: [],
        review: ''
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
  }

  isBlogVisible(blog: BlogDetails) {
    return ((blog.id === this.user.id_blog && (this.selectedBlogType === 'all' || blog.visibility === this.selectedBlogType)) || 
            (this.user.friends.some((friend: { id_blog: number; }) => blog.id === friend.id_blog) && blog.visibility === 'friend' && blog.visibility === this.selectedBlogType));
  }

  addComment(selectedBlog: BlogDetails) {
    if (this.newComment) {
      // Ajouter le nouveau commentaire au blog sélectionné
        selectedBlog.comments.push(this.newComment);
        // Trouver l'index du blog sélectionné dans le tableau de blogs
        const index = this.blogs.findIndex(blog => blog.id === selectedBlog.id);
        // Si le blog sélectionné est trouvé
        if (index !== -1) {
          // Mettre à jour le blog dans le tableau de blogs
          this.blogs[index] = selectedBlog;
          // Mettre à jour le localStorage
          localStorage.setItem('blogs', JSON.stringify(this.blogs));
        } else {
          // Afficher un message d'erreur si le blog sélectionné n'est pas trouvé
          console.error(`Blog avec l'ID ${selectedBlog.id} non trouvé`);
        }
        // Réinitialiser le nouveau commentaire
        this.newComment = '';
      }
    }
  }

