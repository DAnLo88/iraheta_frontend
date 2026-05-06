import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { WordpressService } from '../services/wordpress.service';
import { ParentPagesComponent } from './parent-pages/parent-pages.component';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ParentPagesComponent, MatButtonModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  faPhone = faPhone;
  @ViewChild('masthead') header!: ElementRef;

  pages: any[] = [];

  constructor(
    private wpService: WordpressService,
    private renderer: Renderer2,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // Obtener páginas desde WordPress
    this.wpService.getPages().subscribe({
      next: (data) => {
        this.pages = data.filter(page =>
          page.slug && page.parent === 0
        );

        // Esperar a que renderice el DOM antes de aplicar active
        setTimeout(() => this.setActiveByUrl());
      },
      error: (err) => console.error(err)
    });

    // Detectar cambios de ruta
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.setActiveByUrl();
    });
  }

  ngAfterViewInit(): void {
    // Primera ejecución (por si ya hay URL cargada)
    setTimeout(() => this.setActiveByUrl());
  }

  // 🔥 Detecta URL actual y aplica clase active
  setActiveByUrl(): void {
    const currentUrl = this.router.url.split('?')[0].replace(/\/$/, '');

    const allLinks = this.el.nativeElement.querySelectorAll('.nav-button-page');

    allLinks.forEach((el: HTMLElement) => {
      this.renderer.removeClass(el, 'active');

      let link = el.getAttribute('href');
      if (!link) return;

      try {
        link = new URL(link).pathname;
      } catch (e) {}

      link = link.split('?')[0].replace(/\/$/, '');

      if (currentUrl === link) {
        this.renderer.addClass(el, 'active');
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const totalPageHeight = document.body.offsetHeight - 200;
    const height = window.innerHeight;
    const scrollPoint = window.scrollY + window.innerHeight;

    if (scrollPoint === height) {
      this.renderer.removeClass(this.header.nativeElement, 'scroll');
    } else if (scrollPoint >= totalPageHeight) {
      this.renderer.addClass(this.header.nativeElement, 'scroll');
    } else {
      this.renderer.addClass(this.header.nativeElement, 'scroll');
    }
  }
}