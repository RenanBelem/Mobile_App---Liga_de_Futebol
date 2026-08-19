/**
 * SRC/paginas/TOURNAMENTDETAIL.TSX
 * ===============================
 * PROPÓSITO: Página de detalhes de um torneio específico
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import { tournamentService } from '@/servicos/apiRoutes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/componentes/ui/dialog';
import { jsonRouteRepository } from '@/servicos/jsonRouteRepository';
import { useToast } from '@/ganchos/use-toast';
import { dataGateway } from '@/servicos/dataGateway';

type Tab = 'standings' | 'matches' | 'stats' | 'media';
type StatsTab = 'scorers' | 'bestPlayers' | 'penalties' | 'suspensions';
type StandingsNature = 'league' | 'hybrid' | 'knockout';
type StandingsPhase = 'phase1' | 'phase2';
type MatchDialogAction = 'menu' | 'view' | 'teams' | 'result' | 'info';

type EditableEvent = {
  id: string;
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card';
  playerId: string;
  teamId: string;
  minute: string;
};

type TournamentDetailLocationState = {
  selectedSeasonId?: string;
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const knockoutRoundKeywords = [
  'oitavas',
  'quartas',
  'semi',
  'final',
  'mata',
  'eliminatoria',
  'quadrangular',
  'triangular',
  'repescagem',
  'lugar',
];

const isKnockoutRound = (round: string) => {
  const normalizedRound = normalizeText(round);
  return knockoutRoundKeywords.some((keyword) => normalizedRound.includes(keyword));
};

const roundWeight = (round: string) => {
  const normalized = normalizeText(round);

  if (normalized.includes('oitavas')) return 1;
  if (normalized.includes('quartas')) return 2;
  if (normalized.includes('semi')) return 3;
  if (normalized === 'final' || normalized.includes(' final')) return 4;
  if (normalized.includes('3') || normalized.includes('terceiro')) return 5;
  if (normalized.includes('rodada')) {
    const match = normalized.match(/rodada\s*(\d+)/);
    return 100 + Number(match?.[1] ?? 0);
  }

  return 500;
};

const groupMatchesByRound = <T extends { round?: string }>(matches: T[]) => {
  const grouped = matches.reduce<Record<string, T[]>>((accumulator, match) => {
    const key = match.round?.trim() || 'Sem rodada definida';
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(match);
    return accumulator;
  }, {});

  return Object.entries(grouped).sort((a, b) => {
    const weightDifference = roundWeight(a[0]) - roundWeight(b[0]);
    if (weightDifference !== 0) {
      return weightDifference;
    }
    return a[0].localeCompare(b[0]);
  });
};

const buildStandingsFromMatches = (
  matches: Array<{ home_team_id: string; away_team_id: string; score_home?: number; score_away?: number }>,
  getTeamNameById: (teamId: string) => string,
) => {
  const table = new Map<string, {
    teamId: string;
    teamName: string;
    points: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  }>();

  const ensureRow = (teamId: string) => {
    if (!table.has(teamId)) {
      table.set(teamId, {
        teamId,
        teamName: getTeamNameById(teamId),
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      });
    }

    return table.get(teamId)!;
  };

  matches.forEach((match) => {
    if (match.score_home === undefined || match.score_away === undefined) {
      return;
    }

    const home = ensureRow(match.home_team_id);
    const away = ensureRow(match.away_team_id);

    home.goalsFor += match.score_home;
    home.goalsAgainst += match.score_away;
    away.goalsFor += match.score_away;
    away.goalsAgainst += match.score_home;

    if (match.score_home > match.score_away) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
      return;
    }

    if (match.score_home < match.score_away) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
      return;
    }

    home.draws += 1;
    away.draws += 1;
    home.points += 1;
    away.points += 1;
  });

  return [...table.values()]
    .sort((a, b) => {
      const pointsDifference = b.points - a.points;
      if (pointsDifference !== 0) {
        return pointsDifference;
      }

      const goalDifference = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
      if (goalDifference !== 0) {
        return goalDifference;
      }

      return b.goalsFor - a.goalsFor;
    })
    .map((row, index) => ({
      id: row.teamId,
      position: index + 1,
      teamName: row.teamName,
      points: row.points,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
    }));
};

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const tournament = tournamentService.getById(id ?? '');
  const [activeTab, setActiveTab] = useState<Tab>('standings');
  const [activeStatsTab, setActiveStatsTab] = useState<StatsTab>('scorers');
  const [standingsPhase, setStandingsPhase] = useState<StandingsPhase>('phase1');

  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<MatchDialogAction>('menu');

  const [selectedHomeTeamId, setSelectedHomeTeamId] = useState('');
  const [selectedAwayTeamId, setSelectedAwayTeamId] = useState('');

  const [resultHomeScore, setResultHomeScore] = useState('0');
  const [resultAwayScore, setResultAwayScore] = useState('0');
  const [matchDuration, setMatchDuration] = useState('90');
  const [homePlayersPresent, setHomePlayersPresent] = useState('');
  const [awayPlayersPresent, setAwayPlayersPresent] = useState('');
  const [arbitrationRecords, setArbitrationRecords] = useState('');
  const [resultEvents, setResultEvents] = useState<EditableEvent[]>([]);

  const [matchTitle, setMatchTitle] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchKickoffTime, setMatchKickoffTime] = useState('');
  const [matchLocation, setMatchLocation] = useState('');
  const [matchWarningNotice, setMatchWarningNotice] = useState('');
  const [matchReferees, setMatchReferees] = useState('');
  const [matchAttachments, setMatchAttachments] = useState('');

  const [selectedRoundFilter, setSelectedRoundFilter] = useState('');
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [showAddRoundForm, setShowAddRoundForm] = useState(false);
  const [newRoundName, setNewRoundName] = useState('');
  const [customRounds, setCustomRounds] = useState<string[]>([]);
  const [newMatchRound, setNewMatchRound] = useState('Rodada 1');
  const [newMatchHomeTeamId, setNewMatchHomeTeamId] = useState('');
  const [newMatchAwayTeamId, setNewMatchAwayTeamId] = useState('');
  const [newMatchDate, setNewMatchDate] = useState('');
  const [newMatchTime, setNewMatchTime] = useState('');
  const [newMatchLocation, setNewMatchLocation] = useState('');

  const locationState = location.state as TournamentDetailLocationState | null;

  const rawMatches = useMemo(() => jsonRouteRepository.get('matches'), []);
  const rawEvents = useMemo(() => jsonRouteRepository.get('matchEvents'), []);
  const rawMedia = useMemo(() => jsonRouteRepository.get('media'), []);
  const rawTeams = useMemo(() => jsonRouteRepository.get('teams'), []);
  const rawPlayers = useMemo(() => jsonRouteRepository.get('players'), []);
  const rawCompetitions = useMemo(() => jsonRouteRepository.get('competitions'), []);

  if (!tournament) return <div className="p-4 text-muted-foreground">Torneio não encontrado.</div>;

  const tournamentMatches = useMemo(() => (id ? tournamentService.getMatchesByTournament(id) : []), [id]);
  const standings = useMemo(() => (id ? tournamentService.getStandingsByTournament(id) : []), [id]);
  const tournamentMedia = useMemo(() => (id ? tournamentService.getMediaByTournament(id) : []), [id]);
  const tournamentStats = useMemo(
    () => (id
      ? tournamentService.getStatisticsByTournament(id)
      : { scorers: [], bestPlayers: [], penalties: [], suspensions: [] }),
    [id],
  );

  const tournamentMatchIds = useMemo(() => new Set(tournamentMatches.map((match) => match.id)), [tournamentMatches]);

  const rawTournamentMatches = useMemo(() => {
    return rawMatches
      .filter((match) => tournamentMatchIds.has(match.id))
      .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
  }, [rawMatches, tournamentMatchIds]);

  const sourceTournamentId = useMemo(() => {
    if (rawTournamentMatches[0]?.tournament_id) {
      return rawTournamentMatches[0].tournament_id;
    }

    const normalizedTournamentName = normalizeText(tournament.name.replace(/^Campeonato\s+/i, ''));
    const competition = rawCompetitions.find((item) => normalizeText(item.name) === normalizedTournamentName);

    return competition?.id ?? '';
  }, [rawCompetitions, rawTournamentMatches, tournament.name]);

  const sourceCompetition = useMemo(() => {
    if (!sourceTournamentId) {
      return undefined;
    }

    return rawCompetitions.find((competition) => competition.id === sourceTournamentId);
  }, [rawCompetitions, sourceTournamentId]);

  const getTeamNameById = (teamId: string) => {
    const team = rawTeams.find((item) => item.id === teamId);
    return team?.name ?? teamId;
  };

  const getPlayerNameById = (playerId: string) => {
    const player = rawPlayers.find((item) => item.id === playerId);
    return player?.name ?? playerId;
  };

  const roundOptions = useMemo(() => {
    return [...new Set([
      ...rawTournamentMatches.map((match) => match.round?.trim() || 'Sem rodada definida'),
      ...customRounds,
    ])]
      .sort((a, b) => {
        const weightDifference = roundWeight(a) - roundWeight(b);
        if (weightDifference !== 0) {
          return weightDifference;
        }

        return a.localeCompare(b);
      });
  }, [customRounds, rawTournamentMatches]);

  useEffect(() => {
    if (!roundOptions.length) {
      return;
    }

    const firstRound = roundOptions[0];

    setSelectedRoundFilter((current) => (current && roundOptions.includes(current) ? current : firstRound));
    setNewMatchRound((current) => (current && roundOptions.includes(current) ? current : firstRound));
  }, [roundOptions]);

  const filteredMatches = useMemo(() => {
    if (!selectedRoundFilter) {
      return rawTournamentMatches;
    }

    return rawTournamentMatches.filter((match) => (match.round?.trim() || 'Sem rodada definida') === selectedRoundFilter);
  }, [rawTournamentMatches, selectedRoundFilter]);

  const standingsNature = useMemo<StandingsNature>(() => {
    const rawFormat = sourceCompetition?.format ?? tournament.format ?? '';
    const normalizedFormat = normalizeText(rawFormat);

    if (
      normalizedFormat.includes('pontos corridos + eliminatorias') ||
      normalizedFormat.includes('grupos playoff') ||
      normalizedFormat.includes('grupos_playoff') ||
      normalizedFormat.includes('pontos_corridos_eliminatorias')
    ) {
      return 'hybrid';
    }

    if (normalizedFormat.includes('eliminatorias')) {
      return 'knockout';
    }

    return 'league';
  }, [sourceCompetition?.format, tournament.format]);

  const knockoutMatches = useMemo(() => {
    return rawTournamentMatches.filter((match) => isKnockoutRound(match.round ?? ''));
  }, [rawTournamentMatches]);

  const leaguePhaseMatches = useMemo(() => {
    return rawTournamentMatches.filter((match) => !isKnockoutRound(match.round ?? ''));
  }, [rawTournamentMatches]);

  const phaseOneStandings = useMemo(() => {
    if (standings.length > 0) {
      return standings;
    }

    return buildStandingsFromMatches(leaguePhaseMatches, getTeamNameById);
  }, [leaguePhaseMatches, standings]);

  const knockoutByRounds = useMemo(() => {
    return groupMatchesByRound(knockoutMatches);
  }, [knockoutMatches]);

  const selectedRawMatch = useMemo(() => {
    if (!selectedMatchId) {
      return undefined;
    }

    return rawTournamentMatches.find((match) => match.id === selectedMatchId);
  }, [rawTournamentMatches, selectedMatchId]);

  const selectedMatchMedia = useMemo(() => {
    if (!selectedRawMatch) {
      return [];
    }

    return rawMedia.filter((mediaItem) => mediaItem.match_id === selectedRawMatch.id);
  }, [rawMedia, selectedRawMatch]);

  const selectedMatchEvents = useMemo(() => {
    if (!selectedRawMatch) {
      return [];
    }

    return rawEvents
      .filter((event) => event.match_id === selectedRawMatch.id)
      .sort((a, b) => Number(a.minute ?? 0) - Number(b.minute ?? 0));
  }, [rawEvents, selectedRawMatch]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'standings', label: 'Classificação' },
    { key: 'matches', label: 'Jogos' },
    { key: 'stats', label: 'Estatísticas' },
    { key: 'media', label: 'Mídias' },
  ];

  const statsTabs: { key: StatsTab; label: string }[] = [
    { key: 'scorers', label: 'Artilheiros' },
    { key: 'bestPlayers', label: 'Melhores Jogadores' },
    { key: 'penalties', label: 'Penalidades' },
    { key: 'suspensions', label: 'Suspensões' },
  ];

  const handleBack = () => {
    if (locationState?.selectedSeasonId) {
      navigate('/tournaments', { state: { selectedSeasonId: locationState.selectedSeasonId } });
      return;
    }

    navigate(-1);
  };

  const emptyState = (
    <div className="rounded-lg border border-dashed border-border/70 bg-background/40 p-4 text-center text-sm text-muted-foreground">
      Sem dados cadastrados
    </div>
  );

  const subtitle = `${tournament.season} · ${tournament.type === 'cup' ? 'Copa' : 'Liga'}${tournament.format ? ` · ${tournament.format}` : ''}`;

  const openMatchDialog = (matchId: string) => {
    const match = rawTournamentMatches.find((item) => item.id === matchId);
    if (!match) {
      return;
    }

    setSelectedMatchId(matchId);
    setSelectedAction('menu');
    setMatchDialogOpen(true);
  };

  useEffect(() => {
    if (!selectedRawMatch) {
      return;
    }

    setSelectedHomeTeamId(selectedRawMatch.home_team_id ?? '');
    setSelectedAwayTeamId(selectedRawMatch.away_team_id ?? '');

    setResultHomeScore(String(selectedRawMatch.score_home ?? 0));
    setResultAwayScore(String(selectedRawMatch.score_away ?? 0));
    setMatchDuration(String(selectedRawMatch.duration_minutes ?? 90));
    setHomePlayersPresent(Array.isArray(selectedRawMatch.home_players_present) ? selectedRawMatch.home_players_present.join(', ') : '');
    setAwayPlayersPresent(Array.isArray(selectedRawMatch.away_players_present) ? selectedRawMatch.away_players_present.join(', ') : '');
    setArbitrationRecords(selectedRawMatch.arbitration_records ?? '');

    setMatchTitle(selectedRawMatch.round ?? 'Partida');
    setMatchDate(selectedRawMatch.date ?? '');
    setMatchKickoffTime(selectedRawMatch.kickoff_time ?? '');
    setMatchLocation(selectedRawMatch.location ?? '');
    setMatchWarningNotice(selectedRawMatch.warning_notice ?? '');
    setMatchReferees(Array.isArray(selectedRawMatch.referees) ? selectedRawMatch.referees.join(', ') : '');
    setMatchAttachments(Array.isArray(selectedRawMatch.attachments) ? selectedRawMatch.attachments.join('\n') : '');

    const editable = selectedMatchEvents.map((event) => ({
      id: event.id,
      type: (event.type ?? 'goal') as EditableEvent['type'],
      playerId: event.player_id ?? '',
      teamId: event.team_id ?? '',
      minute: String(event.minute ?? ''),
    }));

    setResultEvents(editable);
  }, [selectedRawMatch, selectedMatchEvents]);

  const saveTeamsSelection = async () => {
    if (!selectedRawMatch) {
      return;
    }

    if (!selectedHomeTeamId || !selectedAwayTeamId || selectedHomeTeamId === selectedAwayTeamId) {
      toast({
        title: 'Equipes inválidas',
        description: 'Selecione equipes diferentes para mandante e visitante.',
        variant: 'destructive',
      });
      return;
    }

    await dataGateway.patch('matches', selectedRawMatch.id, {
      home_team_id: selectedHomeTeamId,
      away_team_id: selectedAwayTeamId,
      updated_at: new Date().toISOString(),
    });

    toast({
      title: 'Equipes associadas',
      description: 'As equipes da partida foram atualizadas.',
    });

    window.location.reload();
  };

  const addResultEvent = () => {
    setResultEvents((previous) => [
      ...previous,
      {
        id: `evt-${Date.now()}-${previous.length + 1}`,
        type: 'goal',
        playerId: '',
        teamId: '',
        minute: '',
      },
    ]);
  };

  const updateResultEvent = (eventId: string, field: keyof EditableEvent, value: string) => {
    setResultEvents((previous) =>
      previous.map((event) =>
        event.id === eventId
          ? {
            ...event,
            [field]: value,
          }
          : event
      )
    );
  };

  const removeResultEvent = (eventId: string) => {
    setResultEvents((previous) => previous.filter((event) => event.id !== eventId));
  };

  const saveMatchResult = async () => {
    if (!selectedRawMatch) {
      return;
    }

    const nowIso = new Date().toISOString();

    await dataGateway.patch('matches', selectedRawMatch.id, {
      score_home: Number(resultHomeScore) || 0,
      score_away: Number(resultAwayScore) || 0,
      duration_minutes: Number(matchDuration) || 90,
      home_players_present: homePlayersPresent
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      away_players_present: awayPlayersPresent
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      arbitration_records: arbitrationRecords.trim(),
      status: 'finished',
      updated_at: nowIso,
    });

    const currentEvents = rawEvents.filter((event) => event.match_id === selectedRawMatch.id);
    for (const event of currentEvents) {
      await dataGateway.remove('matchEvents', event.id);
    }

    for (const event of resultEvents.filter((entry) => entry.playerId && entry.teamId)) {
      await dataGateway.insert('matchEvents', {
          id: event.id,
          match_id: selectedRawMatch.id,
          player_id: event.playerId,
          team_id: event.teamId,
          type: event.type,
          minute: Number(event.minute) || 0,
          created_at: nowIso,
          updated_at: nowIso,
      });
    }

    toast({
      title: 'Resultado atualizado',
      description: 'Resultado, eventos e registros da partida foram salvos.',
    });

    window.location.reload();
  };

  const saveMatchInfo = async () => {
    if (!selectedRawMatch) {
      return;
    }

    await dataGateway.patch('matches', selectedRawMatch.id, {
      round: matchTitle.trim() || 'Partida',
      date: matchDate,
      kickoff_time: matchKickoffTime,
      location: matchLocation.trim(),
      warning_notice: matchWarningNotice.trim(),
      referees: matchReferees
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      attachments: matchAttachments
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
    });

    toast({
      title: 'Informações atualizadas',
      description: 'Dados gerais da partida foram atualizados.',
    });

    window.location.reload();
  };

  const removeMatch = async () => {
    if (!selectedRawMatch) {
      return;
    }

    const confirmed = window.confirm('Deseja remover esta partida? Esta ação também removerá eventos vinculados.');
    if (!confirmed) {
      return;
    }

    const linkedEvents = rawEvents.filter((event) => event.match_id === selectedRawMatch.id);
    for (const event of linkedEvents) {
      await dataGateway.remove('matchEvents', event.id);
    }

    const linkedMedia = rawMedia.filter((mediaItem) => mediaItem.match_id === selectedRawMatch.id);
    for (const mediaItem of linkedMedia) {
      await dataGateway.remove('media', mediaItem.id);
    }

    await dataGateway.remove('matches', selectedRawMatch.id);

    toast({
      title: 'Partida removida',
      description: 'A partida e seus vínculos foram removidos.',
    });

    window.location.reload();
  };

  const addMatchToRound = async () => {
    if (!sourceTournamentId) {
      toast({
        title: 'Competição não localizada',
        description: 'Não foi possível identificar a competição desta tela para criar a partida.',
        variant: 'destructive',
      });
      return;
    }

    if (!newMatchHomeTeamId || !newMatchAwayTeamId || newMatchHomeTeamId === newMatchAwayTeamId) {
      toast({
        title: 'Equipes inválidas',
        description: 'Selecione equipes diferentes para criar a partida.',
        variant: 'destructive',
      });
      return;
    }

    const nowIso = new Date().toISOString();

    await dataGateway.insert('matches', {
      id: `match-${Date.now()}`,
      tournament_id: sourceTournamentId,
      home_team_id: newMatchHomeTeamId,
      away_team_id: newMatchAwayTeamId,
      score_home: null,
      score_away: null,
      date: newMatchDate || new Date().toISOString().slice(0, 10),
      kickoff_time: newMatchTime,
      round: newMatchRound,
      location: newMatchLocation.trim(),
      status: 'scheduled',
      created_at: nowIso,
      updated_at: nowIso,
    });

    toast({
      title: 'Partida adicionada',
      description: `Nova partida criada na ${newMatchRound}.`,
    });

    window.location.reload();
  };

  const addRound = () => {
    const normalizedRoundName = newRoundName.trim();

    if (!normalizedRoundName) {
      toast({
        title: 'Rodada inválida',
        description: 'Informe o nome da rodada para adicionar.',
        variant: 'destructive',
      });
      return;
    }

    if (roundOptions.some((round) => normalizeText(round) === normalizeText(normalizedRoundName))) {
      toast({
        title: 'Rodada já existe',
        description: 'Essa rodada já está disponível para seleção.',
      });
      return;
    }

    setCustomRounds((previous) => [...previous, normalizedRoundName]);
    setSelectedRoundFilter(normalizedRoundName);
    setNewMatchRound(normalizedRoundName);
    setNewRoundName('');
    setShowAddRoundForm(false);

    toast({
      title: 'Rodada adicionada',
      description: `A rodada ${normalizedRoundName} foi adicionada.`,
    });
  };

  const renderStandingsTable = (rows: Array<{ id: string; position: number; teamName: string; points: number; wins: number; draws: number; losses: number }>) => {
    if (!rows.length) {
      return emptyState;
    }

    return (
      <div className="space-y-2">
        {rows.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3 text-sm">
            <div>
              <p className="font-semibold">{item.position}. {item.teamName}</p>
              <p className="text-muted-foreground">{item.wins}V · {item.draws}E · {item.losses}D</p>
            </div>
            <span className="font-bold text-primary">{item.points} pts</span>
          </div>
        ))}
      </div>
    );
  };

  const renderKnockoutBracket = () => {
    if (!knockoutByRounds.length) {
      return emptyState;
    }

    return (
      <div className="grid gap-3">
        {knockoutByRounds.map(([roundLabel, matches]) => (
          <div key={roundLabel} className="rounded-xl border border-border/70 bg-background/60 p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{roundLabel}</p>
            <div className="space-y-2">
              {matches.map((match) => (
                <div key={match.id} className="rounded-md border border-border/60 bg-secondary/20 p-2 text-sm">
                  <p className="font-semibold">{getTeamNameById(match.home_team_id)} {match.score_home ?? '?'} x {match.score_away ?? '?'} {getTeamNameById(match.away_team_id)}</p>
                  <p className="text-xs text-muted-foreground">{match.date} · {match.location || 'Local não informado'}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pb-20">
      <div className="px-4 pt-2">
        <PageHeader title={tournament.name} subtitle={subtitle} showBack onBack={handleBack} />
      </div>

      <div className="sticky top-[3.5rem] z-30 px-4 pt-3">
        <div className="flex gap-1 rounded-lg border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-2 py-2 text-[11px] font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {activeTab === 'matches' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-background/60 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Selecione a rodada</p>
              <select
                value={selectedRoundFilter}
                onChange={(event) => {
                  setSelectedRoundFilter(event.target.value);
                  setNewMatchRound(event.target.value);
                }}
                className="w-full rounded-md border border-border bg-background/50 p-2.5 text-sm"
              >
                {roundOptions.map((round) => (
                  <option key={round} value={round}>{round}</option>
                ))}
              </select>

              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoundForm((current) => !current)}
                  className="w-full rounded-md border border-border py-2 text-xs font-semibold"
                >
                  {showAddRoundForm ? 'Cancelar adição de rodada' : 'Adicionar rodada'}
                </button>

                {showAddRoundForm && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={newRoundName}
                      onChange={(event) => setNewRoundName(event.target.value)}
                      className="w-full rounded-md border border-border bg-background/50 p-2.5 text-sm"
                      placeholder="Ex: Rodada 8, Quartas, Final"
                    />
                    <button
                      type="button"
                      onClick={addRound}
                      className="rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
                    >
                      Salvar rodada
                    </button>
                  </div>
                )}
              </div>
            </div>

            {filteredMatches.length > 0 ? (
              <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Jogos da rodada {selectedRoundFilter}</p>
                <div className="space-y-2">
                  {filteredMatches.map((match) => (
                    <button
                      key={match.id}
                      type="button"
                      onClick={() => openMatchDialog(match.id)}
                      className="w-full rounded-lg border border-border/60 bg-secondary/20 p-3 text-left text-sm"
                    >
                      <p className="font-semibold">{getTeamNameById(match.home_team_id)} {match.score_home ?? '?'} x {match.score_away ?? '?'} {getTeamNameById(match.away_team_id)}</p>
                      <p className="text-muted-foreground">{match.date} · {match.location || 'Local não informado'}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : emptyState}

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowAddMatchForm((current) => !current)}
                className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {showAddMatchForm ? 'Fechar formulário de partida' : 'Adicionar partida'}
              </button>

              {showAddMatchForm && (
                <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Nova partida na rodada selecionada</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <select
                      value={newMatchHomeTeamId}
                      onChange={(event) => setNewMatchHomeTeamId(event.target.value)}
                      className="rounded-md border border-border bg-background/50 p-2.5 text-sm"
                    >
                      <option value="">Equipe mandante</option>
                      {rawTeams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>

                    <select
                      value={newMatchAwayTeamId}
                      onChange={(event) => setNewMatchAwayTeamId(event.target.value)}
                      className="rounded-md border border-border bg-background/50 p-2.5 text-sm"
                    >
                      <option value="">Equipe visitante</option>
                      {rawTeams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={newMatchDate}
                      onChange={(event) => setNewMatchDate(event.target.value)}
                      className="rounded-md border border-border bg-background/50 p-2.5 text-sm"
                    />

                    <input
                      type="time"
                      value={newMatchTime}
                      onChange={(event) => setNewMatchTime(event.target.value)}
                      className="rounded-md border border-border bg-background/50 p-2.5 text-sm"
                    />

                    <input
                      value={newMatchLocation}
                      onChange={(event) => setNewMatchLocation(event.target.value)}
                      className="rounded-md border border-border bg-background/50 p-2.5 text-sm sm:col-span-2"
                      placeholder="Local da partida"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addMatchToRound}
                    className="mt-2 w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Salvar nova partida
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="space-y-3">
            {standingsNature === 'league' && renderStandingsTable(phaseOneStandings)}

            {standingsNature === 'knockout' && renderKnockoutBracket()}

            {standingsNature === 'hybrid' && (
              <div className="space-y-3">
                <select
                  value={standingsPhase}
                  onChange={(event) => setStandingsPhase(event.target.value as StandingsPhase)}
                  className="w-full rounded-md border border-border bg-background/50 p-2.5 text-sm"
                >
                  <option value="phase1">1ª fase (Pontos corridos)</option>
                  <option value="phase2">2ª fase (Eliminatórias)</option>
                </select>

                {standingsPhase === 'phase1' ? renderStandingsTable(phaseOneStandings) : renderKnockoutBracket()}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-background/60 p-2 sm:grid-cols-4">
              {statsTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveStatsTab(tab.key)}
                  className={`rounded-md px-2 py-2 text-[11px] font-semibold transition-colors ${
                    activeStatsTab === tab.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeStatsTab === 'scorers' && (
              tournamentStats.scorers.length ? (
                <div className="overflow-hidden rounded-xl border border-border/70 bg-background/60">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2">Jogador</th>
                        <th className="px-3 py-2">Time</th>
                        <th className="px-3 py-2 text-right">Gols</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournamentStats.scorers.map((item) => (
                        <tr key={item.playerId} className="border-t border-border/50">
                          <td className="px-3 py-2 font-medium">{item.playerName}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.teamName}</td>
                          <td className="px-3 py-2 text-right font-semibold">{item.goals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : emptyState
            )}

            {activeStatsTab === 'bestPlayers' && (
              tournamentStats.bestPlayers.length ? (
                <div className="overflow-hidden rounded-xl border border-border/70 bg-background/60">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2">Jogador</th>
                        <th className="px-3 py-2">Time</th>
                        <th className="px-3 py-2 text-right">Craque da Partida</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournamentStats.bestPlayers.map((item) => (
                        <tr key={item.playerId} className="border-t border-border/50">
                          <td className="px-3 py-2 font-medium">{item.playerName}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.teamName}</td>
                          <td className="px-3 py-2 text-right font-semibold">{item.playerOfMatchCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : emptyState
            )}

            {activeStatsTab === 'penalties' && (
              tournamentStats.penalties.length ? (
                <div className="overflow-hidden rounded-xl border border-border/70 bg-background/60">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2">Jogador</th>
                        <th className="px-3 py-2">Time</th>
                        <th className="px-3 py-2 text-right">C. A.</th>
                        <th className="px-3 py-2 text-right">C. V.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournamentStats.penalties.map((item) => (
                        <tr key={item.playerId} className="border-t border-border/50">
                          <td className="px-3 py-2 font-medium">{item.playerName}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.teamName}</td>
                          <td className="px-3 py-2 text-right font-semibold">{item.yellowCards}</td>
                          <td className="px-3 py-2 text-right font-semibold">{item.redCards}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : emptyState
            )}

            {activeStatsTab === 'suspensions' && (
              tournamentStats.suspensions.length ? (
                <div className="overflow-hidden rounded-xl border border-border/70 bg-background/60">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2">Jogador</th>
                        <th className="px-3 py-2">Time</th>
                        <th className="px-3 py-2">Início</th>
                        <th className="px-3 py-2">Fim</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournamentStats.suspensions.map((item) => (
                        <tr key={item.playerId} className="border-t border-border/50">
                          <td className="px-3 py-2 font-medium">{item.playerName}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.teamName}</td>
                          <td className="px-3 py-2">{item.startDate}</td>
                          <td className="px-3 py-2">{item.endDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : emptyState
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-3">
            {tournamentMedia.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {tournamentMedia.map((mediaItem) => (
                  <div key={mediaItem.id} className="overflow-hidden rounded-xl border border-border/70 bg-background/60">
                    <div className="aspect-video bg-secondary/40">
                      {mediaItem.thumbnailUrl ? (
                        <img src={mediaItem.thumbnailUrl} alt={mediaItem.title ?? tournament.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 p-3">
                      <p className="text-sm font-semibold">{mediaItem.title ?? 'Mídia da competição'}</p>
                      {mediaItem.description ? <p className="text-xs text-muted-foreground">{mediaItem.description}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : emptyState}
          </div>
        )}
      </div>

      <Dialog
        open={matchDialogOpen}
        onOpenChange={(open) => {
          setMatchDialogOpen(open);
          if (!open) {
            setSelectedAction('menu');
            setSelectedMatchId(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar partida</DialogTitle>
          </DialogHeader>

          {!selectedRawMatch ? null : (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 text-sm">
                <p className="font-semibold">{getTeamNameById(selectedRawMatch.home_team_id)} x {getTeamNameById(selectedRawMatch.away_team_id)}</p>
                <p className="text-muted-foreground">{selectedRawMatch.date} · {selectedRawMatch.round || 'Partida'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
                <button type="button" onClick={() => setSelectedAction('view')} className="rounded-md border border-border/60 px-2 py-2 font-semibold hover:border-primary/50">Ver partida</button>
                <button type="button" onClick={() => setSelectedAction('teams')} className="rounded-md border border-border/60 px-2 py-2 font-semibold hover:border-primary/50">Selecionar equipes</button>
                <button type="button" onClick={() => setSelectedAction('result')} className="rounded-md border border-border/60 px-2 py-2 font-semibold hover:border-primary/50">Editar resultado</button>
                <button type="button" onClick={() => setSelectedAction('info')} className="rounded-md border border-border/60 px-2 py-2 font-semibold hover:border-primary/50">Editar informações</button>
                <button type="button" onClick={removeMatch} className="rounded-md border border-destructive/50 px-2 py-2 font-semibold text-destructive hover:bg-destructive/10">Remover partida</button>
              </div>

              {selectedAction === 'menu' && (
                <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                  Selecione uma ação para gerenciar a partida.
                </div>
              )}

              {selectedAction === 'view' && (
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg border border-border/60 p-3">
                    <p><span className="font-semibold">Placar:</span> {selectedRawMatch.score_home ?? '?'} x {selectedRawMatch.score_away ?? '?'}</p>
                    <p><span className="font-semibold">Local:</span> {selectedRawMatch.location ?? 'Não definido'}</p>
                    <p><span className="font-semibold">Data:</span> {selectedRawMatch.date}</p>
                    <p><span className="font-semibold">Aviso:</span> {selectedRawMatch.warning_notice ?? 'Sem aviso'}</p>
                    <p><span className="font-semibold">Árbitros:</span> {Array.isArray(selectedRawMatch.referees) && selectedRawMatch.referees.length ? selectedRawMatch.referees.join(', ') : 'Não informado'}</p>
                  </div>

                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="mb-2 font-semibold">Eventos da partida</p>
                    {selectedMatchEvents.length ? (
                      <div className="space-y-1">
                        {selectedMatchEvents.map((event) => (
                          <p key={event.id} className="text-muted-foreground">
                            {event.minute ?? 0}' · {event.type} · {getPlayerNameById(event.player_id)} ({getTeamNameById(event.team_id)})
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Sem eventos cadastrados.</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="mb-2 font-semibold">Mídias cadastradas da partida</p>
                    {selectedMatchMedia.length ? (
                      <div className="space-y-2">
                        {selectedMatchMedia.map((mediaItem) => (
                          <div key={mediaItem.id} className="rounded-md border border-border/50 p-2">
                            <p className="font-medium">{mediaItem.title ?? 'Mídia sem título'}</p>
                            <p className="text-xs text-muted-foreground">{mediaItem.type} · {mediaItem.date ?? 'sem data'}</p>
                            {mediaItem.description ? <p className="text-xs text-muted-foreground">{mediaItem.description}</p> : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma mídia vinculada por match_id para esta partida.</p>
                    )}
                  </div>
                </div>
              )}

              {selectedAction === 'teams' && (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipe mandante</label>
                      <select
                        value={selectedHomeTeamId}
                        onChange={(event) => setSelectedHomeTeamId(event.target.value)}
                        className="w-full rounded-md border border-border bg-background/50 p-2.5"
                      >
                        <option value="">Selecione</option>
                        {rawTeams.map((team) => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipe visitante</label>
                      <select
                        value={selectedAwayTeamId}
                        onChange={(event) => setSelectedAwayTeamId(event.target.value)}
                        className="w-full rounded-md border border-border bg-background/50 p-2.5"
                      >
                        <option value="">Selecione</option>
                        {rawTeams.map((team) => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type="button" onClick={saveTeamsSelection} className="w-full rounded-md bg-primary py-2.5 font-semibold text-primary-foreground">
                    Salvar equipes
                  </button>
                </div>
              )}

              {selectedAction === 'result' && (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <input type="number" min={0} value={resultHomeScore} onChange={(event) => setResultHomeScore(event.target.value)} className="rounded-md border border-border bg-background/50 p-2.5" placeholder="Gols mandante" />
                    <input type="number" min={0} value={resultAwayScore} onChange={(event) => setResultAwayScore(event.target.value)} className="rounded-md border border-border bg-background/50 p-2.5" placeholder="Gols visitante" />
                    <input type="number" min={1} value={matchDuration} onChange={(event) => setMatchDuration(event.target.value)} className="rounded-md border border-border bg-background/50 p-2.5" placeholder="Tempo (min)" />
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <textarea value={homePlayersPresent} onChange={(event) => setHomePlayersPresent(event.target.value)} className="min-h-20 rounded-md border border-border bg-background/50 p-2.5" placeholder="Jogadores presentes (mandante) - IDs separados por vírgula" />
                    <textarea value={awayPlayersPresent} onChange={(event) => setAwayPlayersPresent(event.target.value)} className="min-h-20 rounded-md border border-border bg-background/50 p-2.5" placeholder="Jogadores presentes (visitante) - IDs separados por vírgula" />
                  </div>

                  <textarea value={arbitrationRecords} onChange={(event) => setArbitrationRecords(event.target.value)} className="min-h-20 w-full rounded-md border border-border bg-background/50 p-2.5" placeholder="Registros da arbitragem" />

                  <div className="space-y-2 rounded-lg border border-border/60 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Eventos (gols, assistências e cartões)</p>
                      <button type="button" onClick={addResultEvent} className="rounded-md border border-border px-2 py-1 text-xs font-semibold">Adicionar evento</button>
                    </div>

                    {resultEvents.length ? (
                      <div className="space-y-2">
                        {resultEvents.map((event) => (
                          <div key={event.id} className="grid grid-cols-1 gap-2 rounded-md border border-border/50 p-2 sm:grid-cols-5">
                            <select value={event.type} onChange={(value) => updateResultEvent(event.id, 'type', value.target.value)} className="rounded-md border border-border bg-background/50 p-2">
                              <option value="goal">Gol</option>
                              <option value="assist">Assistência</option>
                              <option value="yellow_card">Cartão amarelo</option>
                              <option value="red_card">Cartão vermelho</option>
                            </select>

                            <select value={event.teamId} onChange={(value) => updateResultEvent(event.id, 'teamId', value.target.value)} className="rounded-md border border-border bg-background/50 p-2">
                              <option value="">Time</option>
                              {rawTeams.map((team) => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                              ))}
                            </select>

                            <select value={event.playerId} onChange={(value) => updateResultEvent(event.id, 'playerId', value.target.value)} className="rounded-md border border-border bg-background/50 p-2">
                              <option value="">Jogador</option>
                              {rawPlayers
                                .filter((player) => !event.teamId || player.team_id === event.teamId)
                                .map((player) => (
                                  <option key={player.id} value={player.id}>{player.name}</option>
                                ))}
                            </select>

                            <input value={event.minute} onChange={(value) => updateResultEvent(event.id, 'minute', value.target.value)} type="number" min={0} className="rounded-md border border-border bg-background/50 p-2" placeholder="Min" />

                            <button type="button" onClick={() => removeResultEvent(event.id)} className="rounded-md border border-destructive/50 p-2 text-destructive">Remover</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Nenhum evento cadastrado.</p>
                    )}
                  </div>

                  <button type="button" onClick={saveMatchResult} className="w-full rounded-md bg-primary py-2.5 font-semibold text-primary-foreground">
                    Salvar resultado
                  </button>
                </div>
              )}

              {selectedAction === 'info' && (
                <div className="space-y-3 text-sm">
                  <input value={matchTitle} onChange={(event) => setMatchTitle(event.target.value)} className="w-full rounded-md border border-border bg-background/50 p-2.5" placeholder="Título da partida (rodada/fase)" />

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input value={matchDate} onChange={(event) => setMatchDate(event.target.value)} type="date" className="rounded-md border border-border bg-background/50 p-2.5" />
                    <input value={matchKickoffTime} onChange={(event) => setMatchKickoffTime(event.target.value)} type="time" className="rounded-md border border-border bg-background/50 p-2.5" />
                  </div>

                  <input value={matchLocation} onChange={(event) => setMatchLocation(event.target.value)} className="w-full rounded-md border border-border bg-background/50 p-2.5" placeholder="Local da partida" />

                  <textarea value={matchWarningNotice} onChange={(event) => setMatchWarningNotice(event.target.value)} className="min-h-20 w-full rounded-md border border-border bg-background/50 p-2.5" placeholder="Aviso da partida" />

                  <input value={matchReferees} onChange={(event) => setMatchReferees(event.target.value)} className="w-full rounded-md border border-border bg-background/50 p-2.5" placeholder="Árbitros (separados por vírgula)" />

                  <textarea value={matchAttachments} onChange={(event) => setMatchAttachments(event.target.value)} className="min-h-24 w-full rounded-md border border-border bg-background/50 p-2.5" placeholder="Anexos (uma URL por linha)" />

                  <button type="button" onClick={saveMatchInfo} className="w-full rounded-md bg-primary py-2.5 font-semibold text-primary-foreground">
                    Salvar informações
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentDetail;
