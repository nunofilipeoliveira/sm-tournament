import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Match, Classificacao } from '../models/tournament.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client | null = null;
  private connected = false;

  // Subjects para broadcast de updates
  private gamesUpdateSubject = new Subject<Match[]>();
  private gameUpdateSubject = new Subject<Match>();
  private classificacaoUpdateSubject = new Subject<{ round: string; classificacao: Classificacao[] }>();
  private connectionStatusSubject = new Subject<boolean>();

  constructor() {}

  /**
   * Conecta ao servidor WebSocket
   */
  connect(): void {
    if (this.connected) {
      console.log('📡 WebSocket já conectado');
      return;
    }

    const serverUrl = `${environment.apiUrl}/ws-tournament`;
    console.log('📡 Conectando ao WebSocket:', serverUrl);

    this.client = new Client({
      webSocketFactory: () => new SockJS(serverUrl) as any,
      debug: (msg: string) => {
        console.log('🔍 WebSocket Debug:', msg);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log('✅ WebSocket conectado com sucesso!');
        this.connectionStatusSubject.next(true);
        this.subscribeToTopics();
      },
      onDisconnect: () => {
        this.connected = false;
        console.log('❌ WebSocket desconectado');
        this.connectionStatusSubject.next(false);
      },
      onStompError: (frame: any) => {
        console.error('❌ Erro STOMP:', frame);
      }
    });

    this.client.activate();
  }

  /**
   * Subscreve aos tópicos do servidor
   */
  private subscribeToTopics(): void {
    if (!this.client || !this.connected) {
      return;
    }

    // Subscrever a atualizações gerais de jogos
    this.client.subscribe('/topic/games', (message: any) => {
      console.log('📥 Recebido update de jogos');
      // Dispara evento para recarregar todos os jogos
      this.gamesUpdateSubject.next([]);
    });

    // Subscrever a atualizações de jogo individual
    this.client.subscribe('/topic/game/*', (message: any) => {
      const game = JSON.parse(message.body);
      console.log('📥 Recebido update do jogo:', game.id);
      this.gameUpdateSubject.next(game);
    });

    // Subscrever a atualizações de classificação
    this.client.subscribe('/topic/classificacao/*', (message: any) => {
      const data = JSON.parse(message.body);
      console.log('📥 Recebido update de classificação');
      // Extrai o round do destino
      const destination = message.headers.destination;
      const round = destination.split('/').pop();
      this.classificacaoUpdateSubject.next({ round, classificacao: data });
    });

    console.log('✅ Subscrito a todos os tópicos WebSocket');
  }

  /**
   * Desconecta do servidor WebSocket
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      console.log('🔌 WebSocket desconectado');
    }
  }

  /**
   * Observable para updates de jogos
   */
  onGamesUpdate(): Observable<Match[]> {
    return this.gamesUpdateSubject.asObservable();
  }

  /**
   * Observable para update de jogo individual
   */
  onGameUpdate(): Observable<Match> {
    return this.gameUpdateSubject.asObservable();
  }

  /**
   * Observable para updates de classificação
   */
  onClassificacaoUpdate(): Observable<{ round: string; classificacao: Classificacao[] }> {
    return this.classificacaoUpdateSubject.asObservable();
  }

  /**
   * Observable para status de conexão
   */
  onConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this.connected;
  }
}
