import {
  Component,
  signal,
  OnInit,
  AfterViewInit,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
  Renderer2,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';
import { WordpressService } from '../services/wordpress.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  standalone: true,
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageComponent implements OnInit, AfterViewInit {

  safeContent!: SafeHtml;

  protected readonly title = signal('iraheta-site');
  page: any;
  featuredImage: any;

  constructor(
    private el: ElementRef,
    private route: ActivatedRoute,
    private wpService: WordpressService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      if (slug) {
        this.page = null;

        this.wpService.getPageBySlug(slug).subscribe(res => {
          if (!res || res.length === 0) {
            this.router.navigate(['/404']);
            return;
          }

          this.page = res[0];

          this.featuredImage =
            this.page?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(
            this.page.content.rendered
          );

          // 🔥 esperar render real del DOM
          setTimeout(() => this.setActiveByUrl(), 50);
        });
      }
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.setActiveByUrl(), 50);
      });
  }

  ngAfterViewInit(): void {
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

      const isLatestPost = link.closest('.wp-block-latest-posts');

      if (isLatestPost) {
        const slug = path.split('/').filter(Boolean)[0];
        path = `/news/${slug}`;
      }

      this.router.navigateByUrl(path);

    }, true);

    setTimeout(() => this.setActiveByUrl(), 50);
  }

  setActiveByUrl(): void {
    const currentUrl = this.router.url
      .split('?')[0]
      .replace(/\/$/, '');

    const container = this.el.nativeElement.querySelector('.list-nav-services');
    if (!container) return;

    const allLinks = container.querySelectorAll('li > a');

    allLinks.forEach((el: HTMLElement) => {
      this.renderer.removeClass(el, 'active');

      let link = el.getAttribute('href');
      if (!link) return;

      // 🔥 normalización correcta SIEMPRE
      link = new URL(link, window.location.origin).pathname;

      link = link.split('?')[0].replace(/\/$/, '');

      // ✅ match exacto (sin includes)
      if (currentUrl === link) {
        this.renderer.addClass(el, 'active');
      }
    });
  }
}