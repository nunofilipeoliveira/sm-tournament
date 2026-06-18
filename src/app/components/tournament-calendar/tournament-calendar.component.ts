import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { AuthService } from '../../services/auth.service';
import { Match, Team, Classificacao } from '../../models/tournament.model';
import { LoginComponent } from '../login/login.component';

interface GameDateGroup {
  dateKey: string;
  dateLabel: string;
  weekdayLabel: string;
  matches: Match[];
}

@Component({
  selector: 'app-tournament-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent],
  templateUrl: './tournament-calendar.component.html',
  styleUrls: ['./tournament-calendar.component.scss']
})
export class TournamentCalendarComponent implements OnInit, OnDestroy {
  games: Match[] = [];
  gamesByDate: GameDateGroup[] = [];
  editMode = false;
  editingRow: { [id: number]: boolean } = {};
  tempResult: { [id: number]: string } = {};
  tempStatus: { [id: number]: Match['status'] } = {};

  loadingGames = true;
  private refreshInterval: any = null;
  private readonly REFRESH_INTERVAL_MS = 5000; // 5 segundos

  // Modal de classificação
  showClassificacaoModal = false;
  classificacao: Classificacao[] = [];
  classificacaoRound = '';
  loadingClassificacao = false;
  private classificacaoRefreshInterval: any = null;

  constructor(
    private tournamentService: TournamentService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    
    this.loadingGames = true;
    this.route.data.subscribe(data => {
      this.editMode = data['editMode'] === true;
      
      // Inicia o auto-refresh apenas no modo visualização
      if (!this.editMode) {
        this.startAutoRefresh();
      }
    });
    
    this.loadGames();
  }

  ngOnDestroy() {
    // Limpa os intervalos quando o componente é destruído
    this.stopAutoRefresh();
    this.stopClassificacaoRefresh();
  }

  private loadGames() {
    this.tournamentService.loadAllGames().subscribe({
      next: (games: Match[]) => {
        console.log('Primeiro jogo raw:', JSON.stringify(games[0]));
        console.log('Campo date:', games[0]?.date, typeof games[0]?.date);
        this.games = games;
        this.gamesByDate = this.groupGamesByDate(games);
        this.loadingGames = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loadingGames = false;
      }
    });
  }

  private startAutoRefresh() {
    // Limpa qualquer intervalo existente
    this.stopAutoRefresh();
    
    // Configura novo intervalo
    this.refreshInterval = setInterval(() => {
      // Recarrega os dados sem mostrar o loading para não interferir na visualização
      this.tournamentService.loadAllGames().subscribe({
        next: (games: Match[]) => {
          this.games = games;
          this.gamesByDate = this.groupGamesByDate(games);
        },
        error: (err: any) => {
          console.error('Erro no auto-refresh:', err);
        }
      });
    }, this.REFRESH_INTERVAL_MS);
  }

  private stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  getTeamName(team?: Team | string): string {
    return typeof team === 'string' ? team : team?.name || '';
  }

  trackByDateKey(_: number, group: GameDateGroup): string {
    return group.dateKey;
  }

  trackByMatch(_: number, match: Match): number {
    return match.id;
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
          this.gamesByDate = this.groupGamesByDate(games);
          this.editingRow[match.id] = false;
        });
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  reset(match: Match) {
    this.tournamentService.resetMatch(match).subscribe({
      next: () => {
        this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
          this.games = games;
          this.gamesByDate = this.groupGamesByDate(games);
          this.editingRow[match.id] = false;
        });
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  resetAll() {
  // percorre todos os jogos carregados e faz reset um a um
  for (const match of this.games) {
    this.tournamentService.resetMatch(match).subscribe({
      next: () => {
        // após cada reset, recarrega os jogos para refletir as mudanças
        this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
          this.games = games;
          this.gamesByDate = this.groupGamesByDate(games);
        });
      },
      error: (err: any) => {
        console.error(`Erro ao resetar jogo ${match.id}:`, err);
      }
    }); 
  }


  }
  startMatch(match: Match) {
    if (match.status === 'scheduled') {
      match.status = 'in-progress';
      this.tournamentService.saveMatch(match).subscribe({
        next: () => {
          this.tournamentService.loadAllGames().subscribe((games: Match[]) => {
            this.games = games;
            this.gamesByDate = this.groupGamesByDate(games);
          });
        },
        error: (err: any) => {
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
            this.gamesByDate = this.groupGamesByDate(games);
          });
        },
        error: (err: any) => {
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
          this.gamesByDate = this.groupGamesByDate(games);
        });
      },
      error: (err: any) => {
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
            this.gamesByDate = this.groupGamesByDate(games);
          });
        },
        error: (err: any) => {
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
          this.gamesByDate = this.groupGamesByDate(games);
        });
      },
      error: (err: any) => {
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
            this.gamesByDate = this.groupGamesByDate(games);
          });
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  private groupGamesByDate(games: Match[]): GameDateGroup[] {
    const groups = new Map<string, Match[]>();

    games.forEach(match => {
      const dateKey = this.getDateKey(match.date);
      const group = groups.get(dateKey) || [];
      group.push(match);
      groups.set(dateKey, group);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, matches]) => {
        const date = this.parseDateKey(dateKey);
        return {
          dateKey,
          dateLabel: this.formatDateLabel(date),
          weekdayLabel: this.formatWeekdayLabel(date),
          matches: matches.sort((a, b) => this.compareMatches(a, b))
        };
      });
  }

  private getDateKey(date: string): string {
    if (!date) {
      return 'sem-data';
    }
    // Suporta formatos: "2026-06-20", "2026-06-20T10:00:00", "2026-06-20T10:00:00Z", "2026-06-20 10:00:00"
    // Extrai apenas a parte da data (antes de 'T' ou ' ')
    const datePart = date.split('T')[0].split(' ')[0];
    const parts = datePart.split('-');
    if (parts.length < 3) {
      return 'sem-data';
    }
    const [year, month, day] = parts;
    if (!year || !month || !day || isNaN(Number(year)) || isNaN(Number(month)) || isNaN(Number(day))) {
      return 'sem-data';
    }
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private parseDateKey(dateKey: string): Date {
    if (dateKey === 'sem-data') {
      // Data sentinela para jogos sem data — apresentada no fim
      const d = new Date();
      d.setUTCFullYear(1900, 0, 1);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    }
    // Constrói o Date com valores numéricos explícitos em UTC
    // evitando ambiguidade de fuso horário em iOS Safari e outros browsers
    const [yearStr, monthStr, dayStr] = dateKey.split('-');
    const year  = parseInt(yearStr,  10);
    const month = parseInt(monthStr, 10) - 1; // 0-indexed
    const day   = parseInt(dayStr,   10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return new Date(0);
    }
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  }

  private formatDateLabel(date: Date): string {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(date);
  }

  private formatWeekdayLabel(date: Date): string {
    const weekday = new Intl.DateTimeFormat('pt-PT', {
      weekday: 'long',
      timeZone: 'UTC'
    }).format(date);

    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }

  private compareMatches(a: Match, b: Match): number {
    const timeDiff = this.timeToMinutes(a.time) - this.timeToMinutes(b.time);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return a.id - b.id;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = (time || '00:00').split(':').map(Number);
    return (Number.isFinite(hours) ? hours : 0) * 60 + (Number.isFinite(minutes) ? minutes : 0);
  }

  openClassificacaoModal(round: string) {
    this.classificacaoRound = round;
    this.showClassificacaoModal = true;
    this.loadingClassificacao = true;
    
    // Carregar classificação inicial
    this.loadClassificacao(round);
    
    // Iniciar auto-refresh da classificação
    this.startClassificacaoRefresh(round);
  }

  closeClassificacaoModal() {
    this.showClassificacaoModal = false;
    this.classificacao = [];
    this.classificacaoRound = '';
    
    // Parar auto-refresh da classificação
    this.stopClassificacaoRefresh();
  }

  private loadClassificacao(round: string) {
    this.tournamentService.getClassificacaoPorRound(round).subscribe({
      next: (classificacao: Classificacao[]) => {
        this.classificacao = classificacao;
        this.loadingClassificacao = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar classificação:', err);
        this.loadingClassificacao = false;
      }
    });
  }

  private startClassificacaoRefresh(round: string) {
    // Limpa qualquer intervalo existente
    this.stopClassificacaoRefresh();
    
    // Configura novo intervalo para atualizar classificação
    this.classificacaoRefreshInterval = setInterval(() => {
      // Recarrega classificação sem mostrar loading para não interferir na visualização
      this.tournamentService.getClassificacaoPorRound(round).subscribe({
        next: (classificacao: Classificacao[]) => {
          this.classificacao = classificacao;
        },
        error: (err: any) => {
          console.error('Erro no auto-refresh da classificação:', err);
        }
      });
    }, this.REFRESH_INTERVAL_MS);
  }

  private stopClassificacaoRefresh() {
    if (this.classificacaoRefreshInterval) {
      clearInterval(this.classificacaoRefreshInterval);
      this.classificacaoRefreshInterval = null;
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
