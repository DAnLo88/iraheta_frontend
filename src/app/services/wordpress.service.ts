import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  private apiUrl = environment.wpApiUrl;

  constructor(private http: HttpClient) {}

  // Obtener posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts?per_page=100`);
  }

  // Obtener un post por slug
  getPostBySlug(slug: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/posts?slug=${slug}&_embed`
    );
  }

  // Obtener páginas
  getPages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pages?per_page=100`);
  }

  getPageBySlug(slug: string): Observable<any[]>  {
    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=${slug}&_embed`
    );
  }

  getPageBySlugHome() {
    const params = {
      //per_page: 5,
      _embed: 'true'
    };

    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=home`, {params}
    );
  }

  getPageBySlugServices() {
    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=services&_embed`
    );
  }

  getPageBySlugNews() {
    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=news&_embed`
    );
  }

  getPageBySlugContact() {
    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=contact-us&_embed`
    );
  }
}
