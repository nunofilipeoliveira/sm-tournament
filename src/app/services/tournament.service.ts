import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tournament, Match, Team } from '../models/tournament.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TournamentService {

  private initialData: Tournament = {
    teams: [
      { id: 1, name: 'Leões FC' },
      { id: 2, name: 'Águias SC' },
      { id: 3, name: 'Tigres FC' },
      { id: 4, name: 'Lobos AC' }
    ],
    matches: [
      {
        id: 1,
        court: 1,
        time: '09:00',
        round: 'Meia-final',
        homeTeam: 'Leões FC',
        awayTeam: 'Águias SC',
        status: 'completed',
        result: '2-0',
        homeTeamId: 0,
        awayTeamId: 0,
        win_teamid: 0,
        lose_teamid: 0,
        win_team: '',
        lose_team: '',
        idjogo_homeTeam: 0,
        idjogo_awayTeam: 0
      },
      {
        id: 2,
        court: 2,
        time: '09:00',
        round: 'Meia-final',
        homeTeam: 'Tigres FC',
        awayTeam: 'Lobos AC',
        status: 'completed',
        result: '2-0',
        homeTeamId: 0,
        awayTeamId: 0,
        win_teamid: 0,
        lose_teamid: 0,
        win_team: '',
        lose_team: '',
        idjogo_homeTeam: 0,
        idjogo_awayTeam: 0
      },
      {
        id: 3,
        court: 1,
        time: '11:00',
        round: '3º/4º Lugar',
        homeTeam: 'Águias SC',
        awayTeam: 'Lobos AC',
        status: 'scheduled',
        result: '2-0',
        homeTeamId: 0,
        awayTeamId: 0,
        win_teamid: 0,
        lose_teamid: 0,
        win_team: '',
        lose_team: '',
        idjogo_homeTeam: 0,
        idjogo_awayTeam: 0
      },
      {
        id: 4,
        court: 2,
        time: '11:00',
        round: 'Final',
        homeTeam: 'Leões FC',
        awayTeam: 'Tigres FC',
        status: 'in-progress',
        result: '',
        homeTeamId: 0,
        awayTeamId: 0,
        win_teamid: 0,
        lose_teamid: 0,
        win_team: '',
        lose_team: '',
        idjogo_homeTeam: 0,
        idjogo_awayTeam: 0
      }
    ]
  };

  private tournamentSubject = new BehaviorSubject<Tournament>(this.initialData);
  tournament$ = this.tournamentSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Carrega todos os jogos do backend e atualiza o estado local.
   */
  loadAllGames() {
    const headers = { 'Content-Type': 'application/json' };
    const url = environment.apiUrl + "/sm/loadAllGames";
    // O corpo está vazio, mas pode ser adaptado caso precises de enviar dados
    return this.http.put<Array<Match>>(url, {}, { headers });
  }

  /**
   * Atualiza o resultado de um jogo.
   */
  updateMatchResult(
    matchId: number,
    result: string,
    homeTeam?: string,
    awayTeam?: string
  ) {
    const tournament = this.tournamentSubject.value;
    const matches: Match[] = tournament.matches.map(match =>
      match.id === matchId
        ? {
            ...match,
            result,
            homeTeam: homeTeam || match.homeTeam,
            awayTeam: awayTeam || match.awayTeam,
            status: 'completed' as 'completed'
          }
        : match
    );
    this.tournamentSubject.next({ ...tournament, matches });
  }

  /**
   * Atualiza o status de um jogo.
   */
  setMatchStatus(matchId: number, status: 'scheduled' | 'in-progress' | 'completed') {
    const tournament = this.tournamentSubject.value;
    const matches: Match[] = tournament.matches.map(match =>
      match.id === matchId
        ? { ...match, status: status as 'scheduled' | 'in-progress' | 'completed' }
        : match
    );
    this.tournamentSubject.next({ ...tournament, matches });
  }

  /**
   * Adiciona outros métodos conforme necessário...
   */
}