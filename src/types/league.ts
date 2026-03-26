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

// Para suportar estatísticas POR competição (Documentação Viva)
export interface CompetitionStats {
  competitionId: string;
  playerId: string;
  goals: number;
  assists: number;
}

// 1. Definição de Papéis (Roles) para o sistema de permissões
export type UserRole = 'admin' | 'moderator' | 'player' | 'fan';

// 2. Interface de Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string; // Vinculado se o papel for 'player'
  avatarUrl?: string;
  createdAt: string;
}

// 3. Sistema de Auditoria (Logs)
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete';
  entity: 'team' | 'player' | 'match' | 'tournament';
  entityId: string;
  description: string; // Ex: "Alterou o placar do jogo m1 de 1x0 para 1x1"
  timestamp: string;
}

// 4. Extensão de Jogador para incluir vinculo com Usuário
// (Mantendo a compatibilidade com o que você já tem)
export interface Player {
  id: string;
  userId?: string; // Liga o perfil de atleta a uma conta de usuário
  name: string;
  number?: number;
  position?: string;
  photo?: string;
  teamId: string;
  stats?: PlayerStats;
}