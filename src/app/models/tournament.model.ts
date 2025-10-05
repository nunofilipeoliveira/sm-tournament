export interface Team {
  id: number;
  name: string;
}

export interface Match {
  id: number;
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

}

export interface Tournament {
  matches: Match[];
  teams: Team[];
}