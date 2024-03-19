import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { BlogsComponent } from './blogs/blogs.component';


export const routes: Routes = [
{
    path:'', component:AccueilComponent
},
{
    path:'login', component: LoginComponent
},
{
    path:'contact', component : ContactComponent
},
{
    path:'blogs', component : BlogsComponent
}

];
