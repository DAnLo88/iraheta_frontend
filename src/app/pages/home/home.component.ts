import { Component, signal,OnInit } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
// import { LottieComponent } from 'ngx-lottie';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  standalone: true,
  // imports: [LottieComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
safeContent!: SafeHtml;
  homePage: any;
 protected readonly title = signal('iraheta-site');
  constructor(private wpService: WordpressService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
   this.wpService.getPageBySlugHome().subscribe(res => {
    this.homePage = res[0];

    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(
      this.homePage.content.rendered
    );
  });


  }
  //     lottieOptions = {
  //   path: 'assets/animations/website_under.json', // ruta de tu archivo JSON
  //   loop: true,
  //   autoplay: true
  // };
}
