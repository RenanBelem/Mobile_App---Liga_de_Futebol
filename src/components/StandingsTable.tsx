/**
 * SRC/COMPONENTS/STANDINGSTABLE.TSX
 * ===============================
 * PROPÓSITO: Tabela de classificação de times em um torneio
 * - Exibe posição, time, pontos, vitórias, empates, derrotas
 * - Destaca top-3 com cores de podium (ouro, prata, bronze)
 * - Formata dados para visualização em tela pequena
 * MOTIVO: Componente essencial para exibir standings em torneios,
 * permitindo usuários acompanhar classificação em tempo real
 */
import { StandingEntry } from '@/types/league';

interface StandingsTableProps {
  standings: StandingEntry[];
}

const StandingsTable = ({ standings }: StandingsTableProps) => {
  const positionColor = (pos: number) => {
    if (pos === 1) return 'text-champion-gold';
    if (pos === 2) return 'text-champion-silver';
    if (pos === 3) return 'text-champion-bronze';
    return 'text-muted-foreground';
  };

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2.5 px-3 text-muted-foreground font-medium">#</th>
            <th className="text-left py-2.5 px-2 text-muted-foreground font-medium">Time</th>
            <th className="py-2.5 px-1 text-muted-foreground font-medium">J</th>
            <th className="py-2.5 px-1 text-muted-foreground font-medium">V</th>
            <th className="py-2.5 px-1 text-muted-foreground font-medium">E</th>
            <th className="py-2.5 px-1 text-muted-foreground font-medium">D</th>
            <th className="py-2.5 px-1 text-muted-foreground font-medium">SG</th>
            <th className="py-2.5 px-2 text-muted-foreground font-bold">P</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((entry) => (
            <tr key={entry.position} className="border-b border-border/30 last:border-0">
              <td className={`py-2.5 px-3 font-bold ${positionColor(entry.position)}`}>
                {entry.position}
              </td>
              <td className="py-2.5 px-2 font-semibold truncate max-w-[100px]">{entry.team.name}</td>
              <td className="py-2.5 px-1 text-center text-muted-foreground">{entry.played}</td>
              <td className="py-2.5 px-1 text-center text-muted-foreground">{entry.won}</td>
              <td className="py-2.5 px-1 text-center text-muted-foreground">{entry.drawn}</td>
              <td className="py-2.5 px-1 text-center text-muted-foreground">{entry.lost}</td>
              <td className="py-2.5 px-1 text-center text-muted-foreground">{entry.goalsFor - entry.goalsAgainst}</td>
              <td className="py-2.5 px-2 text-center font-bold">{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;
