import { Component } from '@angular/core';
import { TournamentCalendarComponent } from './components/tournament-calendar/tournament-calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TournamentCalendarComponent],
  template: `<app-tournament-calendar></app-tournament-calendar>`,
  styles: [],
})
export class App {}