import { Component, signal,OnInit,ElementRef,AfterViewInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
import { RouterModule,Router } from '@angular/router';

@Component({
  selector: 'app-news',
  imports: [RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class NewsComponent implements OnInit{
  newsPage: any;
  posts: any[] = [];
  featuredImage: any;
  
  constructor(
    private wpService: WordpressService,
    private el: ElementRef,
     private router:Router,
  ) {}

  ngOnInit(): void {
    this.wpService.getPageBySlugNews().subscribe(res => {
      this.newsPage = res[0];
      this.featuredImage = res[0]?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
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
