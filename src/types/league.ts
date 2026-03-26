export interface Team {
  id: string;
  name: string;
  logo?: string;
  founded?: string;
  colors?: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  number?: number;
  position?: string;
  photo?: string;
  teamId: string;
  stats?: PlayerStats;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  gamesPlayed: number;
}

export interface League {
  id: string;
  name: string;
  season: string;
  logo?: string;
  tournaments: Tournament[];
}

export interface Tournament {
  id: string;
  name: string;
  leagueId: string;
  type: 'league' | 'cup';
  season: string;
  status: 'upcoming' | 'ongoing' | 'finished';
  matches: Match[];
  standings: StandingEntry[];
  podium?: Podium;
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  date: string;
  round?: string;
  status: 'scheduled' | 'live' | 'finished';
}

export interface StandingEntry {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Podium {
  first: Team;
  second: Team;
  third: Team;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  tournamentId?: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

// Para suportar estatísticas POR competição (Documentação Viva)
export interface CompetitionStats {
  competitionId: string;
  playerId: string;
  goals: number;
  assists: number;
}