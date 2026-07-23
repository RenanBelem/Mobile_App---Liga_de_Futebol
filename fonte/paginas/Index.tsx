/**
 * SRC/paginas/INDEX.TSX
 * ===============================
 * PROPÓSITO: Página inicial (Home) da aplicação
 * - Exibe informações gerais da liga (nome, temporada, quantidade de torneios/jogos)
 * - Mostra partidas recentes e próximas
 * - Exibe torneios encerrados com seus pódios
 * - É o primeiro ponto de contato do usuário com a aplicação
 * MOTIVO: Página essencial que oferece visão geral do estado atual da liga,
 * permitindo usuários navegarem rapidamente para outras seções
 */
import { Trophy, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MatchCard from '@/componentes/MatchCard';
import PodiumCard from '@/componentes/PodiumCard';
import { overviewService } from '@/servicos/apiRoutes';

const Index = () => {
  const navigate = useNavigate();
  const overview = overviewService.getHomeOverview();
  const recentMatches = overview.recentMatches;
  const upcomingMatches = overview.upcomingMatches;
  const finishedTournaments = overview.finishedTournaments;

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
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Temporada {overview.league.season}</span>
          </div>
          <h1 className="text-3xl font-black leading-tight">{overview.league.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {overview.totalTournaments} torneios · {overview.totalMatches} jogos
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
