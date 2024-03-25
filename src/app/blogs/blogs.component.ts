import { Component, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { BlogDetails } from '../interface/blog-details';
import moment from 'moment';
import { UserDetails } from '../interface/user-details';
import { AuthService } from '../services/auth.service';
import { CommentDetails } from '../interface/comment-details';

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
  comments: CommentDetails[] = [];
  user: any;
  selectedBlogType = 'all'; // Variable pour stocker le type de blog sélectionné

  newComment: CommentDetails = {
    user: {id: 0, prenom: '', nom: '', phone_number: '', email: '', password: '', id_blog: 0, friends: []},
    message: '',
    date: moment(new Date()).format('DD/MM/YYYY')
  }; // Variable pour stocker le nouveau commentaire

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
    review: '',
    liked: false,
    likedBy: []
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
      //initialiser l'auteur du blog avec le nom et prénom de l'utilisateur actuellement connecté
      this.nouveauBlog.author = this.user.nom + ' ' + this.user.prenom;
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
        review: '',
        liked: false,
        likedBy: []
      };
    } else {
      alert('Veuillez compléter tous les champs');
    }
  }
  
  supprimerBlog(id: number, title: string) {
    console.log('Suppression du blog avec l\'ID', id);
    console.log('Titre du blog à supprimer', title);
    // Trouver l'index du blog avec l'ID et le titre spécifiés
    const index = this.blogs.findIndex(blog => blog.id === id && blog.title === title);
    // Si l'ID et le titre sont trouvés
    if (index !== -1) {
      // Supprimer le blog à l'index trouvé
      this.blogs.splice(index, 1);
      // Mettre à jour le localStorage
      localStorage.setItem('blogs', JSON.stringify(this.blogs));
    } else {
      // Afficher un message d'erreur si l'ID et le titre ne sont pas trouvés
      console.error(`Blog avec l'ID ${id} et le titre ${title} non trouvé`);
    }
  }

  isBlogVisible(blog: BlogDetails) {
    return ((blog.id === this.user.id_blog && (this.selectedBlogType === 'all' || blog.visibility === this.selectedBlogType)) || 
            (this.user.friends.some((friend: { id_blog: number; }) => blog.id === friend.id_blog) && blog.visibility === 'friend' && blog.visibility === this.selectedBlogType));
  }

  addComment(selectedBlog: BlogDetails) {
    if (this.newComment.message) {
      this.newComment.user = this.user;
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
        this.newComment = {
          user: {id: 0, prenom: '', nom: '', phone_number: '', email: '', password: '', id_blog: 0, friends: []},
          message: '',
          date: moment(new Date()).format('DD/MM/YYYY')
        };
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

