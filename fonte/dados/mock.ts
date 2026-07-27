/**
 * SRC/dados/MOCK.TS
 * ===============================
 * PROPÓSITO: Dados mockados/simulados para desenvolvimento
 * - Fornece 25 times da liga com cores, logos e nomes
 * - Inclui usuário admin simulado
 * - Contém dados de jogadores, torneios e partidas
 * - Facilita desenvolvimento sem dependência de backend
 * MOTIVO: Arquivo essencial para desenvolvimento local sem API,
 * permitindo testar UI e lógica com dados realistas
 */
import { 
  Team, 
  Tournament, 
  Match, 
  League, 
  Player, 
  User,
  MatchEvent,
  Podium,
  UserRole
} from '@/tipos/league';

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
// 2. TIMES - 25 Times da Liga Antifascista
// ==========================================
export const teams: Team[] = [
  { id: '1', name: 'CF Estrela Vermelha', colors: '#dc2626' },
  { id: '2', name: 'Guairacá Futebol Ancestral', colors: '#84cc16' },
  { id: '3', name: 'Deportivo Oriental', colors: '#0ea5e9' },
  { id: '4', name: 'Sankara', colors: '#f59e0b' },
  { id: '5', name: 'Primavera', colors: '#ec4899' },
  { id: '6', name: 'Teto Preto', colors: '#1f2937' },
  { id: '7', name: 'Pé de Pano', colors: '#6366f1' },
  { id: '8', name: 'Locomotiva Makhnovista F.S.C.', colors: '#14b8a6' },
  { id: '9', name: 'Resistência Alviverde', colors: '#10b981' },
  { id: '10', name: 'Azulão', colors: '#3b82f6' },
  { id: '11', name: 'Bolchesítio', colors: '#ef4444' },
  { id: '12', name: 'Linha Esquerda FR', colors: '#8b5cf6' },
  { id: '13', name: 'América de Calo', colors: '#f97316' },
  { id: '14', name: 'Aqui Estamos', colors: '#06b6d4' },
  { id: '15', name: '9-Dedos', colors: '#a16207' },
  { id: '16', name: 'Imperial RSports', colors: '#991b1b' },
  { id: '17', name: 'Toque de Classe Associação Desportiva', colors: '#7c3aed' },
  { id: '18', name: 'Brigada Lupicínia F.C.', colors: '#16a34a' },
  { id: '19', name: 'Liverpanças FC', colors: '#0369a1' },
  { id: '20', name: 'Caos da Villa', colors: '#ea580c' },
  { id: '21', name: 'Baianos de Mauá FC', colors: '#f59e0b' },
  { id: '22', name: 'St. Paulo Freire', colors: '#4f46e5' },
  { id: '23', name: 'Clube Atlético Zapatista', colors: '#1e40af' },
  { id: '24', name: 'Faixa Preta', colors: '#000000' },
  { id: '25', name: 'Umbabarauma', colors: '#92400e' }
];

// ==========================================
// 3. JOGADORES (Normalizados, referenciando teamId)
// ==========================================
export const players: Player[] = [
  { id: 'p1', name: 'Carlos Silva', number: 10, position: 'Atacante', teamId: '1' },
  { id: 'p2', name: 'Bruno Santos', number: 1, position: 'Goleiro', teamId: '1' },
  { id: 'p3', name: 'Marcos Lima', number: 7, position: 'Meia', teamId: '1' },
  { id: 'p4', name: 'Rafael Costa', number: 9, position: 'Atacante', teamId: '3' },
  { id: 'p5', name: 'Diego Alves', number: 5, position: 'Zagueiro', teamId: '3' },
  { id: 'p6', name: 'Lucas Oliveira', number: 11, position: 'Ponta', teamId: '7' },
  { id: 'p7', name: 'André Souza', number: 8, position: 'Volante', teamId: '8' },
  { id: 'p8', name: 'Felipe Rocha', number: 4, position: 'Zagueiro', teamId: '1' },
  { id: 'p9', name: 'Gustavo Mendes', number: 6, position: 'Meia-defensor', teamId: '5' },
  { id: 'p10', name: 'Thiago Ferreira', number: 10, position: 'Meia', teamId: '12' },
];

// ==========================================
// 4. PARTIDAS (Normalizadas, usando homeTeamId e awayTeamId)
// ==========================================
export const matches: Match[] = [
  { id: 'm1', tournamentId: 't1', homeTeamId: '1', awayTeamId: '2', homeScore: 3, awayScore: 1, date: '2026-03-10', round: 'Rodada 1', status: 'finished' },
  { id: 'm2', tournamentId: 't1', homeTeamId: '3', awayTeamId: '4', homeScore: 2, awayScore: 2, date: '2026-03-10', round: 'Rodada 1', status: 'finished' },
  { id: 'm3', tournamentId: 't1', homeTeamId: '5', awayTeamId: '6', homeScore: 1, awayScore: 0, date: '2026-03-17', round: 'Rodada 2', status: 'finished' },
  { id: 'm4', tournamentId: 't1', homeTeamId: '7', awayTeamId: '8', homeScore: 2, awayScore: 2, date: '2026-03-17', round: 'Rodada 2', status: 'finished' },
  { id: 'm5', tournamentId: 't1', homeTeamId: '1', awayTeamId: '3', date: '2026-03-24', round: 'Rodada 3', status: 'scheduled' },
  { id: 'm6', tournamentId: 't1', homeTeamId: '2', awayTeamId: '4', date: '2026-03-24', round: 'Rodada 3', status: 'scheduled' },
];

// ==========================================
// 5. EVENTOS DA PARTIDA
// ==========================================
export const matchEvents: MatchEvent[] = [
  { id: 'e1', matchId: 'm1', playerId: 'p1', type: 'goal', minute: 15 },
  { id: 'e2', matchId: 'm1', playerId: 'p3', type: 'assist', minute: 15 },
  { id: 'e3', matchId: 'm1', playerId: 'p4', type: 'goal', minute: 45 },
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
  name: 'Liga Antifascista de Futebol',
  season: '2026',
};

// ==========================================
// FUNÇÕES UTILITÁRIAS PARA O FRONT-END
// ==========================================

export const getPlayersByTeam = (teamId: string): Player[] => {
  return players.filter(p => p.teamId === teamId);
};

export const getMatchesByTournament = (tournamentId: string): Match[] => {
  return matches.filter(m => m.tournamentId === tournamentId);
};

export const getTeamById = (teamId: string): Team | undefined => {
  return teams.find(t => t.id === teamId);
};