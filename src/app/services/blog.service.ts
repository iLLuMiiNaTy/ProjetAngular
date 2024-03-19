import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogDetails } from '../interface/blog-details';

const apiUrl = environment.apiUrl;
const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient)
  constructor() { }

  getMovies() : Observable<BlogDetails>{
    return this.http.get<BlogDetails>(`${apiUrl}?api_key=${apiKey}`);
  }
}
