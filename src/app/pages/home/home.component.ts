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

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';


@Component({
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule,MatExpansionModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class HomeComponent implements OnInit {
safeContent!: SafeHtml;
  homePage: any;
  protected readonly title = signal('iraheta-site');
  readonly panelOpenState = signal(false);
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

      const link = event.target.closest('a');
      if (!link) return;

      const url = link.getAttribute('href');
      if (!url) return;

      const internalDomains = [
        window.location.hostname,
        'admin1.irahetacleaningservicesllc.com'
      ];

      const isInternal =
        internalDomains.some(domain => url.includes(domain)) ||
        url.startsWith('/');

      if (!isInternal) return;

      event.preventDefault();
      event.stopPropagation();

      let path = url;

      if (url.startsWith('http')) {
        path = new URL(url).pathname;
      }

      path = path.replace(/\/$/, '');

      //detectar si el link viene del bloque Latest Posts
      const isLatestPost = link.closest('.wp-block-latest-posts');

      if (isLatestPost) {
        const slug = path.split('/').filter(Boolean)[0];
        path = `/news/${slug}`;
      }

      this.router.navigateByUrl(path);

    }, true);

  }
}
