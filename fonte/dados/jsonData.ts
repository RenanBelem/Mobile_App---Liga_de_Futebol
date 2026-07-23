import leaguesData from '@/dados/json/leagues.json';
import teamsData from '@/dados/json/teams.json';
import playersData from '@/dados/json/players.json';
import tournamentsData from '@/dados/json/tournaments.json';
import matchesData from '@/dados/json/matches.json';
import mediaData from '@/dados/json/media.json';
import usersData from '@/dados/json/users.json';
import podiumsData from '@/dados/json/podiums.json';
import standingsData from '@/dados/json/standings.json';
import seasonsData from '@/dados/json/seasons.json';
import competitionsData from '@/dados/json/competitions.json';

export const jsonLeagueData = {
  leagues: leaguesData.leagues ?? [],
  seasons: seasonsData.seasons ?? [],
  competitions: competitionsData.competitions ?? [],
  teams: teamsData.teams ?? [],
  players: playersData.players ?? [],
  tournaments: tournamentsData.tournaments ?? [],
  matches: matchesData.matches ?? [],
  media: mediaData.media ?? [],
  users: usersData.users ?? [],
  podiums: podiumsData.podiums ?? [],
  standings: standingsData.standings ?? [],
};
