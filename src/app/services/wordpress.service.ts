import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {
  private baseUrl = 'https://admin1.irahetacleaningservicesllc.com/wp-json/';

  constructor(private http: HttpClient) {}

  // Obtener todos los posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts`);
  }

  // Obtener un post por ID o slug
  getPost(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/posts/${id}`);
  }

  // Obtener páginas
  getPages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pages`);
  }

  // Obtener categorías
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }
}
