import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';
import { tournaments } from '@/data/mock';
import PageHeader from '@/components/PageHeader';

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
                <Trophy className="w-4 h-4 text-primary" />
                <p className="font-bold text-sm">{t.name}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}>
                {statusLabel[t.status]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t.season}</span>
              <span>{t.type === 'cup' ? 'Copa' : 'Liga'}</span>
              <span>{t.matches.length} jogos</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
