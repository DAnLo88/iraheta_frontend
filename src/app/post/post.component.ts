import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{
  post: any;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordpressService
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      if (slug) {
        this.post = null; // limpia la vista
        this.wpService.getPostBySlug(slug).subscribe(res => {
          this.post = res[0];
        });
      }
    });
  }
}
