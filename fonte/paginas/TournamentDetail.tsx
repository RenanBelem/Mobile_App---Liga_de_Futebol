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
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import { teamService, tournamentService } from '@/servicos/apiRoutes';


type Tab = 'standings' | 'matches' | 'stats' | 'media';
type StatsTab = 'scorers' | 'bestPlayers' | 'penalties' | 'suspensions';

type TournamentDetailLocationState = {
  selectedSeasonId?: string;
};

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tournament = tournamentService.getById(id ?? '');
  const [activeTab, setActiveTab] = useState<Tab>('standings');
  const [activeStatsTab, setActiveStatsTab] = useState<StatsTab>('scorers');
  const locationState = location.state as TournamentDetailLocationState | null;

  if (!tournament) return <div className="p-4 text-muted-foreground">Torneio não encontrado.</div>;

  const tournamentMatches = id ? tournamentService.getMatchesByTournament(id) : [];
  const tournamentPodium = id ? tournamentService.getPodiumByTournament(id) : undefined;
  const standings = id ? tournamentService.getStandingsByTournament(id) : [];
  const tournamentMedia = id ? tournamentService.getMediaByTournament(id) : [];
  const tournamentStats = id
    ? tournamentService.getStatisticsByTournament(id)
    : { scorers: [], bestPlayers: [], penalties: [], suspensions: [] };

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

  return (
    <div className="pb-20">
      <div className="px-4 pt-2">
        <PageHeader title={tournament.name} subtitle={`${tournament.season} · ${tournament.type === 'cup' ? 'Copa' : 'Liga'}`} showBack onBack={handleBack} />
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

      <div className="px-4 pt-3">
        <div className="rounded-xl border border-border/70 bg-background/60 p-4 space-y-3">
          <p className="text-sm text-muted-foreground">{tournament.description}</p>
          <div className="rounded-lg bg-secondary/40 p-3 text-sm">
            <p className="font-semibold">Temporada: {tournament.season}</p>
            <p className="text-muted-foreground">Dados da competição carregados diretamente do fluxo JSON.</p>
          </div>
          {(tournament.logoUrl || tournament.bannerUrl) && (
            <div className="grid gap-3">
              {tournament.bannerUrl && (
                <div className="rounded-lg overflow-hidden border border-border/60">
                  <img src={tournament.bannerUrl} alt={`Banner de ${tournament.name}`} className="h-36 w-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-3">
                {tournament.logoUrl ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border/60 bg-background/70 shrink-0">
                    <img src={tournament.logoUrl} alt={`Escudo de ${tournament.name}`} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">Identidade visual</p>
                  <p className="text-xs text-muted-foreground">Escudo e banner vinculados ao torneio.</p>
                </div>
              </div>
            </div>
          )}
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
                    <div key={match.id} className="rounded-lg bg-secondary/30 p-3 text-sm">
                      <p className="font-semibold">{homeTeam?.name ?? match.homeTeamId} {match.homeScore ?? '?'} x {match.awayScore ?? '?'} {awayTeam?.name ?? match.awayTeamId}</p>
                      <p className="text-muted-foreground">{match.date} · {match.round || 'Partida'}</p>
                    </div>
                  );
                })}
              </div>
            ) : null}
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
          ) : null
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
              ) : null
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
              ) : null
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
              ) : null
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
              ) : null
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
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentDetail;
