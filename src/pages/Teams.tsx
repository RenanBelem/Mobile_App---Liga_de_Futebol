import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, Plus } from 'lucide-react'; // Adicionei o ícone Plus
import { teams, getPlayersByTeam } from '@/data/mock';
import PageHeader from '@/components/PageHeader';
import CreateTeamForm from '@/components/CreateTeamForm';

// Importações do shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const Teams = () => {
  const navigate = useNavigate();

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
            const teamPlayers = getPlayersByTeam(team.id);

            return (
              <motion.button
                key={team.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/teams/${team.id}`)}
                className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: team.colors || 'hsl(var(--muted))' }}
                >
                  <Shield className="w-6 h-6 text-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{team.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3" /> {teamPlayers.length} jogadores
                  </p>
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