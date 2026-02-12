import { Component, OnInit,HostListener, ViewChild, ElementRef, Renderer2  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';
import { ParentPagesComponent } from "./parent-pages/parent-pages.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ParentPagesComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('masthead') header!: ElementRef;
  pages: any[] = [];

  constructor(private wpService: WordpressService,private renderer: Renderer2) {}

  ngOnInit(): void {
    this.wpService.getPages().subscribe({
      next: (data) => {
        this.pages = data.filter(page =>
          page.slug &&
          page.parent === 0 
        );
      },
      error: (err) => console.error(err)
    });
  }



  @HostListener('window:scroll', [])
  onWindowScroll() {

    const totalPageHeight = document.body.offsetHeight - 200;
    const height = window.innerHeight;
    const scrollPoint = window.scrollY + window.innerHeight;

    if (scrollPoint === height) {
      // Top
      this.renderer.removeClass(this.header.nativeElement, 'scroll');
    } else if (scrollPoint >= totalPageHeight) {
      // Bottom
      this.renderer.addClass(this.header.nativeElement, 'scroll');
    } else {
      // Middle
      this.renderer.addClass(this.header.nativeElement, 'scroll');
    }
  }
}
