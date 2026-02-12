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
    path: 'news',
     loadComponent: () =>
      import('./pages/news/news.component').then(m => m.NewsComponent)
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./page/page.component').then(m => m.PageComponent)
  },
  
  {
    path: 'services',
      children:[
      {
        path: ':slug',
        loadComponent: () =>
        import('./page/page.component').then(m => m.PageComponent)
        
      }
    ]
  },

  {
    path: 'news',
      children:[
      {
        path: ':slug',
        loadComponent: () =>
        import('./post/post.component').then(m => m.PostComponent)
        
      }
    ]
  },

  // {
  //   path: 'services/:slug',
  //   loadComponent: () =>
  //     import('./page/page.component').then(m => m.PageComponent)
  // },
  {
    path: '**',
    redirectTo: ''
  }
];
