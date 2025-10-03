import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../services/tournament.service';
import { Match } from '../../models/tournament.model';

@Component({
  selector: 'app-tournament-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-calendar.component.html',
  styleUrls: ['./tournament-calendar.component.scss']
})
export class TournamentCalendarComponent implements OnInit {
  tournament$;
  games: Match[] = [];

  constructor(private tournamentService: TournamentService) {
    this.tournament$ = this.tournamentService.tournament$;
  }

  ngOnInit() {
    this.tournamentService.loadAllGames().subscribe(games => {
      this.games = games;
      console.log('Games loaded:', this.games);
    });
  }
}