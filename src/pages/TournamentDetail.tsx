import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { tournaments, teams } from '@/data/mock';
import PageHeader from '@/components/PageHeader';
import MatchCard from '@/components/MatchCard';
import StandingsTable from '@/components/StandingsTable';
import PodiumCard from '@/components/PodiumCard';
import { Player } from '@/types/league';

type Tab = 'matches' | 'standings' | 'stats' | 'media';

const TournamentDetail = () => {
  const { id } = useParams();
  const tournament = tournaments.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState<Tab>('matches');

  if (!tournament) return <div className="p-4 text-muted-foreground">Torneio não encontrado.</div>;

  const allPlayers: Player[] = teams.flatMap(t => t.players);
  const topScorers = [...allPlayers]
    .filter(p => p.stats)
    .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
    .slice(0, 5);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'matches', label: 'Jogos' },
    { key: 'standings', label: 'Classificação' },
    { key: 'stats', label: 'Estatísticas' },
    { key: 'media', label: 'Mídias' },
  ];

  return (
    <div className="pb-20">
      <PageHeader title={tournament.name} subtitle={`${tournament.season} · ${tournament.type === 'cup' ? 'Copa' : 'Liga'}`} showBack />

      {tournament.podium && (
        <div className="px-4 pt-2">
          <PodiumCard podium={tournament.podium} />
        </div>
      )}

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
            {tournament.matches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum jogo cadastrado.</p>
            ) : (
              tournament.matches.map(m => <MatchCard key={m.id} match={m} />)
            )}
          </div>
        )}

        {activeTab === 'standings' && (
          tournament.standings.length > 0 ? (
            <StandingsTable standings={tournament.standings} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Sem classificação disponível.</p>
          )
        )}

        {activeTab === 'stats' && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground">Artilharia</h3>
            <div className="space-y-2">
              {topScorers.map((player, i) => {
                const team = teams.find(t => t.id === player.teamId);
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
                        <p className="text-[10px] text-muted-foreground">{team?.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-sm font-bold text-primary">{player.stats?.goals}</p>
                        <p className="text-[10px] text-muted-foreground">Gols</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{player.stats?.assists}</p>
                        <p className="text-[10px] text-muted-foreground">Ass.</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma mídia cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default TournamentDetail;
