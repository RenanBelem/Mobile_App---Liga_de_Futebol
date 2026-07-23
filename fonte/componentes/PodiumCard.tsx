/**
 * SRC/componentes/PODIUMCARD.TSX
 * ===============================
 * PROPÓSITO: Componente visual para exibir pódio de campeões
 * - Mostra 1º, 2º e 3º colocados em um pódio visual
 * - Usa cores de ouro, prata e bronze
 * - Inclui animações com Framer Motion
 * MOTIVO: Componente reutilizável para exibir resultados finais de torneios,
 * criando experiência visual atrativa para os usuários
 */
import { Trophy } from 'lucide-react';
import { Podium } from '@/types/league';
import { motion } from 'framer-motion';

interface PodiumCardProps {
  podium: Podium;
}

const PodiumCard = ({ podium }: PodiumCardProps) => {
  const entries = [
    { place: 2, team: podium.second, color: 'bg-champion-silver', label: '2º', height: 'h-20' },
    { place: 1, team: podium.first, color: 'bg-champion-gold', label: '1º', height: 'h-28' },
    { place: 3, team: podium.third, color: 'bg-champion-bronze', label: '3º', height: 'h-16' },
  ];

  return (
    <div className="flex items-end justify-center gap-2 py-4">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.place}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex flex-col items-center">
            {entry.place === 1 && <Trophy className="w-6 h-6 text-champion-gold mb-1" />}
            <span className="text-xs font-bold text-muted-foreground">{entry.team.name}</span>
          </div>
          <div className={`${entry.height} w-20 ${entry.color} rounded-t-lg flex items-start justify-center pt-2`}>
            <span className="text-lg font-black text-background">{entry.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PodiumCard;
