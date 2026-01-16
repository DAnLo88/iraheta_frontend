import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LottieComponent],  // importa LottieComponent
  templateUrl: './app.html',
  styleUrls: ['./app.scss'] // corregido de styleUrl -> styleUrls
})
export class App {
  protected readonly title = signal('iraheta-site');

  // Configuración de Lottie
  lottieOptions = {
    path: 'assets/animations/website_under.json', // ruta de tu archivo JSON
    loop: true,
    autoplay: true
  };
}
