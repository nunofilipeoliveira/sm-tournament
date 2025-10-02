import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tournament, Match, Team } from '../models/tournament.model';

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
        result: '3-2'
      },
      {
        id: 2,
        court: 2,
        time: '09:00',
        round: 'Meia-final',
        homeTeam: 'Tigres FC',
        awayTeam: 'Lobos AC',
        status: 'completed',
        result: '2-0'
      },
      {
        id: 3,
        court: 1,
        time: '11:00',
        round: '3º/4º Lugar',
        homeTeam: 'Águias SC',
        awayTeam: 'Lobos AC',
        status: 'scheduled'
      },
      {
        id: 4,
        court: 2,
        time: '11:00',
        round: 'Final',
        homeTeam: 'Leões FC',
        awayTeam: 'Tigres FC',
        status: 'in-progress'
      }
    ]
  };

  private tournamentSubject = new BehaviorSubject<Tournament>(this.initialData);
  tournament$ = this.tournamentSubject.asObservable();

  // ... métodos (como já tens)


  updateMatchResult(matchId: number, result: string, homeTeam?: string, awayTeam?: string) {
    const tournament = this.tournamentSubject.value;
    const matches: Match[] = tournament.matches.map(match =>
      match.id === matchId
        ? { ...match, result, homeTeam: homeTeam || match.homeTeam, awayTeam: awayTeam || match.awayTeam, status: 'completed' as 'completed' }
        : match
    );
    this.tournamentSubject.next({ ...tournament, matches });
  }

  setMatchStatus(matchId: number, status: 'scheduled' | 'in-progress' | 'completed') {
    const tournament = this.tournamentSubject.value;
    const matches: Match[] = tournament.matches.map(match =>
      match.id === matchId
        ? { ...match, status: status as 'scheduled' | 'in-progress' | 'completed' }
        : match
    );
    this.tournamentSubject.next({ ...tournament, matches });
  }
}