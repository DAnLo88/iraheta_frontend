import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  pages: any[] = [];

  constructor(private wpService: WordpressService) {}

  ngOnInit(): void {
    this.wpService.getPages().subscribe({
      next: (data) => {
        // Opcional: filtrar páginas privadas o sin slug
        this.pages = data.filter(page => page.slug);
      },
      error: (err) => console.error(err)
    });
  }
}
