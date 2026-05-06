import { Component, signal,OnInit,ElementRef,AfterViewInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class PostComponent implements OnInit{
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
      }
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

  }
}
