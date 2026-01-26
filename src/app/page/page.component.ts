import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';

@Component({
  standalone: true,
  template: `
    @if (page) {
      <h1 [innerHTML]="page.title.rendered"></h1>
      <div [innerHTML]="page.content.rendered"></div>
    }
  `
})
export class PageComponent implements OnInit {

  page: any;

  constructor(
    private route: ActivatedRoute,
    private wpService: WordpressService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.wpService.getPageBySlug(slug).subscribe(res => {
      this.page = res[0];
    });
  }
}
