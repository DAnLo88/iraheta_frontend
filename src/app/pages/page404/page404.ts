import { Component } from '@angular/core';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-page404',
  imports: [LottieComponent],
  templateUrl: './page404.html',
  styleUrl: './page404.scss',
})
export class Page404 {
  lottieOptions = {
    path: 'assets/animations/404_page.json', // ruta de tu archivo JSON
    loop: true,
    autoplay: true
  };
}
