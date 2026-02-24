import { Component, signal,OnInit, AfterViewInit, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
// import { LottieComponent } from 'ngx-lottie';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();
import { EffectCreative, Autoplay, Parallax } from 'swiper/modules';

import { Router } from '@angular/router';

@Component({
  standalone: true,
  // imports: [LottieComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
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

    // Inicializar swiper después de que Angular pinte el HTML
    setTimeout(() => {
      this.initSwiper();
    });
  });
  }
   
  initSwiper() {
  const swiperEl = this.el.nativeElement.querySelector('.mySwiper');

  if (!swiperEl) return;

  // evita reinicialización
  if (swiperEl.swiper) {
    swiperEl.swiper.destroy(true, true);
  }

  Object.assign(swiperEl, {
    modules: [EffectCreative, Autoplay, Parallax],
    grabCursor: true,
    effect: "creative",
    speed: 1000,
    parallax: true,
    loop: true,
    autoplay: {
      delay: 18000,
      disableOnInteraction: false
    },
    creativeEffect: {
      prev: {
        shadow: true,
        translate: ["-10%", 0, -1],
      },
      next: {
        translate: ["100%", 0, 0],
      },
    },
  });

    swiperEl.initialize();
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
