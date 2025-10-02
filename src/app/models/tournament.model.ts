export interface Team {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  court: number;
  time: string; // formato HH:mm
  round: string;
  homeTeam?: Team | string; // string para "Vencedor 1", "Vencido 2", etc.
  awayTeam?: Team | string;
  status: 'scheduled' | 'in-progress' | 'completed';
  result?: string; // exemplo: "3-2"
}

export interface Tournament {
  matches: Match[];
  teams: Team[];
}