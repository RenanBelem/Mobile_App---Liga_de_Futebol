import { Team, Player, Tournament, Match, DocumentationItem, SeasonSummary, Podium } from '@/tipos/league';
import { jsonLeagueData } from '@/dados/jsonData';
import { getPlayers, getTeams, getTournaments } from '@/dados/state';

export type RouteEntity = 'teams' | 'players' | 'tournaments' | 'matches' | 'auth';

export interface HomeTournamentSummary extends Tournament {
  podium?: Podium;
}

export interface HomeOverview {
  league: { id: string; name: string; season: string };
  totalTournaments: number;
  totalMatches: number;
  recentMatches: Match[];
  upcomingMatches: Match[];
  finishedTournaments: HomeTournamentSummary[];
}

export interface TournamentScorerRow {
  playerId: string;
  playerName: string;
  teamName: string;
  goals: number;
}

export interface TournamentBestPlayerRow {
  playerId: string;
  playerName: string;
  teamName: string;
  playerOfMatchCount: number;
}

export interface TournamentPenaltyRow {
  playerId: string;
  playerName: string;
  teamName: string;
  yellowCards: number;
  redCards: number;
}

export interface TournamentSuspensionRow {
  playerId: string;
  playerName: string;
  teamName: string;
  startDate: string;
  endDate: string;
}

export interface TournamentStatistics {
  scorers: TournamentScorerRow[];
  bestPlayers: TournamentBestPlayerRow[];
  penalties: TournamentPenaltyRow[];
  suspensions: TournamentSuspensionRow[];
}

const normalizeForMatch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const sourceTeamNameLookup = jsonLeagueData.teams.map((team) => ({
  id: team.id,
  normalizedName: normalizeForMatch(team.name),
  normalizedSlug: normalizeForMatch(team.slug),
  normalizedAbbreviation: normalizeForMatch(team.abbreviation),
}));

const defaultTeamLogoUrl = '/logos/times/liga.PNG';
const knownTeamLogoByName: Array<{ match: string; path: string }> = [
  { match: 'estrela vermelha', path: '/logos/times/estrela.JPG' },
  { match: 'cf estrela vermelha', path: '/logos/times/estrela.JPG' },
  { match: 'atleticomuna', path: '/logos/times/atleticomuna.jpg' },
  { match: 'latinofuturista', path: '/logos/times/latinofuturista.png' },
];

const resolveTeamLogoUrl = (team: (typeof jsonLeagueData.teams)[number]): string => {
  const normalizedName = normalizeForMatch(team.name);
  const byName = knownTeamLogoByName.find((entry) => normalizedName.includes(entry.match));
  if (byName) {
    return byName.path;
  }

  const normalizedPath = (team.logo_url || '')
    .replace('/logos/teams/', '/logos/times/')
    .replace('/logos/time/', '/logos/times/');

  return normalizedPath || defaultTeamLogoUrl;
};

const resolveTeamIdFromMediaByName = (mediaItem: (typeof jsonLeagueData.media)[number]): string | undefined => {
  const normalizedBlob = normalizeForMatch([
    mediaItem.title,
    mediaItem.description,
    mediaItem.url,
    ...(mediaItem.tags ?? []),
  ].filter(Boolean).join(' '));

  const matched = sourceTeamNameLookup.find((team) =>
    [team.normalizedName, team.normalizedSlug, team.normalizedAbbreviation]
      .filter((token) => token.length >= 3)
      .some((token) => normalizedBlob.includes(token))
  );

  return matched?.id;
};

const sourceMedia = (jsonLeagueData.media ?? []).map((mediaItem) => {
  const explicitTeamId = 'team_id' in mediaItem ? mediaItem.team_id : undefined;
  const resolvedTeamId = explicitTeamId ?? resolveTeamIdFromMediaByName(mediaItem);

  return {
  id: mediaItem.id,
  liga_id: 'l1',
  temporada_id: undefined,
  partida_id: undefined,
  time_id: resolvedTeamId,
  tipo: mediaItem.type === 'video' ? 'video' : 'foto',
  url: mediaItem.url,
  url_thumbnail: mediaItem.thumbnail_url,
  legenda: mediaItem.description,
  titulo: mediaItem.title,
  categoria: 'json',
  escopo: 'liga',
  carregado_por: 'u-001',
  criado_em: mediaItem.created_at,
  tournament_id: mediaItem.tournament_id,
  team_id: resolvedTeamId,
};
});
const wikiTeamAchievements: Record<string, { titles: Array<{ competition: string; season: string; position: 'campeao' | 'vice' | 'terceiro' | 'quarto' }>; highlights: Array<{ competition: string; season: string; position: 'campeao' | 'vice' | 'terceiro' | 'quarto' }> }> = {
  '7': {
    titles: [{ competition: 'Taça Cecília', season: '2022-A', position: 'campeao' }, { competition: 'Taça Cecília', season: '2022-C', position: 'campeao' }, { competition: 'Taça Cecília', season: '2025-A', position: 'campeao' }],
    highlights: [{ competition: 'Copa Eric Cantona', season: '2025-A', position: 'campeao' }],
  },
  '15': {
    titles: [],
    highlights: [{ competition: 'Taça Cecília', season: '2025-A', position: 'vice' }],
  },
  '1': {
    titles: [{ competition: 'Copa Eric Cantona', season: '2025-A', position: 'campeao' }],
    highlights: [{ competition: 'Taça Cecília', season: '2025-A', position: 'terceiro' }],
  },
  '2': {
    titles: [{ competition: 'Taça Cecília', season: '2023-A', position: 'campeao' }, { competition: 'Taça Cecília', season: '2023-C', position: 'campeao' }, { competition: 'Taça Cecília', season: '2024-A', position: 'campeao' }, { competition: 'Taça Cecília', season: '2024-C', position: 'campeao' }],
    highlights: [{ competition: 'Taça Cecília', season: '2025-A', position: 'quarto' }],
  },
  '34': {
    titles: [{ competition: 'Taça Cecília', season: '2025-C', position: 'campeao' }],
    highlights: [{ competition: 'Taça Cecília', season: '2025-C', position: 'campeao' }],
  },
};
const sourceTeams = jsonLeagueData.teams.map((team) => ({
  id: team.id,
  nome: team.name,
  nome_curto: team.abbreviation,
  url_logo: resolveTeamLogoUrl(team),
  url_foto_capa: team.banner_url,
  url_uniforme_titular: team.logo_url,
  cor_primaria: team.colors,
  cor_secundaria: team.secondary_color,
  ano_fundacao: team.founded_year,
  cidade: team.city,
  alinhamento: team.description,
  descricao: team.description,
  historia: team.description,
  origem: team.city,
  ativo: team.is_active,
  slug: team.slug,
  titulos: wikiTeamAchievements[team.id]?.titles ?? [],
  campanhas_destaque: wikiTeamAchievements[team.id]?.highlights ?? [],
  criado_em: team.created_at,
  atualizado_em: team.updated_at,
}));
const sourceCompetitions = jsonLeagueData.competitions.map((competition) => ({
  id: competition.id,
  temporada_id: competition.season_id,
  nome: competition.name,
  slug: competition.slug,
  tipo: competition.type === 'copa' ? 'copa' : 'campeonato',
  formato: competition.format === 'eliminacao_direta' ? 'eliminacao_direta' : 'turno_unico',
  data_inicio: competition.start_date,
  data_fim: competition.end_date,
  status: competition.status === 'finalizada' ? 'finalizada' : competition.status === 'em_andamento' ? 'em_andamento' : 'rascunho',
  ordem: competition.order,
  descricao: competition.description,
  organizador: competition.organizer,
  url_logo: competition.logo_url,
  url_banner: competition.banner_url,
  criado_em: competition.created_at,
  atualizado_em: competition.updated_at,
}));
const sourceSeasons = jsonLeagueData.seasons.map((season) => ({
  id: season.id,
  liga_id: season.league_id,
  nome: season.name,
  slug: season.slug,
  ano: season.year,
  semestre: season.semester as 'apertura' | 'clausura',
  data_inicio: season.start_date,
  data_fim: season.end_date,
  status: season.status === 'finalizada' ? 'finalizada' : season.status === 'em_andamento' ? 'em_andamento' : 'rascunho',
  descricao: season.description,
  url_banner: season.banner_url,
  criado_em: season.created_at,
  atualizado_em: season.updated_at,
}));
const sourceMatches = (jsonLeagueData.matches ?? []).map((match) => ({
  id: match.id,
  competicao_id: match.tournament_id,
  time_casa_id: match.home_team_id,
  time_visitante_id: match.away_team_id,
  placar_casa: match.score_home,
  placar_visitante: match.score_away,
  data_hora: match.date,
  rodada: match.round ?? 'Rodada',
  local: match.location,
  status: match.status === 'finished' ? 'finalizada' : match.status === 'live' ? 'ao_vivo' : 'agendada',
  criado_em: match.created_at,
  atualizado_em: match.updated_at,
}));
const sourceMatchEvents = (jsonLeagueData.matchEvents ?? []).map((event) => ({
  id: event.id,
  match_id: event.match_id,
  player_id: event.player_id,
  team_id: event.team_id,
  type: event.type,
  minute: event.minute,
  created_at: event.created_at,
}));
const sourcePodiums = (jsonLeagueData.podiums ?? []).map((podium) => ({
  id: podium.id,
  tournament_id: podium.tournament_id,
  first_place_id: podium.first_place?.team_id,
  second_place_id: podium.second_place?.team_id,
  third_place_id: podium.third_place?.team_id,
  first_place_name: podium.first_place?.team_name,
  second_place_name: podium.second_place?.team_name,
  third_place_name: podium.third_place?.team_name,
}));
const sourcePlayers = (jsonLeagueData.players ?? []).map((player) => ({
  id: player.id,
  team_id: player.team_id,
  nome: player.name,
  apelido: player.name,
  url_foto: player.avatar_url,
  data_nascimento: player.birth_date,
  criado_em: player.created_at,
  atualizado_em: player.updated_at,
}));
const sourceTeamIds = sourceTeams.map((team) => team.id);
const sourceTournamentIds = sourceCompetitions.map((competicao) => competicao.id);

const mapTeamIdToLegacy = (sourceId: string, index: number) => String(index + 1);
const mapTournamentIdToLegacy = (sourceId: string, index: number) => `t${index + 1}`;
const resolveTeamSourceId = (teamId: string) => {
  const index = sourceTeamIds.findIndex((sourceId) => sourceId === teamId);
  return index >= 0 ? teamId : sourceTeamIds[Number(teamId) - 1] ?? teamId;
};
const resolveTournamentSourceId = (tournamentId: string) => {
  const index = sourceTournamentIds.findIndex((sourceId) => sourceId === tournamentId);
  return index >= 0 ? tournamentId : sourceTournamentIds[Number(tournamentId.replace('t', '')) - 1] ?? tournamentId;
};

const normalizeTeam = (team: (typeof sourceTeams)[number], index: number): Team => ({
  id: mapTeamIdToLegacy(team.id, index),
  name: team.nome,
  shortName: team.nome_curto,
  logoUrl: team.url_logo,
  foundationYear: team.ano_fundacao ? String(team.ano_fundacao) : undefined,
  colors: team.cor_primaria,
  description: team.descricao,
  biography: team.historia,
  history: team.historia,
  coverImageUrl: team.url_foto_capa,
  uniformUrl: team.url_uniforme_titular,
  slug: team.slug,
  titles: team.titulos,
  highlights: team.campanhas_destaque,
  photos: sourceMedia.filter((item) => item.time_id === team.id || item.team_id === team.id).map((item) => ({ url: item.url, caption: item.legenda }))
});
const normalizePodium = (podium: (typeof sourcePodiums)[number], index: number): Podium => ({
  id: podium.id || `podium-${index + 1}`,
  tournamentId: resolveTournamentSourceId(podium.tournament_id),
  firstPlaceId: podium.first_place_id ?? '',
  secondPlaceId: podium.second_place_id ?? '',
  thirdPlaceId: podium.third_place_id ?? '',
});

const normalizePlayer = (jogador: (typeof sourcePlayers)[number]): Player => {
  return {
    id: jogador.id,
    teamId: jogador.team_id ?? '',
    name: jogador.nome,
    number: undefined,
    position: undefined,
    photoUrl: jogador.url_foto,
  };
};

const normalizeTournament = (competicao: (typeof sourceCompetitions)[number], index: number): Tournament => {
  const temporada = sourceSeasons.find((item) => item.id === competicao.temporada_id);
  return {
    id: mapTournamentIdToLegacy(competicao.id, index),
    leagueId: 'liga-001',
    name: competicao.tipo === 'copa' ? competicao.nome : `Campeonato ${competicao.nome}`,
    type: competicao.tipo === 'copa' ? 'cup' : 'league',
    season: temporada?.nome ?? 'Temporada',
    status: competicao.status === 'finalizada' ? 'finished' : competicao.status === 'em_andamento' ? 'ongoing' : 'draft',
    description: competicao.descricao,
    format: competicao.formato === 'turno_unico' ? 'Pontos corridos' : competicao.formato === 'eliminacao_direta' ? 'Mata-mata' : 'Grupos + playoff',
    history: competicao.descricao,
    logoUrl: competicao.url_logo,
    bannerUrl: competicao.url_banner,
    editions: [{ season: temporada?.nome ?? 'Temporada', result: competicao.nome }],
    resultsSummary: [competicao.descricao ?? 'Resultados disponíveis na wiki'],
  };
};

const normalizeMatch = (partida: (typeof sourceMatches)[number]): Match => ({
  id: partida.id,
  tournamentId: resolveTournamentSourceId(partida.competicao_id),
  homeTeamId: resolveTeamSourceId(partida.time_casa_id),
  awayTeamId: resolveTeamSourceId(partida.time_visitante_id),
  homeScore: partida.placar_casa,
  awayScore: partida.placar_visitante,
  date: partida.data_hora,
  round: partida.rodada,
  status: partida.status === 'finalizada' ? 'finished' : partida.status === 'ao_vivo' ? 'live' : 'scheduled',
});

const baseTeams = sourceTeams.map((team, index) => normalizeTeam(team, index));
const localTeams = getTeams();
const teams = [...baseTeams, ...localTeams];
const podiums = sourcePodiums.map((podium, index) => normalizePodium(podium, index));
const basePlayers = sourcePlayers.map(normalizePlayer);
const localPlayers = getPlayers().map((player) => ({
  id: player.id,
  teamId: player.teamId ?? '',
  name: player.name,
  number: player.number,
  position: player.position,
  photoUrl: undefined,
}));
const players = [...basePlayers, ...localPlayers];
const baseTournaments = sourceCompetitions.map((competicao, index) => normalizeTournament(competicao, index));
const localTournaments = getTournaments().map((tournament) => ({
  ...tournament,
  id: tournament.id,
  leagueId: tournament.leagueId || 'liga-001',
  type: tournament.type || 'league',
  season: tournament.season || 'Temporada',
  status: tournament.status || 'draft',
}));
const tournaments = [...new Map([...baseTournaments, ...localTournaments].map((tournament) => [tournament.id, tournament])).values()];
const matches = sourceMatches.map(normalizeMatch);
const documentation = [
  {
    id: 'doc-001',
    title: 'Missão institucional',
    summary: 'A Liga Antifascista de Futebol organiza competições comunitárias com forte vínculo social e político.',
    category: 'institucional',
    content: 'A liga nasceu para reunir times populares, fortalecer o futebol de bairro e criar espaços de convivência e disputa saudável.',
  },
  {
    id: 'doc-002',
    title: 'Regulamento geral',
    summary: 'As competições seguem critérios de participação, fair play e respeito às pautas históricas da liga.',
    category: 'regulamento',
    content: 'Cada temporada é organizada em competições que valorizam a representatividade, o compromisso comunitário e a continuidade do projeto.',
  },
] satisfies DocumentationItem[];
const seasonSummaries = sourceSeasons.map((temporada) => ({
  seasonId: temporada.id,
  seasonName: temporada.nome,
  description: temporada.descricao ?? 'Resumo da temporada',
  competitions: sourceCompetitions
    .filter((competicao) => competicao.temporada_id === temporada.id)
    .sort((a, b) => a.ordem - b.ordem)
    .map((competicao) => ({
      id: competicao.id,
      name: competicao.nome,
      status: competicao.status,
      type: competicao.tipo,
      description: competicao.descricao,
      logoUrl: competicao.url_logo,
      order: competicao.ordem,
    })),
})) satisfies SeasonSummary[];

const sourceMediaByTournament = (tournamentId: string) =>
  sourceMedia
    .filter((mediaItem) => mediaItem.tournament_id === tournamentId)
    .map((mediaItem) => ({
      id: mediaItem.id,
      title: mediaItem.titulo,
      description: mediaItem.legenda,
      url: mediaItem.url,
      thumbnailUrl: mediaItem.url_thumbnail,
      type: mediaItem.tipo,
      date: mediaItem.criado_em,
    }));

const addDaysToDate = (dateText: string, daysToAdd: number) => {
  const date = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return date.toISOString().slice(0, 10);
};

const buildTournamentStatistics = (tournamentId: string): TournamentStatistics => {
  const tournamentMatches = sourceMatches.filter((match) => match.competicao_id === tournamentId);
  const matchIds = new Set(tournamentMatches.map((match) => match.id));
  const matchDateById = new Map(tournamentMatches.map((match) => [match.id, match.data_hora]));
  const tournamentEvents = sourceMatchEvents.filter((event) => matchIds.has(event.match_id));

  const playerById = new Map(sourcePlayers.map((player) => [player.id, player]));
  const teamNameById = new Map(sourceTeams.map((team) => [team.id, team.nome]));

  const scorerMap = new Map<string, TournamentScorerRow>();
  const penaltyMap = new Map<string, TournamentPenaltyRow>();
  const bestPlayerMap = new Map<string, TournamentBestPlayerRow>();

  const eventsByMatch = new Map<string, typeof tournamentEvents>();
  for (const event of tournamentEvents) {
    const bucket = eventsByMatch.get(event.match_id) ?? [];
    bucket.push(event);
    eventsByMatch.set(event.match_id, bucket);

    const player = playerById.get(event.player_id);
    if (!player) {
      continue;
    }

    const teamName = teamNameById.get(event.team_id ?? player.team_id ?? '') ?? 'Equipe';

    if (event.type === 'goal') {
      const current = scorerMap.get(event.player_id) ?? {
        playerId: event.player_id,
        playerName: player.nome,
        teamName,
        goals: 0,
      };
      current.goals += 1;
      scorerMap.set(event.player_id, current);
    }

    if (event.type === 'yellow_card' || event.type === 'red_card') {
      const current = penaltyMap.get(event.player_id) ?? {
        playerId: event.player_id,
        playerName: player.nome,
        teamName,
        yellowCards: 0,
        redCards: 0,
      };
      if (event.type === 'yellow_card') {
        current.yellowCards += 1;
      } else {
        current.redCards += 1;
      }
      penaltyMap.set(event.player_id, current);
    }
  }

  for (const [, events] of eventsByMatch) {
    const perMatchScore = new Map<string, number>();
    for (const event of events) {
      if (!event.player_id) {
        continue;
      }
      const points = event.type === 'goal' ? 2 : event.type === 'assist' ? 1 : 0;
      if (points === 0) {
        continue;
      }
      perMatchScore.set(event.player_id, (perMatchScore.get(event.player_id) ?? 0) + points);
    }

    const winner = [...perMatchScore.entries()].sort((a, b) => b[1] - a[1])[0];
    if (!winner) {
      continue;
    }

    const winnerPlayer = playerById.get(winner[0]);
    if (!winnerPlayer) {
      continue;
    }

    const winnerTeamName = teamNameById.get(winnerPlayer.team_id ?? '') ?? 'Equipe';
    const current = bestPlayerMap.get(winner[0]) ?? {
      playerId: winner[0],
      playerName: winnerPlayer.nome,
      teamName: winnerTeamName,
      playerOfMatchCount: 0,
    };
    current.playerOfMatchCount += 1;
    bestPlayerMap.set(winner[0], current);
  }

  const penalties = [...penaltyMap.values()].sort((a, b) => (b.redCards * 10 + b.yellowCards) - (a.redCards * 10 + a.yellowCards));

  const suspensions: TournamentSuspensionRow[] = penalties
    .filter((item) => item.redCards > 0 || item.yellowCards >= 3)
    .map((item) => {
      const playerEvents = tournamentEvents
        .filter((event) => event.player_id === item.playerId && (event.type === 'yellow_card' || event.type === 'red_card'))
        .sort((a, b) => (matchDateById.get(a.match_id) ?? '').localeCompare(matchDateById.get(b.match_id) ?? ''));
      const latestEvent = playerEvents[playerEvents.length - 1];
      const startDate = latestEvent ? (matchDateById.get(latestEvent.match_id) ?? 'N/A') : 'N/A';
      const suspensionDays = item.redCards > 0 ? 14 : 7;
      const endDate = startDate !== 'N/A' ? addDaysToDate(startDate, suspensionDays) : 'N/A';

      return {
        playerId: item.playerId,
        playerName: item.playerName,
        teamName: item.teamName,
        startDate,
        endDate,
      };
    });

  return {
    scorers: [...scorerMap.values()].sort((a, b) => b.goals - a.goals || a.playerName.localeCompare(b.playerName)),
    bestPlayers: [...bestPlayerMap.values()].sort((a, b) => b.playerOfMatchCount - a.playerOfMatchCount || a.playerName.localeCompare(b.playerName)),
    penalties,
    suspensions,
  };
};
const users = (jsonLeagueData.users ?? []).map((raw: any) => ({
  id: String(raw.id),
  email: String(raw.email),
  name: raw.name,
  password: String(raw.senha),
  role: String(raw.role),
  avatarUrl: raw.avatar_url,
}));

export const teamService = {
  list: (): Team[] => teams,
  getById: (id: string): Team | undefined => teams.find((team) => team.id === id),
  getPlayersByTeam: (teamId: string): Player[] => players.filter((player) => player.teamId === teamId),
  getRecentResults: (teamId: string) => {
    const sourceId = resolveTeamSourceId(teamId);
    return sourceMatches
      .filter((partida) => partida.time_casa_id === sourceId || partida.time_visitante_id === sourceId)
      .slice(0, 3)
      .map((partida) => {
        const casa = sourceTeams.find((time) => time.id === partida.time_casa_id);
        const visitante = sourceTeams.find((time) => time.id === partida.time_visitante_id);
        const competicao = sourceCompetitions.find((item) => item.id === partida.competicao_id);
        const resultado = partida.time_casa_id === teamId
          ? `${partida.placar_casa ?? 0}x${partida.placar_visitante ?? 0}`
          : `${partida.placar_visitante ?? 0}x${partida.placar_casa ?? 0}`;
        const adversario = partida.time_casa_id === teamId ? visitante?.nome : casa?.nome;
        return {
          competitionName: competicao?.nome ?? 'Competição',
          result: `${resultado} vs ${adversario ?? 'adversário'}`,
          date: partida.data_hora,
        };
      });
  },
};

export const playerService = {
  list: (): Player[] => players,
  getById: (id: string): Player | undefined => players.find((player) => player.id === id),
};

export const tournamentService = {
  list: (): Tournament[] => tournaments,
  getById: (id: string): Tournament | undefined => tournaments.find((tournament) => tournament.id === id),
  getMatchesByTournament: (tournamentId: string): Match[] => matches.filter((match) => match.tournamentId === resolveTournamentSourceId(tournamentId)),
  getMediaByTournament: (tournamentId: string) => sourceMediaByTournament(resolveTournamentSourceId(tournamentId)),
  getStatisticsByTournament: (tournamentId: string): TournamentStatistics => buildTournamentStatistics(resolveTournamentSourceId(tournamentId)),
  getPodiumByTournament: (tournamentId: string): Podium | undefined => podiums.find((podium) => podium.tournamentId === resolveTournamentSourceId(tournamentId)),
  getStandingsByTournament: (tournamentId: string) => {
    const sourceTournamentId = resolveTournamentSourceId(tournamentId);
    return (jsonLeagueData.standings ?? [])
      .filter((standing) => standing.tournament_id === sourceTournamentId)
      .map((standing) => ({
        id: standing.id,
        position: standing.position,
        teamName: sourceTeams.find((team) => team.id === String(standing.team_id))?.nome ?? 'Equipe',
        points: standing.points,
        wins: standing.wins,
        draws: standing.draws,
        losses: standing.losses,
        goalDifference: standing.goals_difference,
      }));
  },
};

export const matchService = {
  list: (): Match[] => matches,
  getById: (id: string): Match | undefined => matches.find((match) => match.id === id),
};

export const documentationService = {
  list: (): DocumentationItem[] => documentation,
  getById: (id: string): DocumentationItem | undefined => documentation.find((doc) => doc.id === id),
};

export const seasonService = {
  list: (): SeasonSummary[] => seasonSummaries,
  getBySeason: (seasonId: string): SeasonSummary | undefined => seasonSummaries.find((item) => item.seasonId === seasonId),
};

export const overviewService = {
  getHomeOverview: (): HomeOverview => {
    const league = jsonLeagueData.leagues[0];
    const currentSeason = sourceSeasons.find((item) => item.status === 'em_andamento') ?? sourceSeasons[0];
    const recentMatches = matches.filter((match) => match.status === 'finished').slice(0, 3);
    const upcomingMatches = matches.filter((match) => match.status === 'scheduled').slice(0, 2);
    const finishedTournaments = tournaments
      .map((tournament) => {
        const sourceCompetition = sourceCompetitions.find((competicao) => competicao.nome === tournament.name.replace(/^Campeonato\s+/, '') || competicao.nome === tournament.name);
        const podium = sourceCompetition ? podiums.find((item) => item.tournamentId === sourceCompetition.id) : undefined;
        return { ...tournament, podium };
      })
      .filter((tournament) => Boolean(tournament.podium)) as HomeTournamentSummary[];

    return {
      league: { id: league.id, name: league.name, season: currentSeason?.nome ?? 'Temporada' },
      totalTournaments: tournaments.length,
      totalMatches: matches.length,
      recentMatches,
      upcomingMatches,
      finishedTournaments,
    };
  },
};

export const authService = {
  list: () => users,
  getByEmail: (email: string) => users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase()),
  validateCredentials: (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((candidate) => candidate.email.toLowerCase() === normalizedEmail);
    return Boolean(user && user.password === password);
  },
};

export const routeService = {
  teams: teamService,
  players: playerService,
  tournaments: tournamentService,
  matches: matchService,
  auth: authService,
};

export const getRouteData = (entity: RouteEntity) => routeService[entity];
