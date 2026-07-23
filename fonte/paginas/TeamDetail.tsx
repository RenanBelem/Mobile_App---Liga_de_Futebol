/**
 * SRC/paginas/TEAMDETAIL.TSX
 * ===============================
 * PROPÓSITO: Página de detalhes de um time específico
 * - Exibe informações do time (nome, cores, fundação)
 * - Lista todos os jogadores cadastrados para o time
 * - Botão voltar e navegação de volta para Times
 * MOTIVO: Página de detalhe que oferece informações aprofundadas
 * sobre cada time e seus integrantes
 */
import { useParams } from 'react-router-dom';
import { Shield, Trophy, CalendarRange, Image as ImageIcon } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import { teamService } from '@/servicos/apiRoutes';

const TeamDetail = () => {
  const { id } = useParams();
  const team = teamService.getById(id ?? '');
  const teamPlayers = id ? teamService.getPlayersByTeam(id) : [];
  const recentResults = id ? teamService.getRecentResults(id) : [];
  const media = id ? teamService.getMedia(id) : [];

  if (!team) return <div className="p-4 text-muted-foreground">Time não encontrado.</div>;

  return (
    <div className="pb-20">
      <PageHeader title={team.name} showBack />

      <div className="px-4 pt-4 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-border/80 bg-background/70 shrink-0">
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: team.colors || 'hsl(var(--muted))' }}>
                <Shield className="w-8 h-8 text-background" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-black">{team.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
            <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
              {team.foundationYear && <span className="rounded-full bg-secondary/70 px-2 py-1">Fundação: {team.foundationYear}</span>}
              {team.slug && <span className="rounded-full bg-secondary/70 px-2 py-1">{team.slug}</span>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Biografia</h3>
          <p className="text-sm text-muted-foreground">{team.biography || team.history}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Histórico</h3>
          <p className="text-sm text-muted-foreground">{team.history || team.biography}</p>
        </div>

        {team.uniformUrl && (
          <div className="rounded-xl border border-border/70 bg-background/60 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Uniforme</h3>
            <img src={team.uniformUrl} alt={`Uniforme de ${team.name}`} className="w-full rounded-lg object-cover" />
          </div>
        )}

        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Títulos</h3>
          </div>
          {team.titles && team.titles.length > 0 ? (
            <div className="space-y-2">
              {team.titles.map((item, index) => (
                <div key={`${item.competition}-${item.season}-${index}`} className="flex items-center justify-between text-sm">
                  <span>{item.competition}</span>
                  <span className="text-muted-foreground">{item.season}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Ainda sem títulos registrados na base da wiki.</p>
          )}
        </div>

        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarRange className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Resultados recentes</h3>
          </div>
          <div className="space-y-2">
            {recentResults.map((item, index) => (
              <div key={`${item.competitionName}-${index}`} className="rounded-lg bg-secondary/40 p-3 text-sm">
                <p className="font-semibold">{item.competitionName}</p>
                <p className="text-muted-foreground">{item.result}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Mídias</h3>
          </div>
          {media.length > 0 ? (
            <div className="grid gap-3">
              {media.map((item, index) => (
                <div key={`${item.url}-${index}`} className="rounded-lg overflow-hidden border border-border/60">
                  <img src={item.url} alt={item.caption || team.name} className="w-full h-40 object-cover" />
                  {item.caption && <p className="p-2 text-xs text-muted-foreground">{item.caption}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sem fotos cadastradas ainda para este time.</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Elenco</h3>
          <div className="space-y-2">
            {teamPlayers.map(player => (
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
                <div className="flex gap-3 text-center">
                  <div>
                    <p className="text-sm font-bold text-primary">-</p>
                    <p className="text-[10px] text-muted-foreground">Gols</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">-</p>
                    <p className="text-[10px] text-muted-foreground">Ass.</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">-</p>
                    <p className="text-[10px] text-muted-foreground">Jogos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
