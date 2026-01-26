import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./app').then(m => m.App) },

  //{ path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent) },

  { path: ':slug', component: App },

  { path: '**', redirectTo: '' }
];