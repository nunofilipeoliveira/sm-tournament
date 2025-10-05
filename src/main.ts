import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter([]),
    // outros providers...
  ]
}).catch(err => console.error(err));