import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tournament, Match, Team } from '../models/tournament.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TournamentService {

 




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


  saveMatch(match: Match) {
    const headers = { 'Content-Type': 'application/json' };
    const url = environment.apiUrl + "/sm/saveMatch";
    return this.http.put<boolean>(url, match, { headers });
  }

  resetMatch(match: Match) {
    const headers = { 'Content-Type': 'application/json' };
    const url = environment.apiUrl + "/sm/resetMatch";
    return this.http.put<boolean>(url, match, { headers });
  }

  
}