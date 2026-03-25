import { Settings, UserPlus, ShieldPlus, Trophy, Info } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const menuItems = [
  { icon: UserPlus, label: 'Cadastrar Usuário', desc: 'Adicionar novo membro' },
  { icon: ShieldPlus, label: 'Cadastrar Time', desc: 'Criar novo time' },
  { icon: Trophy, label: 'Cadastrar Torneio', desc: 'Criar campeonato ou copa' },
  { icon: Settings, label: 'Configurações', desc: 'Preferências do app' },
  { icon: Info, label: 'Sobre', desc: 'Informações da liga' },
];

const More = () => {
  return (
    <div className="pb-20">
      <PageHeader title="Mais" subtitle="Administração e configurações" />
      <div className="px-4 pt-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default More;
