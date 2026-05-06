import { Routes } from '@angular/router';

export const routes: Routes = [


  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },

  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services.component').then(m => m.ServicesComponent)
  },
 
  {
    path: 'services/:slug',
    loadComponent: () =>
      import('./page/page.component').then(m => m.PageComponent)
  },
  {
    path: 'news',
    loadComponent: () =>
      import('./pages/news/news.component').then(m => m.NewsComponent)
  },
  {
    path: 'contact-us',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent)
  }, 

  {
    path: 'news/:slug',
    loadComponent: () =>
      import('./post/post.component').then(m => m.PostComponent)
  },


  {
    path: '404',
    loadComponent: () =>
      import('./pages/page404/page404').then(m => m.Page404)
  },

  {
    path: ':slug',
    loadComponent: () =>
      import('./page/page.component').then(m => m.PageComponent)
  },

  {
    path: '**',
    redirectTo: '404'
  }
];