import { Team, Tournament, Match, StandingEntry, MediaItem, League, Player } from '@/types/league';

const players: Record<string, Player[]> = {
  '1': [
    { id: 'p1', name: 'Carlos Silva', number: 10, position: 'Atacante', teamId: '1', stats: { goals: 12, assists: 5, yellowCards: 2, redCards: 0, gamesPlayed: 10 } },
    { id: 'p2', name: 'Bruno Santos', number: 1, position: 'Goleiro', teamId: '1', stats: { goals: 0, assists: 0, yellowCards: 1, redCards: 0, gamesPlayed: 10 } },
    { id: 'p3', name: 'Marcos Lima', number: 7, position: 'Meia', teamId: '1', stats: { goals: 6, assists: 8, yellowCards: 3, redCards: 1, gamesPlayed: 9 } },
  ],
  '2': [
    { id: 'p4', name: 'Rafael Costa', number: 9, position: 'Atacante', teamId: '2', stats: { goals: 9, assists: 3, yellowCards: 1, redCards: 0, gamesPlayed: 10 } },
    { id: 'p5', name: 'Diego Alves', number: 5, position: 'Zagueiro', teamId: '2', stats: { goals: 1, assists: 0, yellowCards: 4, redCards: 0, gamesPlayed: 10 } },
  ],
  '3': [
    { id: 'p6', name: 'Lucas Oliveira', number: 11, position: 'Ponta', teamId: '3', stats: { goals: 7, assists: 6, yellowCards: 2, redCards: 0, gamesPlayed: 10 } },
  ],
  '4': [
    { id: 'p7', name: 'André Souza', number: 8, position: 'Volante', teamId: '4', stats: { goals: 3, assists: 4, yellowCards: 5, redCards: 1, gamesPlayed: 10 } },
  ],
};

export const teams: Team[] = [
  { id: '1', name: 'Trovão FC', colors: '#22c55e', players: players['1'] },
  { id: '2', name: 'Águias United', colors: '#3b82f6', players: players['2'] },
  { id: '3', name: 'Fênix SC', colors: '#ef4444', players: players['3'] },
  { id: '4', name: 'Titãs EC', colors: '#f59e0b', players: players['4'] },
];

export const standings: StandingEntry[] = [
  { position: 1, team: teams[0], played: 10, won: 8, drawn: 1, lost: 1, goalsFor: 25, goalsAgainst: 8, points: 25 },
  { position: 2, team: teams[1], played: 10, won: 6, drawn: 2, lost: 2, goalsFor: 18, goalsAgainst: 10, points: 20 },
  { position: 3, team: teams[2], played: 10, won: 4, drawn: 3, lost: 3, goalsFor: 15, goalsAgainst: 14, points: 15 },
  { position: 4, team: teams[3], played: 10, won: 1, drawn: 2, lost: 7, goalsFor: 8, goalsAgainst: 22, points: 5 },
];

export const matches: Match[] = [
  { id: 'm1', tournamentId: 't1', homeTeam: teams[0], awayTeam: teams[1], homeScore: 3, awayScore: 1, date: '2026-03-10', round: 'Rodada 1', status: 'finished' },
  { id: 'm2', tournamentId: 't1', homeTeam: teams[2], awayTeam: teams[3], homeScore: 2, awayScore: 2, date: '2026-03-10', round: 'Rodada 1', status: 'finished' },
  { id: 'm3', tournamentId: 't1', homeTeam: teams[1], awayTeam: teams[2], homeScore: 1, awayScore: 0, date: '2026-03-17', round: 'Rodada 2', status: 'finished' },
  { id: 'm4', tournamentId: 't1', homeTeam: teams[3], awayTeam: teams[0], homeScore: 0, awayScore: 4, date: '2026-03-17', round: 'Rodada 2', status: 'finished' },
  { id: 'm5', tournamentId: 't1', homeTeam: teams[0], awayTeam: teams[2], date: '2026-03-24', round: 'Rodada 3', status: 'scheduled' },
  { id: 'm6', tournamentId: 't1', homeTeam: teams[1], awayTeam: teams[3], date: '2026-03-24', round: 'Rodada 3', status: 'scheduled' },
];

export const tournaments: Tournament[] = [
  {
    id: 't1',
    name: 'Campeonato Principal 2026',
    leagueId: 'l1',
    type: 'league',
    season: '2026',
    status: 'ongoing',
    matches,
    standings,
    podium: undefined,
  },
  {
    id: 't2',
    name: 'Copa da Amizade 2025',
    leagueId: 'l1',
    type: 'cup',
    season: '2025',
    status: 'finished',
    matches: matches.map(m => ({ ...m, tournamentId: 't2', status: 'finished' as const })),
    standings,
    podium: { first: teams[0], second: teams[1], third: teams[2] },
  },
  {
    id: 't3',
    name: 'Supercopa 2025',
    leagueId: 'l1',
    type: 'cup',
    season: '2025',
    status: 'finished',
    matches: [],
    standings: [],
    podium: { first: teams[2], second: teams[0], third: teams[3] },
  },
];

export const mediaItems: MediaItem[] = [
  { id: 'md1', type: 'photo', url: '', caption: 'Final do Campeonato 2025', tournamentId: 't2', date: '2025-12-15' },
  { id: 'md2', type: 'photo', url: '', caption: 'Gol de Carlos Silva', tournamentId: 't1', date: '2026-03-10' },
  { id: 'md3', type: 'video', url: '', caption: 'Melhores momentos - Rodada 1', tournamentId: 't1', date: '2026-03-10' },
];

export const league: League = {
  id: 'l1',
  name: 'Liga dos Amigos',
  season: '2026',
  tournaments,
};

// Alteração de interface por usuário
import { User } from '@/types/league';

export const currentUser: User = {
  id: 'u1',
  name: 'Administrador do Sistema',
  email: 'admin@liga.com',
  role: 'fan', // Altere para 'fan', 'player' ou 'moderator' para testar
  createdAt: '2026-01-01T00:00:00Z'
};