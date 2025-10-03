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
  status: 'scheduled' | 'in-progress' | 'completed';
  result?: string; // exemplo: "3-2"
  round: string; // exemplo: "Meia-final", "Final", etc.
  win_teamid: number; // opcional, para jogos concluídos
  lose_teamid: number; // opcional, para jogos concluídos
  win_team: string; // opcional, para jogos concluídos
  lose_team: string; // opcional, para jogos concluídos
  idjogo_homeTeam:number; // opcional, para jogos concluídos
  idjogo_awayTeam: number; // opcional, para jogos concluídos
}

export interface Tournament {
  matches: Match[];
  teams: Team[];
}