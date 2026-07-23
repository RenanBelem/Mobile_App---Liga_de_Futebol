/**
 * SRC/paginas/MEDIA.TSX
 * ===============================
 * PROPÓSITO: Página de galéria de mídias (fotos e vídeos)
 * - Exibe mídias da liga (fotos de partidas, celebrações, eventos)
 * - Mostra ícones para distinguir tipo de mídia (foto/vídeo)
 * - Preserva memória visual e históricos da liga
 * MOTIVO: Página importante para preservar memória da liga,
 * oferecendo forma visual atrativa de acessar acervo fotográfico
 */
import { Image, Film, Sparkles } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import { mediaService } from '@/servicos/apiRoutes';

const Media = () => {
  const highlights = mediaService.list().slice(0, 4);

  return (
    <div className="pb-20">
      <PageHeader title="Mídias" subtitle="Fotos, banners e registros da liga" />
      <div className="px-4 pt-4 space-y-4">
        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Acervo visual</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            A página reúne imagens institucionais, banners de temporada e registros visuais de clubes que representam a memória da LFA.
          </p>
        </div>

        {highlights.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">Nenhuma mídia cadastrada.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {highlights.map((item) => (
              <div key={item.id} className="glass-card rounded-lg overflow-hidden border border-border/60">
                <img src={item.url} alt={item.caption || 'Mídia da liga'} className="h-28 w-full object-cover" />
                <div className="p-3 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.type === 'foto' ? <Image className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                    {item.type}
                  </div>
                  <p className="text-sm font-semibold leading-snug">{item.caption}</p>
                  {item.caption && <p className="text-[11px] text-muted-foreground">{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;
