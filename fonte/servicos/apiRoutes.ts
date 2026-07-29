import { Team, Player, Tournament, Match, DocumentationItem, SeasonSummary, Podium } from '@/tipos/league';
import { getPlayers, getTeams, getTournaments } from '@/dados/state';
import { jsonRouteRepository } from '@/servicos/jsonRouteRepository';

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

const routeDb = jsonRouteRepository.getDb();
const sourceLeagues = routeDb.leagues;

const sourceTeamNameLookup = routeDb.teams.map((team) => ({
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

const resolveTeamLogoUrl = (team: (typeof routeDb.teams)[number]): string => {
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

const resolveTeamIdFromMediaByName = (mediaItem: (typeof routeDb.media)[number]): string | undefined => {
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

const sourceMedia = (routeDb.media ?? []).map((mediaItem) => {
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
const sourceTeams = routeDb.teams.map((team) => ({
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
const sourceCompetitions = routeDb.competitions.map((patchedCompetition) => {
  const normalizedFormat =
    patchedCompetition.format === 'eliminacao_direta'
      ? 'eliminacao_direta'
      : patchedCompetition.format === 'grupos_playoff' || patchedCompetition.format === 'pontos_corridos_eliminatorias'
        ? 'grupos_playoff'
        : 'turno_unico';

  return {
    id: patchedCompetition.id,
    temporada_id: patchedCompetition.season_id,
    nome: patchedCompetition.name,
    slug: patchedCompetition.slug,
    tipo: patchedCompetition.type === 'copa' ? 'copa' : 'campeonato',
    formato: normalizedFormat,
    data_inicio: patchedCompetition.start_date,
    data_fim: patchedCompetition.end_date,
    status: patchedCompetition.status === 'finalizada' ? 'finalizada' : patchedCompetition.status === 'em_andamento' ? 'em_andamento' : 'rascunho',
    ordem: patchedCompetition.order,
    descricao: patchedCompetition.description,
    organizador: patchedCompetition.organizer,
    url_logo: patchedCompetition.logo_url,
    url_banner: patchedCompetition.banner_url,
    criado_em: patchedCompetition.created_at,
    atualizado_em: patchedCompetition.updated_at,
  };
});
const sourceSeasons = routeDb.seasons.map((patchedSeason) => {
  return {
    id: patchedSeason.id,
    liga_id: patchedSeason.league_id,
    nome: patchedSeason.name,
    slug: patchedSeason.slug,
    ano: patchedSeason.year,
    semestre: patchedSeason.semester as 'apertura' | 'clausura',
    data_inicio: patchedSeason.start_date,
    data_fim: patchedSeason.end_date,
    status: patchedSeason.status === 'finalizada' ? 'finalizada' : patchedSeason.status === 'em_andamento' ? 'em_andamento' : 'rascunho',
    descricao: patchedSeason.description,
    url_banner: patchedSeason.banner_url,
    criado_em: patchedSeason.created_at,
    atualizado_em: patchedSeason.updated_at,
  };
});
const sourceMatches = (routeDb.matches ?? []).map((match) => ({
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
const sourceMatchEvents = (routeDb.matchEvents ?? []).map((event) => ({
  id: event.id,
  match_id: event.match_id,
  player_id: event.player_id,
  team_id: event.team_id,
  type: event.type,
  minute: event.minute,
  created_at: event.created_at,
}));
const sourcePodiums = (routeDb.podiums ?? []).map((podium) => ({
  id: podium.id,
  tournament_id: podium.tournament_id,
  first_place_id: podium.first_place?.team_id,
  second_place_id: podium.second_place?.team_id,
  third_place_id: podium.third_place?.team_id,
  first_place_name: podium.first_place?.team_name,
  second_place_name: podium.second_place?.team_name,
  third_place_name: podium.third_place?.team_name,
}));
const sourcePlayers = (routeDb.players ?? []).map((player) => ({
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
  if (index >= 0) {
    return tournamentId;
  }

  if (/^comp-\d+$/i.test(tournamentId)) {
    return tournamentId;
  }

  if (/^t\d+$/i.test(tournamentId)) {
    const numericId = Number(tournamentId.replace(/^t/i, ''));
    const paddedCandidate = `comp-${String(numericId).padStart(3, '0')}`;
    const candidateExists = sourceMatches.some((match) => match.competicao_id === paddedCandidate);

    if (candidateExists) {
      return paddedCandidate;
    }
  }

  return sourceTournamentIds[Number(tournamentId.replace('t', '')) - 1] ?? tournamentId;
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
  const tournamentFormatLabel =
    competicao.formato === 'turno_unico'
      ? 'Pontos Corridos'
      : competicao.formato === 'grupos_playoff'
        ? 'Pontos corridos + Eliminatórias'
        : 'Eliminatórias';

  return {
    id: mapTournamentIdToLegacy(competicao.id, index),
    leagueId: 'liga-001',
    name: competicao.tipo === 'copa' ? competicao.nome : `Campeonato ${competicao.nome}`,
    type: competicao.tipo === 'copa' ? 'cup' : 'league',
    season: temporada?.nome ?? 'Temporada',
    status: competicao.status === 'finalizada' ? 'finished' : competicao.status === 'em_andamento' ? 'ongoing' : 'draft',
    description: competicao.descricao,
    format: tournamentFormatLabel,
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
const getSeasonWindowBounds = (season: (typeof sourceSeasons)[number]) => {
  const year = String(season.ano).padStart(4, '0');

  if (season.semestre === 'apertura') {
    return {
      start: `${year}-01-01`,
      end: `${year}-07-31`,
    };
  }

  return {
    start: `${year}-06-01`,
    end: `${year}-12-31`,
  };
};

const parseIsoDate = (value: string) => {
  const parsed = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const isCompetitionInsideSeasonWindow = (
  competition: (typeof sourceCompetitions)[number],
  season: (typeof sourceSeasons)[number],
) => {
  const { start, end } = getSeasonWindowBounds(season);
  return competition.data_inicio >= start && competition.data_fim <= end;
};

const resolveCompetitionSeasonByRule = (
  competition: (typeof sourceCompetitions)[number],
  seasons: (typeof sourceSeasons),
) => {
  const candidates = seasons.filter((season) => isCompetitionInsideSeasonWindow(competition, season));

  const matchedById = candidates.find((season) => season.id === competition.temporada_id);
  if (matchedById) {
    return matchedById.id;
  }

  if (candidates.length === 1) {
    return candidates[0].id;
  }

  if (candidates.length > 1) {
    const competitionStart = parseIsoDate(competition.data_inicio);
    const closestSeason = [...candidates].sort((a, b) => {
      const distanceA = Math.abs(parseIsoDate(a.data_inicio) - competitionStart);
      const distanceB = Math.abs(parseIsoDate(b.data_inicio) - competitionStart);
      return distanceA - distanceB;
    })[0];

    if (closestSeason) {
      return closestSeason.id;
    }
  }

  return competition.temporada_id;
};

const resolvedSeasonByCompetitionId = new Map(
  sourceCompetitions.map((competition) => [
    competition.id,
    resolveCompetitionSeasonByRule(competition, sourceSeasons),
  ]),
);

const seasonSummaries = sourceSeasons.map((temporada) => ({
  seasonId: temporada.id,
  seasonName: temporada.nome,
  description: temporada.descricao ?? 'Resumo da temporada',
  competitions: sourceCompetitions
    .filter((competicao) => resolvedSeasonByCompetitionId.get(competicao.id) === temporada.id)
    .sort((a, b) => a.ordem - b.ordem)
    .map((competicao) => ({
      id: competicao.id,
      name: competicao.nome,
      status: competicao.status,
      type: competicao.tipo,
      format: competicao.formato,
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
const users = (routeDb.users ?? []).map((raw: any) => ({
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
    return (routeDb.standings ?? [])
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
    const league = sourceLeagues[0] ?? { id: 'l1', name: 'Liga', slug: 'liga' };
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
