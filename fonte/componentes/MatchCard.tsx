/**
 * SRC/componentes/MATCHCARD.TSX
 * ===============================
 * PROPÓSITO: Componente de card para exibir informações de uma partida
 * - Mostra times, placar e data da partida
 * - Indica se a partida está concluída ou agendada
 * - Exibe eventos importantes da partida (gols, cartões)
 * MOTIVO: Reutilizável em várias páginas (Home, detalhe de torneio, etc)
 * para exibir dados de partidas de forma consistente
 */
import { Match } from '@/types/league';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getTeamById } from '@/dados/mock';

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const isFinished = match.status === 'finished';
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  if (!homeTeam || !awayTeam) return null;

  return (
    <div className="glass-card rounded-lg p-3">
      {match.round && (
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{match.round}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <p className="text-sm font-semibold truncate">{homeTeam.name}</p>
        </div>
        <div className="mx-4 min-w-[60px] text-center">
          {isFinished ? (
            <p className="text-lg font-black">
              {match.homeScore} <span className="text-muted-foreground">-</span> {match.awayScore}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {format(new Date(match.date), "dd MMM HH'h'", { locale: ptBR })}
            </p>
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold truncate">{awayTeam.name}</p>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
