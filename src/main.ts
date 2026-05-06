import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

bootstrapApplication(App, appConfig)
  .then(appRef => {
    const router = appRef.injector.get(Router);

    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 50);
      });
  })
  .catch((err) => console.error(err));