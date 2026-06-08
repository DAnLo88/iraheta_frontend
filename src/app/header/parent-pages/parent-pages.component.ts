import { Component, ElementRef,  Renderer2, OnInit, AfterViewInit,} from '@angular/core';
import { RouterModule, Router,  NavigationEnd } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import {MatButtonModule} from '@angular/material/button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-parent-pages',
  standalone: true,
  imports: [RouterModule,MatButtonModule],
  templateUrl: './parent-pages.component.html',
  styleUrl: './parent-pages.component.scss'
})
export class ParentPagesComponent implements OnInit, AfterViewInit {
  parentPages: any[] = [];
  constructor(
    private wpService: WordpressService, 
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}
   ngOnInit(): void {
    this.wpService.getPages().subscribe({
      next: (data) => {
        this.parentPages = data.filter(page =>
          page.slug &&
          page.parent === 97
        );
      },
      error: (err) => console.error(err)
    });

     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.setActiveByUrl(), 50);
    });
  }

  ngAfterViewInit(): void {
      setTimeout(() => this.setActiveByUrl(), 50);
  }


  setActiveByUrl(): void {
    const currentUrl = this.router.url
      .split('?')[0]
      .replace(/\/$/, '');

    const container = this.el.nativeElement.querySelector('.sub-list');
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
