/**
 * SRC/paginas/TOURNAMENTS.TSX
 * ===============================
 * PROPÓSITO: Página de listagem de todos os torneios da liga
 * - Exibe todos os torneios (em andamento, encerrados, em breve)
 * - Mostra status de cada torneio com cores diferenciadas
 * - Navega para detalhes do torneio ao clicar
 * MOTIVO: Página central para acompanhar competições,
 * permitindo usuários ver torneios e seus resultados
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, ScrollText } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import { tournamentService } from '@/servicos/apiRoutes';

const statusLabel: Record<string, string> = {
  ongoing: 'Em andamento',
  finished: 'Encerrado',
  upcoming: 'Em breve',
};

const statusColor: Record<string, string> = {
  ongoing: 'bg-primary/20 text-primary',
  finished: 'bg-muted text-muted-foreground',
  upcoming: 'bg-accent/20 text-accent',
};

const Tournaments = () => {
  const navigate = useNavigate();
  const tournaments = tournamentService.list();

  return (
    <div className="pb-20">
      <PageHeader title="Torneios" subtitle="Campeonatos e Copas" />
      <div className="px-4 pt-4 space-y-3">
        {tournaments.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => navigate(`/tournaments/${t.id}`)}
            className="w-full glass-card rounded-lg p-4 text-left hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border/60 bg-background/70">
                  {t.logoUrl ? <img src={t.logoUrl} alt={t.name} className="w-full h-full object-cover" /> : <Trophy className="w-5 h-5 m-auto text-primary" />}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t.description}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}>
                {statusLabel[t.status]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.season}</span>
              <span>{t.type === 'cup' ? 'Copa' : 'Liga'}</span>
              <span className="flex items-center gap-1"><ScrollText className="w-3 h-3" />{t.format}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
