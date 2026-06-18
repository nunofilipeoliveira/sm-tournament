export interface Team {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  tier: string; // exemplo: Sub-9, Sub-11, Sub-13, etc.
  court: number;
  time: string; // formato HH:mm
  homeTeamId?: number; // ID do time da casa, opcional
  awayTeamId?: number; // ID do time visitante, opcional
  homeTeam?: Team | string; // string para "Vencedor 1", "Vencido 2", etc.
  awayTeam?: Team | string;
  goalsHomeTeam?: number; // opcional, para jogos concluídos
  goalsAwayTeam?: number; // opcional, para jogos concluídos
  status: 'scheduled' | 'in-progress' | 'completed';
  result?: string; // exemplo: "3-2"
  round: string; // exemplo: "Meia-final", "Final", etc.
  date: string; // formato YYYY-MM-DD
  round_number?: string;
  round_action?: string;
  hasTable?: boolean; // Indica se o jogo possui tabela associada
  

}

export interface Tournament {
  matches: Match[];
  teams: Team[];
}

export interface Classificacao {
  posicao: number;
  teamId: number;
  teamName: string;
  jogos: number;
  pontos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golosMarcados: number;
  golosSofridos: number;
  diferencaGolos: number;
  hasLiveMatch?: boolean;
}
