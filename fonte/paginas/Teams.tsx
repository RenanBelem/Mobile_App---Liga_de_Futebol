/**
 * SRC/paginas/TEAMS.TSX
 * ===============================
 * PROPÓSITO: Página de listagem de todos os times da liga
 * - Exibe todos os 25 times cadastrados
 * - Mostra quantidade de jogadores por time
 * - Botão para criar novo time (acesso admin)
 * - Navega para detalhes do time ao clicar
 * MOTIVO: Página importante para visualizar todos os times,
 * oferecendo entrada para detalhe de cada time e gestão
 */
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Plus, Trophy } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import CreateTeamForm from '@/componentes/CreateTeamForm';
import { teamService } from '@/servicos/apiRoutes';

// Importações do shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/componentes/ui/dialog";

const Teams = () => {
  const navigate = useNavigate();
  const teams = useMemo(
    () => [...teamService.list()].sort((left, right) => left.name.localeCompare(right.name, 'pt-BR', { sensitivity: 'base' })),
    [],
  );

  return (
    <div className="pb-20">
      <PageHeader title="Times" subtitle={`${teams.length} times cadastrados`} />
      
      <div className="px-4 pt-4 space-y-6">
        
        {/* Cabeçalho da Lista + Botão de Novo Time */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground/80">Times Cadastrados</h3>
          
          {/* Modal / Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" /> Novo
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-border p-0 overflow-hidden">
              {/* O formulário entra aqui. O p-0 no Content tira o padding padrão para o glass-card do seu form preencher tudo */}
              <CreateTeamForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de times (Intacta) */}
        <div className="space-y-3">
          {teams.map((team, i) => {
            const teamPlayers = teamService.getPlayersByTeam(team.id);

            return (
              <motion.button
                key={team.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/teams/${team.id}`)}
                className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border/80 bg-background/70">
                  {team.logoUrl ? (
                    <img
                      src={team.logoUrl}
                      alt={team.name}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/logos/times/liga.PNG';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: team.colors || 'hsl(var(--muted))' }}>
                      <Shield className="w-6 h-6 text-background" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{team.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{team.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {teamPlayers.length} jogadores</span>
                    {team.titles && team.titles.length > 0 && (
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {team.titles.length} títulos</span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Teams;