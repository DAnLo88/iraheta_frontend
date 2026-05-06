import { Component, OnInit } from '@angular/core';
import { WordpressService } from '../services/wordpress.service';
import { RouterModule,ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';
import { ParentPagesComponent } from "../header/parent-pages/parent-pages.component";


@Component({
  selector: 'app-footer',
  imports: [
    RouterModule,
    FontAwesomeModule,
    MatButtonModule,
    ParentPagesComponent
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit{
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  pages: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private wpService: WordpressService,
    private router:Router,
  ) {}
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
}
