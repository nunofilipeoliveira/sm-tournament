import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-tournament-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-calendar.component.html',
  styleUrls: ['./tournament-calendar.component.scss']
})
export class TournamentCalendarComponent {
  tournament$;

  constructor(private tournamentService: TournamentService) {
    this.tournament$ = this.tournamentService.tournament$;
  }
}