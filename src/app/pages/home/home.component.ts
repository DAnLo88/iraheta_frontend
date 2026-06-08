import {
  Component,
  signal,
  OnInit,
  AfterViewInit,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

import { WordpressService } from '../../services/wordpress.service';

import {
  Router,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import { register } from 'swiper/element/bundle';

import {
  EffectCreative,
  Autoplay,
  Parallax
} from 'swiper/modules';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

register();

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent
implements OnInit, AfterViewInit {

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

    this.wpService.getPageBySlugHome()
      .subscribe(res => {

        this.homePage = res[0];

        this.safeContent =
          this.sanitizer.bypassSecurityTrustHtml(
            this.homePage.content.rendered
          );

        setTimeout(() => {
          this.initSwiper();
        }, 100);

      });

    // reiniciar swiper cuando regreses al home
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        setTimeout(() => {
          this.initSwiper();
        }, 100);

      });
  }

  initSwiper(): void {

    const swiperEl =
      this.el.nativeElement.querySelector('.mySwiper');

    if (!swiperEl) return;

    // destruir instancia previa
    if (swiperEl.swiper) {
      swiperEl.swiper.destroy(true, true);
    }

    Object.assign(swiperEl, {

      modules: [
        EffectCreative,
        Autoplay,
        Parallax
      ],

      grabCursor: true,

      effect: 'creative',

      speed: 1000,

      parallax: true,

      loop: true,

      observer: true,

      observeParents: true,

      allowTouchMove: true,

      autoplay: {
        delay: 1800000000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        waitForTransition: true,
      },

      creativeEffect: {

        prev: {
          shadow: true,
          translate: ['-10%', 0, -1],
        },

        next: {
          translate: ['100%', 0, 0],
        },
      },
    });

    swiperEl.initialize();

    requestAnimationFrame(() => {

      // iniciar autoplay del slider
      swiperEl.swiper?.autoplay?.start();

      const playActiveVideo = () => {

        const videos =
          swiperEl.querySelectorAll('video');

        videos.forEach(
          (video: HTMLVideoElement) => {

            video.pause();

            video.currentTime = 0;
          }
        );

        const activeSlide =
          swiperEl.swiper.slides[
            swiperEl.swiper.activeIndex
          ];

        const activeVideo =
          activeSlide?.querySelector('video');

        if (activeVideo) {

          activeVideo.muted = true;

          activeVideo.play()
            .then(() => {

              // continuar autoplay
              swiperEl.swiper.autoplay.start();

            })
            .catch(console.error);
        }
      };

      // reproducir al iniciar
      swiperEl.swiper.on(
        'init',
        () => {

          setTimeout(() => {
            playActiveVideo();
          }, 300);

        }
      );

      // reproducir automáticamente
      swiperEl.swiper.on(
        'slideChange',
        () => {

          setTimeout(() => {
            playActiveVideo();
          }, 200);

        }
      );

      // reproducir primer video
      setTimeout(() => {
        playActiveVideo();
      }, 500);

    });
  }

  ngAfterViewInit(): void {

    this.el.nativeElement.addEventListener(
      'click',
      (event: any) => {

        const link =
          event.target.closest('a');

        if (!link) return;

        const url =
          link.getAttribute('href');

        if (!url) return;

        const internalDomains = [
          window.location.hostname,
          'admin1.irahetacleaningservicesllc.com'
        ];

        const isInternal =
          internalDomains.some(domain =>
            url.includes(domain)
          ) || url.startsWith('/');

        if (!isInternal) return;

        event.preventDefault();
        event.stopPropagation();

        let path = url;

        if (url.startsWith('http')) {
          path = new URL(url).pathname;
        }

        path = path.replace(/\/$/, '');

        const isLatestPost =
          link.closest('.wp-block-latest-posts');

        if (isLatestPost) {

          const slug =
            path.split('/')
              .filter(Boolean)[0];

          path = `/news/${slug}`;
        }

        this.router.navigateByUrl(path);

      },
      true
    );
  }
}