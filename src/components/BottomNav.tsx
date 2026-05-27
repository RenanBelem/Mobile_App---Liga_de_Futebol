/**
 * SRC/COMPONENTS/BOTTOMNAV.TSX
 * ===============================
 * PROPÓSITO: Barra de navegação fixa no rodapé da aplicação
 * - Fornece acesso rápido às páginas principais (Home, Torneios, Times, Mídias, Mais)
 * - Destaca a página ativa com animações
 * - Design mobile-first com atalhos de navegação por cones
 * MOTIVO: Componente essencial para navegação em apps mobile,
 * oferecendo acesso intuitivo sem ocupar espaço da tela principal
 */
import { Home, Users, Trophy, Image, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: Trophy, label: 'Torneios', path: '/tournaments' },
  { icon: Users, label: 'Times', path: '/teams' },
  { icon: Image, label: 'Mídias', path: '/media' },
  { icon: Menu, label: 'Mais', path: '/more' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon
                className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
