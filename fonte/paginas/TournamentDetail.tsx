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
import { useParams } from 'react-router-dom';
import { Button } from '@/componentes/ui/button';
import { Plus, History, BookOpenText, Image as ImageIcon } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import { teamService, tournamentService } from '@/servicos/apiRoutes';
import { Player } from '@/tipos/league';


type Tab = 'matches' | 'standings' | 'stats' | 'history';

const TournamentDetail = () => {
  const { id } = useParams();
  const tournament = tournamentService.getById(id ?? '');
  const [activeTab, setActiveTab] = useState<Tab>('matches');

  if (!tournament) return <div className="p-4 text-muted-foreground">Torneio não encontrado.</div>;

  const tournamentMatches = id ? tournamentService.getMatchesByTournament(id) : [];
  const tournamentPodium = id ? tournamentService.getPodiumByTournament(id) : undefined;
  const standings = id ? tournamentService.getStandingsByTournament(id) : [];
  const allPlayers: Player[] = [];
  const topScorers = [...allPlayers].slice(0, 5);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'matches', label: 'Jogos' },
    { key: 'standings', label: 'Classificação' },
    { key: 'stats', label: 'Estatísticas' },
    { key: 'history', label: 'Histórico' },
  ];

  return (
    <div className="pb-20">
      <div className="px-4 pt-2">
        <PageHeader title={tournament.name} subtitle={`${tournament.season} · ${tournament.type === 'cup' ? 'Copa' : 'Liga'}`} showBack />
      </div>

      <div className="px-4 pt-4">
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

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'matches' && (
          <div className="space-y-2">
            <Button className="w-full mb-4 gap-2" variant="secondary">
              <Plus className="w-4 h-4" /> Novo Jogo
            </Button>
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
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum jogo disponível para esta competição.</p>
            )}
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
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Sem classificação disponível.</p>
          )
        )}

        {activeTab === 'stats' && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground">Artilharia</h3>
            <div className="space-y-2">
              {topScorers.map((player, i) => {
                const teamName = player.teamId;
                return (
                  <div key={player.id} className="glass-card rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-champion-gold text-background' :
                        i === 1 ? 'bg-champion-silver text-background' :
                        i === 2 ? 'bg-champion-bronze text-background' :
                        'bg-secondary text-secondary-foreground'
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{player.name}</p>
                        <p className="text-[10px] text-muted-foreground">{teamName}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-sm font-bold text-primary">—</p>
                        <p className="text-[10px] text-muted-foreground">Gols</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold">—</p>
                        <p className="text-[10px] text-muted-foreground">Ass.</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <History className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Histórico da competição</h3>
              </div>
              <p className="text-sm text-muted-foreground">{tournament.history || tournament.description}</p>
            </div>
            {tournamentPodium && (
              <div className="rounded-xl border border-border/70 bg-background/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpenText className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Resumo da fase</h3>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Campeão:</span> {teamService.getById(tournamentPodium.firstPlaceId)?.name ?? 'Equipe'}</p>
                  <p><span className="font-semibold text-foreground">Vice:</span> {teamService.getById(tournamentPodium.secondPlaceId)?.name ?? 'Equipe'}</p>
                  <p><span className="font-semibold text-foreground">Terceiro:</span> {teamService.getById(tournamentPodium.thirdPlaceId)?.name ?? 'Equipe'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentDetail;
