// src/types/league.ts

// ==========================================
// 1. USUÁRIOS E ACESSOS
// ==========================================
export type UserRole = 'admin' | 'moderator' | 'player' | 'fan';

export interface User {
  id: string; // Vai espelhar auth.users.id do Supabase
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

// ==========================================
// 2. ENTIDADES PRINCIPAIS (Normalizadas)
// ==========================================
export interface Team {
  id: string;
  name: string;
  shortName?: string; // Limite de 4 caracteres (ex: PALM)
  logoUrl?: string;
  foundationYear?: string;
  colors?: string; // Para a UI (ex: '#22c55e')
}

export interface Player {
  id: string;
  teamId: string; // Chave estrangeira
  userId?: string; // Opcional, vincula o jogador a um usuário real do app
  name: string;
  number?: number;
  position?: string;
  photoUrl?: string;
}

// ==========================================
// 3. COMPETIÇÕES
// ==========================================
export interface League {
  id: string;
  name: string;
  season: string;
  logoUrl?: string;
}

export interface Tournament {
  id: string;
  leagueId: string; // Chave estrangeira
  name: string;
  type: 'league' | 'cup';
  season: string;
  status: 'draft' | 'ongoing' | 'finished';
}

export interface Match {
  id: string;
  tournamentId: string; // Chave estrangeira
  homeTeamId: string; // Chave estrangeira (substitui o objeto inteiro Team)
  awayTeamId: string; // Chave estrangeira (substitui o objeto inteiro Team)
  homeScore?: number;
  awayScore?: number;
  date: string;
  round?: string;
  status: 'scheduled' | 'live' | 'finished';
}

// ==========================================
// 4. EVENTOS E ESTATÍSTICAS (Novo Modelo Relacional)
// ==========================================
export type EventType = 'goal' | 'assist' | 'yellow_card' | 'red_card';

export interface MatchEvent {
  id: string;
  matchId: string; // Chave estrangeira
  playerId: string; // Chave estrangeira
  type: EventType;
  minute?: number;
}

export interface Podium {
  id: string;
  tournamentId: string; // Chave estrangeira
  firstPlaceId: string; // Chave estrangeira
  secondPlaceId: string; // Chave estrangeira
  thirdPlaceId: string; // Chave estrangeira
}

// ==========================================
// 5. MÍDIA E AUDITORIA
// ==========================================
export interface MediaItem {
  id: string;
  tournamentId?: string; // Chave estrangeira
  type: 'photo' | 'video';
  url: string;
  caption?: string;
  date: string;
}

export interface AuditLog {
  id: string;
  userId: string; // Chave estrangeira
  action: 'create' | 'update' | 'delete';
  entity: 'team' | 'player' | 'match' | 'tournament';
  entityId: string;
  description: string;
  timestamp: string;
}