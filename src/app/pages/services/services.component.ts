import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  servicesPage: any;
  parentPages: any[] = [];
  constructor(private wpService: WordpressService) {}
   ngOnInit(): void {
    this.wpService.getPageBySlugServices().subscribe(res => {
      this.servicesPage = res[0];
    });
    
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
