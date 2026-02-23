import { Component, signal,OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
// import { LottieComponent } from 'ngx-lottie';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

import { Router } from '@angular/router';

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
  constructor(
      private el: ElementRef,
    private wpService: WordpressService, 
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wpService.getPageBySlugHome().subscribe(res => {
    this.homePage = res[0];

    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(
      this.homePage.content.rendered
    );
   });
  }


  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event: any) => {
      const link = event.target.closest('a.spa-link');

      if (!link) return;

      event.preventDefault();

      const route = link.getAttribute('href');
      this.router.navigateByUrl(route);
    });
  }
  //     lottieOptions = {
  //   path: 'assets/animations/website_under.json', // ruta de tu archivo JSON
  //   loop: true,
  //   autoplay: true
  // };



  handleSpaClick(event: Event) {
    event.preventDefault();

    const target = event.currentTarget as HTMLAnchorElement;
    const route = target.getAttribute('href');

    if (route) {
      this.router.navigateByUrl(route);
    }
  }
}
