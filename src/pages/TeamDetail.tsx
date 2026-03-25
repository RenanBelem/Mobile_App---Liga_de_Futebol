import { useParams } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { teams } from '@/data/mock';
import PageHeader from '@/components/PageHeader';

const TeamDetail = () => {
  const { id } = useParams();
  const team = teams.find(t => t.id === id);

  if (!team) return <div className="p-4 text-muted-foreground">Time não encontrado.</div>;

  return (
    <div className="pb-20">
      <PageHeader title={team.name} showBack />

      <div className="px-4 pt-4">
        {/* Team banner */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: team.colors || 'hsl(var(--muted))' }}
          >
            <Shield className="w-8 h-8 text-background" />
          </div>
          <div>
            <h2 className="text-xl font-black">{team.name}</h2>
            <p className="text-xs text-muted-foreground">{team.players.length} jogadores</p>
          </div>
        </div>

        {/* Players */}
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Elenco</h3>
        <div className="space-y-2">
          {team.players.map(player => (
            <div key={player.id} className="glass-card rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                  {player.number || '-'}
                </span>
                <div>
                  <p className="text-sm font-semibold">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.position}</p>
                </div>
              </div>
              {player.stats && (
                <div className="flex gap-3 text-center">
                  <div>
                    <p className="text-sm font-bold text-primary">{player.stats.goals}</p>
                    <p className="text-[10px] text-muted-foreground">Gols</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{player.stats.assists}</p>
                    <p className="text-[10px] text-muted-foreground">Ass.</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{player.stats.gamesPlayed}</p>
                    <p className="text-[10px] text-muted-foreground">Jogos</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
