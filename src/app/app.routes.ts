import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ContactComponent } from './contact/contact.component';
import { BlogsComponent } from './blogs/blogs.component';
import { FooterComponent } from './footer/footer.component';
import { CompteComponent } from './compte/compte.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
{
    path:'', component:AccueilComponent
},
{
    path:'contact', component : ContactComponent
},
{
    path:'blogs', component : BlogsComponent
},
{
    path:'footer', component : FooterComponent
},
{
    path:'compte', component : CompteComponent
},
{
    path:'profil', component : ProfilComponent
}
];
