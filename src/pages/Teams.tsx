import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users } from 'lucide-react';
import { teams } from '@/data/mock';
import PageHeader from '@/components/PageHeader';

const Teams = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <PageHeader title="Times" subtitle={`${teams.length} times cadastrados`} />
      <div className="px-4 pt-4 space-y-3">
        {teams.map((team, i) => (
          <motion.button
            key={team.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/teams/${team.id}`)}
            className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: team.colors || 'hsl(var(--muted))' }}
            >
              <Shield className="w-6 h-6 text-background" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{team.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Users className="w-3 h-3" /> {team.players.length} jogadores
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Teams;
