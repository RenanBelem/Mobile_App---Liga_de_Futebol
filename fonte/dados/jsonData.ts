import leaguesData from '@/dados/json/ligas.json';
import teamsData from '@/dados/json/times.json';
import playersData from '@/dados/json/jogadores.json';
import tournamentsData from '@/dados/json/torneios.json';
import matchesData from '@/dados/json/partidas.json';
import matchEventsData from '@/dados/json/eventos_partida.json';
import mediaData from '@/dados/json/midias.json';
import usersData from '@/dados/json/usuarios.json';
import podiumsData from '@/dados/json/podios.json';
import standingsData from '@/dados/json/standings.json';
import seasonsData from '@/dados/json/temporadas.json';
import competitionsData from '@/dados/json/competicoes.json';

export const jsonLeagueData = {
  leagues: leaguesData.leagues ?? [],
  seasons: seasonsData.seasons ?? [],
  competitions: competitionsData.competitions ?? [],
  teams: teamsData.teams ?? [],
  players: playersData.players ?? [],
  tournaments: tournamentsData.tournaments ?? [],
  matches: matchesData.matches ?? [],
  matchEvents: matchEventsData.match_events ?? [],
  media: mediaData.media ?? [],
  users: usersData.users ?? [],
  podiums: podiumsData.podiums ?? [],
  standings: standingsData.standings ?? [],
};
