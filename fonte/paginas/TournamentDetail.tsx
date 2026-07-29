/**
 * SRC/paginas/TOURNAMENTDETAIL.TSX
 * ===============================
 * PROPÓSITO: Página de detalhes de um torneio específico
 * - Exibe informações do torneio (nome, datas, status)
 * - Mostra abas para: Partidas, Classificação, Estatísticas e Histórico
 * - Exibe pódio se torneio está encerrado
 * MOTIVO: Página crucial para visualizar todos os dados de um torneio,
 * incluindo partidas, standings e resultados finais
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import { teamService, tournamentService } from '@/servicos/apiRoutes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/componentes/ui/dialog';
import { jsonRouteRepository } from '@/servicos/jsonRouteRepository';
import { useToast } from '@/ganchos/use-toast';


type Tab = 'standings' | 'matches' | 'stats' | 'media';
type StatsTab = 'scorers' | 'bestPlayers' | 'penalties' | 'suspensions';
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

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const tournament = tournamentService.getById(id ?? '');
  const [activeTab, setActiveTab] = useState<Tab>('standings');
  const [activeStatsTab, setActiveStatsTab] = useState<StatsTab>('scorers');
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
  const locationState = location.state as TournamentDetailLocationState | null;

  const rawMatches = useMemo(() => jsonRouteRepository.get('matches'), []);
  const rawEvents = useMemo(() => jsonRouteRepository.get('matchEvents'), []);
  const rawMedia = useMemo(() => jsonRouteRepository.get('media'), []);
  const rawTeams = useMemo(() => jsonRouteRepository.get('teams'), []);
  const rawPlayers = useMemo(() => jsonRouteRepository.get('players'), []);

  if (!tournament) return <div className="p-4 text-muted-foreground">Torneio não encontrado.</div>;

  const tournamentMatches = id ? tournamentService.getMatchesByTournament(id) : [];
  const tournamentPodium = id ? tournamentService.getPodiumByTournament(id) : undefined;
  const standings = id ? tournamentService.getStandingsByTournament(id) : [];
  const tournamentMedia = id ? tournamentService.getMediaByTournament(id) : [];
  const tournamentStats = id
    ? tournamentService.getStatisticsByTournament(id)
    : { scorers: [], bestPlayers: [], penalties: [], suspensions: [] };

  const selectedRawMatch = useMemo(() => {
    if (!selectedMatchId) {
      return undefined;
    }

    return rawMatches.find((match) => match.id === selectedMatchId);
  }, [rawMatches, selectedMatchId]);

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

  const getTeamNameById = (teamId: string) => {
    const team = rawTeams.find((item) => item.id === teamId);
    return team?.name ?? teamId;
  };

  const getPlayerNameById = (playerId: string) => {
    const player = rawPlayers.find((item) => item.id === playerId);
    return player?.name ?? playerId;
  };

  const openMatchDialog = (matchId: string) => {
    const match = rawMatches.find((item) => item.id === matchId);
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

  const saveTeamsSelection = () => {
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

    jsonRouteRepository.patch('matches', selectedRawMatch.id, {
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

  const saveMatchResult = () => {
    if (!selectedRawMatch) {
      return;
    }

    const nowIso = new Date().toISOString();

    jsonRouteRepository.patch('matches', selectedRawMatch.id, {
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
    currentEvents.forEach((event) => {
      jsonRouteRepository.delete('matchEvents', event.id);
    });

    resultEvents
      .filter((event) => event.playerId && event.teamId)
      .forEach((event) => {
        jsonRouteRepository.post('matchEvents', {
          id: event.id,
          match_id: selectedRawMatch.id,
          player_id: event.playerId,
          team_id: event.teamId,
          type: event.type,
          minute: Number(event.minute) || 0,
          created_at: nowIso,
          updated_at: nowIso,
        });
      });

    toast({
      title: 'Resultado atualizado',
      description: 'Resultado, eventos e registros da partida foram salvos.',
    });

    window.location.reload();
  };

  const saveMatchInfo = () => {
    if (!selectedRawMatch) {
      return;
    }

    jsonRouteRepository.patch('matches', selectedRawMatch.id, {
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

  const removeMatch = () => {
    if (!selectedRawMatch) {
      return;
    }

    const confirmed = window.confirm('Deseja remover esta partida? Esta ação também removerá eventos vinculados.');
    if (!confirmed) {
      return;
    }

    const linkedEvents = rawEvents.filter((event) => event.match_id === selectedRawMatch.id);
    linkedEvents.forEach((event) => {
      jsonRouteRepository.delete('matchEvents', event.id);
    });

    const linkedMedia = rawMedia.filter((mediaItem) => mediaItem.match_id === selectedRawMatch.id);
    linkedMedia.forEach((mediaItem) => {
      jsonRouteRepository.delete('media', mediaItem.id);
    });

    jsonRouteRepository.delete('matches', selectedRawMatch.id);

    toast({
      title: 'Partida removida',
      description: 'A partida e seus vínculos foram removidos.',
    });

    window.location.reload();
  };

  return (
    <div className="pb-20">
      <div className="px-4 pt-2">
        <PageHeader title={tournament.name} subtitle={subtitle} showBack onBack={handleBack} />
      </div>

      <div className="sticky top-[3.5rem] z-30 px-4 pt-3">
        <div className="flex gap-1 rounded-lg border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur">
          {tabs.map(tab => (
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

      <div className="px-4 pt-4">

        {activeTab === 'matches' && (
          <div className="space-y-2">
            {tournamentMatches.length > 0 ? (
              <div className="space-y-2">
                {tournamentMatches.map((match) => {
                  const homeTeam = teamService.getById(match.homeTeamId);
                  const awayTeam = teamService.getById(match.awayTeamId);
                  return (
                    <button
                      key={match.id}
                      type="button"
                      onClick={() => openMatchDialog(match.id)}
                      className="w-full rounded-lg bg-secondary/30 p-3 text-left text-sm transition-colors hover:bg-secondary/50"
                    >
                      <p className="font-semibold">{homeTeam?.name ?? match.homeTeamId} {match.homeScore ?? '?'} x {match.awayScore ?? '?'} {awayTeam?.name ?? match.awayTeamId}</p>
                      <p className="text-muted-foreground">{match.date} · {match.round || 'Partida'}</p>
                    </button>
                  );
                })}
              </div>
            ) : emptyState}
          </div>
        )}

        {activeTab === 'standings' && (
          standings.length > 0 ? (
            <div className="space-y-2">
              {standings.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3 text-sm">
                  <div>
                    <p className="font-semibold">{item.position}. {item.teamName}</p>
                    <p className="text-muted-foreground">{item.wins}V · {item.draws}E · {item.losses}D</p>
                  </div>
                  <span className="font-bold text-primary">{item.points} pts</span>
                </div>
              ))}
            </div>
          ) : emptyState
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
