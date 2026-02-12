import { Component, OnInit } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-news',
  imports: [RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit{
  newsPage: any;
  posts: any[] = [];
  
  constructor(private wpService: WordpressService) {}

  ngOnInit(): void {
    this.wpService.getPageBySlugNews().subscribe(res => {
      this.newsPage = res[0];
    });

    this.wpService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => {
        console.error('Error cargando posts', err);
      }
    });
  }
}
