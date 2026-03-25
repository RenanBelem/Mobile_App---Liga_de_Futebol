import { Trophy, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { league, matches, tournaments } from '@/data/mock';
import MatchCard from '@/components/MatchCard';
import PodiumCard from '@/components/PodiumCard';

const Index = () => {
  const navigate = useNavigate();
  const recentMatches = matches.filter(m => m.status === 'finished').slice(0, 3);
  const upcomingMatches = matches.filter(m => m.status === 'scheduled').slice(0, 2);
  const finishedTournaments = tournaments.filter(t => t.podium);

  return (
    <div className="pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-5 pt-12 pb-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Temporada {league.season}</span>
          </div>
          <h1 className="text-3xl font-black leading-tight">{league.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tournaments.length} torneios · {matches.length} jogos
          </p>
        </div>
      </motion.div>

      <div className="px-4 space-y-6">
        {/* Upcoming */}
        {upcomingMatches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider">Próximos Jogos</h2>
            </div>
            <div className="space-y-2">
              {upcomingMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        )}

        {/* Recent results */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider">Resultados Recentes</h2>
            <button onClick={() => navigate('/tournaments')} className="text-xs text-primary flex items-center gap-0.5">
              Ver todos <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {recentMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>

        {/* Champions */}
        {finishedTournaments.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-champion-gold" /> Campeões
            </h2>
            {finishedTournaments.map(t => (
              <div key={t.id} className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">{t.name}</p>
                {t.podium && <PodiumCard podium={t.podium} />}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
