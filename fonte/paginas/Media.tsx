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
import { Image, Film } from 'lucide-react';
import { mediaItems } from '@/dados/mock';
import PageHeader from '@/componentes/PageHeader';

const Media = () => {
  return (
    <div className="pb-20">
      <PageHeader title="Mídias" subtitle="Fotos e vídeos da liga" />
      <div className="px-4 pt-4">
        {mediaItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">Nenhuma mídia cadastrada.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {mediaItems.map(item => (
              <div key={item.id} className="glass-card rounded-lg overflow-hidden aspect-square flex flex-col items-center justify-center gap-2 p-3">
                {item.type === 'photo' ? (
                  <Image className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <Film className="w-8 h-8 text-muted-foreground" />
                )}
                <p className="text-[10px] text-muted-foreground text-center leading-tight">{item.caption}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;
