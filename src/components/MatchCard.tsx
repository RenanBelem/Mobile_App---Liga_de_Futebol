import { Match } from '@/types/league';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const isFinished = match.status === 'finished';

  return (
    <div className="glass-card rounded-lg p-3">
      {match.round && (
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{match.round}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <p className="text-sm font-semibold truncate">{match.homeTeam.name}</p>
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
          <p className="text-sm font-semibold truncate">{match.awayTeam.name}</p>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
