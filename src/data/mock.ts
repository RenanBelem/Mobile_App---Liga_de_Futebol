import { 
  Team, 
  Tournament, 
  Match, 
  MediaItem, 
  League, 
  Player, 
  User,
  MatchEvent,
  Podium,
  UserRole
} from '@/types/league';

// ==========================================
// 1. USUÁRIOS
// ==========================================
export const currentUser: User = {
  id: 'u1',
  name: 'Administrador do Sistema',
  email: 'admin@liga.com',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z'
};

// ==========================================
// 2. TIMES (Normalizados, sem array de players dentro)
// ==========================================
export const teams: Team[] = [
  { id: '1', name: 'Trovão FC', colors: '#22c55e' },
  { id: '2', name: 'Águias United', colors: '#3b82f6' },
  { id: '3', name: 'Fênix SC', colors: '#ef4444' },
  { id: '4', name: 'Titãs EC', colors: '#f59e0b' },
];

// ==========================================
// 3. JOGADORES (Normalizados, referenciando teamId)
// ==========================================
export const players: Player[] = [
  // Trovão FC (teamId: '1')
  { id: 'p1', name: 'Carlos Silva', number: 10, position: 'Atacante', teamId: '1' },
  { id: 'p2', name: 'Bruno Santos', number: 1, position: 'Goleiro', teamId: '1' },
  { id: 'p3', name: 'Marcos Lima', number: 7, position: 'Meia', teamId: '1' },
  // Águias United (teamId: '2')
  { id: 'p4', name: 'Rafael Costa', number: 9, position: 'Atacante', teamId: '2' },
  { id: 'p5', name: 'Diego Alves', number: 5, position: 'Zagueiro', teamId: '2' },
  // Fênix SC (teamId: '3')
  { id: 'p6', name: 'Lucas Oliveira', number: 11, position: 'Ponta', teamId: '3' },
  // Titãs EC (teamId: '4')
  { id: 'p7', name: 'André Souza', number: 8, position: 'Volante', teamId: '4' },
];

// ==========================================
// 4. PARTIDAS (Normalizadas, usando homeTeamId e awayTeamId)
// ==========================================
export const matches: Match[] = [
  { id: 'm1', tournamentId: 't1', homeTeamId: '1', awayTeamId: '2', homeScore: 3, awayScore: 1, date: '2026-03-10', round: 'Rodada 1', status: 'finished' },
  { id: 'm2', tournamentId: 't1', homeTeamId: '3', awayTeamId: '4', homeScore: 2, awayScore: 2, date: '2026-03-10', round: 'Rodada 1', status: 'finished' },
  { id: 'm3', tournamentId: 't1', homeTeamId: '2', awayTeamId: '3', homeScore: 1, awayScore: 0, date: '2026-03-17', round: 'Rodada 2', status: 'finished' },
  { id: 'm4', tournamentId: 't1', homeTeamId: '4', awayTeamId: '1', homeScore: 0, awayScore: 4, date: '2026-03-17', round: 'Rodada 2', status: 'finished' },
  { id: 'm5', tournamentId: 't1', homeTeamId: '1', awayTeamId: '3', date: '2026-03-24', round: 'Rodada 3', status: 'scheduled' },
  { id: 'm6', tournamentId: 't1', homeTeamId: '2', awayTeamId: '4', date: '2026-03-24', round: 'Rodada 3', status: 'scheduled' },
];

// ==========================================
// 5. EVENTOS DA PARTIDA (Substitui as estatísticas fixas)
// ==========================================
export const matchEvents: MatchEvent[] = [
  // Eventos do jogo m1 (Trovão 3x1 Águias)
  { id: 'e1', matchId: 'm1', playerId: 'p1', type: 'goal', minute: 15 }, // Gol do Carlos Silva
  { id: 'e2', matchId: 'm1', playerId: 'p3', type: 'assist', minute: 15 }, // Assistência do Marcos Lima
  { id: 'e3', matchId: 'm1', playerId: 'p4', type: 'goal', minute: 45 }, // Gol do Rafael Costa
];

// ==========================================
// 6. TORNEIOS E PÓDIOS
// ==========================================
export const podiums: Podium[] = [
  { id: 'pod1', tournamentId: 't2', firstPlaceId: '1', secondPlaceId: '2', thirdPlaceId: '3' },
  { id: 'pod2', tournamentId: 't3', firstPlaceId: '3', secondPlaceId: '1', thirdPlaceId: '4' }
];

export const tournaments: Tournament[] = [
  { id: 't1', name: 'Campeonato Principal 2026', leagueId: 'l1', type: 'league', season: '2026', status: 'ongoing' },
  { id: 't2', name: 'Copa da Amizade 2025', leagueId: 'l1', type: 'cup', season: '2025', status: 'finished' },
  { id: 't3', name: 'Supercopa 2025', leagueId: 'l1', type: 'cup', season: '2025', status: 'finished' },
];

export const league: League = {
  id: 'l1',
  name: 'Liga de Futebol',
  season: '2026',
};

// ==========================================
// 7. MÍDIA
// ==========================================
export const mediaItems: MediaItem[] = [
  { id: 'md1', type: 'photo', url: '', caption: 'Final do Campeonato 2025', tournamentId: 't2', date: '2025-12-15' },
  { id: 'md2', type: 'photo', url: '', caption: 'Gol de Carlos Silva', tournamentId: 't1', date: '2026-03-10' },
  { id: 'md3', type: 'video', url: '', caption: 'Melhores momentos - Rodada 1', tournamentId: 't1', date: '2026-03-10' },
];

// ==========================================
// FUNÇÕES UTILITÁRIAS PARA O FRONT-END
// ==========================================

// Retorna os jogadores de um time específico
export const getPlayersByTeam = (teamId: string): Player[] => {
  return players.filter(p => p.teamId === teamId);
};

// Retorna as partidas de um torneio específico
export const getMatchesByTournament = (tournamentId: string): Match[] => {
  return matches.filter(m => m.tournamentId === tournamentId);
};

// Retorna o time inteiro dado um ID
export const getTeamById = (teamId: string): Team | undefined => {
  return teams.find(t => t.id === teamId);
};