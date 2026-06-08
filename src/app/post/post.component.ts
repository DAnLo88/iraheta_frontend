import { Component, signal,OnInit,ElementRef,AfterViewInit,CUSTOM_ELEMENTS_SCHEMA,Renderer2, } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class PostComponent implements OnInit, AfterViewInit{
  safeContent!: SafeHtml;
  protected readonly title = signal('iraheta-site');
  post: any;
  featuredImage: any;

  constructor(
   private el: ElementRef,
    private route: ActivatedRoute,
    private wpService: WordpressService,
    private router:Router,
    private sanitizer: DomSanitizer,
     private renderer: Renderer2,
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      if (slug) {
        this.post = null; // limpia la vista
        this.wpService.getPostBySlug(slug).subscribe(res => {
          if (!res || res.length === 0) {
            this.router.navigate(['/404']);
            return;
          }
          this.post = res[0];

          this.featuredImage = this.post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(
            this.post.content.rendered
          );
        });

        setTimeout(() => this.setActiveByUrl(), 50);
      }
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.setActiveByUrl(), 50);
    });
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

    setTimeout(() => this.setActiveByUrl(), 50);

  }

  setActiveByUrl(): void {
    const currentUrl = this.router.url
      .split('?')[0]
      .replace(/\/$/, '');

    const container = this.el.nativeElement.querySelector('.nav-list-post');
    if (!container) return;

    const allLinks = container.querySelectorAll('li > a');

    allLinks.forEach((el: HTMLElement) => {
      this.renderer.removeClass(el, 'active');

      let link = el.getAttribute('href');
      if (!link) return;

      //normalización 
      link = new URL(link, window.location.origin).pathname;

      link = link.split('?')[0].replace(/\/$/, '');

     
      if (currentUrl === link) {
        this.renderer.addClass(el, 'active');
      }
    });
  }
}
