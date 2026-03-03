import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-parent-pages',
  standalone: true,
  imports: [RouterModule,MatButtonModule],
  templateUrl: './parent-pages.component.html',
  styleUrl: './parent-pages.component.scss'
})
export class ParentPagesComponent {
  parentPages: any[] = [];
  constructor(private wpService: WordpressService) {}
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
  }
}
