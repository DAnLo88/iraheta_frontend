import { Component, signal,OnInit } from '@angular/core';
import { RouterOutlet,RouterModule } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';
import { WordpressService } from './services/wordpress.service';
import { Footer } from "./footer/footer";
import { HeaderComponent } from "./header/header.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LottieComponent, Footer, RouterModule, HeaderComponent],  // importa LottieComponent
  templateUrl: './app.html',
  styleUrls: ['./app.scss'] // corregido de styleUrl -> styleUrls
})
export class App implements OnInit{
  posts: any[] = [];
  pages: any[] = [];

  protected readonly title = signal('iraheta-site');

  constructor(private wpService: WordpressService) {}

  ngOnInit(): void {
    this.wpService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => {
        console.error('Error cargando posts', err);
      }
    });

    this.wpService.getPages().subscribe({
      next: (data) => {
        // Opcional: filtrar páginas privadas o sin slug
        this.pages = data.filter(page => page.slug);
      },
      error: (err) => console.error(err)
    });
  }
  // Configuración de Lottie
  lottieOptions = {
    path: 'assets/animations/website_under.json', // ruta de tu archivo JSON
    loop: true,
    autoplay: true
  };
}
