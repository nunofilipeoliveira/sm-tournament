import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { TournamentCalendarComponent } from './app/components/tournament-calendar/tournament-calendar.component';

const routes: Routes = [
  { path: '', component: TournamentCalendarComponent, data: { editMode: false } },
  { path: 'matches', component: TournamentCalendarComponent, data: { editMode: true } },
];

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    // outros providers...
  ]
}).catch(err => console.error(err));