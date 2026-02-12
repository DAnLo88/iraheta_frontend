import { Component, signal,OnInit } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
// import { LottieComponent } from 'ngx-lottie';

@Component({
  standalone: true,
  // imports: [LottieComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homePage: any;
 protected readonly title = signal('iraheta-site');
  constructor(private wpService: WordpressService) {}

  ngOnInit(): void {
    this.wpService.getPageBySlugHome().subscribe(res => {
      this.homePage = res[0];
    });


  }
  //     lottieOptions = {
  //   path: 'assets/animations/website_under.json', // ruta de tu archivo JSON
  //   loop: true,
  //   autoplay: true
  // };
}
