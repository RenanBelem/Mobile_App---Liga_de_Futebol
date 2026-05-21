// Gerenciamento de estado global para dados do app
// Persiste em localStorage (antes da integração com Supabase)

import { User, Player, Team } from '@/types/league';

const STORAGE_USERS = 'lfa_users';
const STORAGE_PLAYERS = 'lfa_players';
const STORAGE_TEAMS = 'lfa_teams';

// ==========================================
// USUÁRIOS
// ==========================================
export function addUser(user: Omit<User, 'id' | 'createdAt'>) {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `u${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  return newUser;
}

export function getUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_USERS);
  return stored ? JSON.parse(stored) : [];
}

// ==========================================
// JOGADORES
// ==========================================
export function addPlayer(player: Omit<Player, 'id'>) {
  const players = getPlayers();
  const newPlayer: Player = {
    ...player,
    id: `p${Date.now()}`,
  };
  players.push(newPlayer);
  localStorage.setItem(STORAGE_PLAYERS, JSON.stringify(players));
  console.log('✅ Jogador salvo em localStorage:', newPlayer);
  return newPlayer;
}

export function getPlayers(): Player[] {
  const stored = localStorage.getItem(STORAGE_PLAYERS);
  return stored ? JSON.parse(stored) : [];
}

// ==========================================
// TIMES
// ==========================================
export function addTeam(team: Omit<Team, 'id'>) {
  const teams = getTeams();
  const newTeam: Team = {
    ...team,
    id: `tm${Date.now()}`,
  };
  teams.push(newTeam);
  localStorage.setItem(STORAGE_TEAMS, JSON.stringify(teams));
  console.log('✅ Time salvo em localStorage:', newTeam);
  return newTeam;
}

export function getTeams(): Team[] {
  const stored = localStorage.getItem(STORAGE_TEAMS);
  return stored ? JSON.parse(stored) : [];
}

// ==========================================
// EXPORTAR DADOS
// ==========================================
export function getAllData() {
  return {
    users: getUsers(),
    players: getPlayers(),
    teams: getTeams(),
  };
}

export function exportToJSON() {
  const data = getAllData();
  return JSON.stringify(data, null, 2);
}

export function clearAll() {
  localStorage.removeItem(STORAGE_USERS);
  localStorage.removeItem(STORAGE_PLAYERS);
  localStorage.removeItem(STORAGE_TEAMS);
  console.log('✅ Todos os dados foram limpos');
}
