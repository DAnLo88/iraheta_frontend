import { Component, signal,OnInit,ElementRef,AfterViewInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule,Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ServicesComponent {
  servicesPage: any;
  parentPages: any;
  featuredImage: any;
  breadcrumbs: any[] = [];
  safeContent!: SafeHtml;

  constructor(
    private wpService: WordpressService,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private router:Router,
  ) {}
  ngOnInit(): void {
    this.wpService.getPageBySlugServices().subscribe(res => {
      this.servicesPage = res[0];
      this.featuredImage = res[0]?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      this.breadcrumbs = res[0]?.yoast_head_json?.breadcrumbs || [];
       this.safeContent = this.sanitizer.bypassSecurityTrustHtml(
        this.servicesPage.content.rendered
      );
    });    
  }

  ngAfterViewInit() {

    this.el.nativeElement.addEventListener('click', (event: any) => {

      const column = event.target.closest('.column-services-page');
      const allColumns = this.el.nativeElement.querySelectorAll('.column-services-page');

      
      if (column) {
        allColumns.forEach((el: HTMLElement) => {
          el.classList.remove('active');
          (el as any).isActive = false;
        });

        column.classList.add('active');
        (column as any).isActive = true;

      } else {
        allColumns.forEach((el: HTMLElement) => {
          el.classList.remove('active');
          (el as any).isActive = false;
        });
      }

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
  }
}
