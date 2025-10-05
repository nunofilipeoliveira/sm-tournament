import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Adicione isto
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { Match } from '../../models/tournament.model';

@Component({
  selector: 'app-tournament-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Adicione FormsModule aqui
  templateUrl: './tournament-calendar.component.html',
  styleUrls: ['./tournament-calendar.component.scss']
})
export class TournamentCalendarComponent implements OnInit {
  games: Match[] = [];
  editMode = false;
  editingRow: { [id: number]: boolean } = {};
  tempResult: { [id: number]: string } = {};
  tempStatus: { [id: number]: Match['status'] } = {};

  loadingGames = true;

  constructor(
    private tournamentService: TournamentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadingGames = true
    this.route.queryParamMap.subscribe(params => {
      this.editMode = params.get('editMode') === 'true';
    });
    this.tournamentService.loadAllGames().subscribe({
      next: (games: Match[]) => {
        this.games = games;
        this.loadingGames = false;
      },
      error: (err: any) => {
        // tratamento de erro opcional
        console.error(err);
      }
    });
  }

  startEdit(match: Match) {
    this.editingRow[match.id] = true;
    this.tempResult[match.id] = match.result || '';
    this.tempStatus[match.id] = match.status;
  }

  cancelEdit(match: Match) {
    this.editingRow[match.id] = false;
  }

  saveEdit(match: Match) {
    
    match.result = this.tempResult[match.id];
    match.status = this.tempStatus[match.id];

   this.tournamentService.saveMatch(match).subscribe({
      next: () => {
        this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
          this.games = games;
              this.editingRow[match.id] = false;
        });
        
       
      },
      error: (err: any) => {
        // tratamento de erro opcional
        console.error(err);
      }
    });
  }

  reset(match: Match) {
    this.tournamentService.resetMatch(match).subscribe({
      next: () => {
        this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
          this.games = games;
          this.editingRow[match.id] = false;
        });
      },
      error: (err: any) => {
        // tratamento de erro opcional
        console.error(err);
      }
    });
  }

  startMatch(match: Match) {
    if (match.status === 'scheduled') {
      match.status = 'in-progress';
      this.tournamentService.saveMatch(match).subscribe({
        next: () => {
          this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
            this.games = games;
          });
        },
        error: (err: any) => {
          // tratamento de erro opcional
          console.error(err);
        }
      });
    }
  }

  endMatch(match: Match) {
    if (match.status === 'in-progress') {
      match.status = 'completed';
      this.tournamentService.saveMatch(match).subscribe({
        next: () => {
          this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
            this.games = games;
          });
        },
        error: (err: any) => {
          // tratamento de erro opcional
          console.error(err);
        }
      });
    }
  }

  addHomeGoal(match: Match) {
    if (match.goalsHomeTeam === undefined) {
      match.goalsHomeTeam = 0;
    }
    match.goalsHomeTeam++;
    this.tournamentService.saveMatch(match).subscribe({
        next: () => {
          this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
            this.games = games;
          });
        },
        error: (err: any) => {
          // tratamento de erro opcional
          console.error(err);
        }
      });
    
  }

  subHomeGoal(match: Match) {
    if (match.goalsHomeTeam && match.goalsHomeTeam > 0) {
      match.goalsHomeTeam--;
      this.tournamentService.saveMatch(match).subscribe({
        next: () => {
          this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
            this.games = games;
          });
        },
        error: (err: any) => {
          // tratamento de erro opcional
          console.error(err);
        }
      });
    }
  }

  addAwayGoal(match: Match) {
    if (match.goalsAwayTeam === undefined) {
      match.goalsAwayTeam = 0;
    }
    match.goalsAwayTeam++;
    this.tournamentService.saveMatch(match).subscribe({
        next: () => {
          this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
            this.games = games;
          });
        },
        error: (err: any) => {
          // tratamento de erro opcional
          console.error(err);
        }
      });
  }

  subAwayGoal(match: Match) {
    if (match.goalsAwayTeam && match.goalsAwayTeam > 0) {
      match.goalsAwayTeam--;
      this.tournamentService.saveMatch(match).subscribe({
        next: () => {
          this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
            this.games = games;
          });
        },
        error: (err: any) => {
          // tratamento de erro opcional
          console.error(err);
        }
      });
    }
  }

} 