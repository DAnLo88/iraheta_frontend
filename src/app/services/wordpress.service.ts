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
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

  // Obtener un post por slug
  getPostBySlug(slug: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/posts?slug=${slug}`
    );
  }

  // Obtener páginas
  getPages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pages?per_page=100`);
  }

  getPageBySlug(slug: string): Observable<any[]>  {
    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=${slug}`
    );
  }

  getPageBySlugHome() {
    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=home`
    );
  }

  getPageBySlugServices() {
    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=services`
    );
  }

  getPageBySlugNews() {
    return this.http.get<any[]>(
    `${this.apiUrl}/pages?slug=news`
    );
  }
}
