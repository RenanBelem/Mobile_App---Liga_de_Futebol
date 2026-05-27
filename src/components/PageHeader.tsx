/**
 * SRC/COMPONENTS/PAGEHEADER.TSX
 * ===============================
 * PROPÓSITO: Cabeçalho reutilizável para páginas
 * - Exibe título e subtítulo da página
 * - Fornece botão voltar optional
 * - Está fixo no topo com estilos glass-morphism
 * MOTIVO: Componente reutilizável que padroniza cabeçalhos de páginas,
 * mantendo consistência visual e facilitando navegação
 */
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const PageHeader = ({ title, subtitle, showBack }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass-card px-4 py-3">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg font-bold leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
