import { Component } from '@angular/core';
import { TournamentCalendarComponent } from './components/tournament-calendar/tournament-calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TournamentCalendarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}