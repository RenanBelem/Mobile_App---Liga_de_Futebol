import { Image, Film } from 'lucide-react';
import { mediaItems } from '@/data/mock';
import PageHeader from '@/components/PageHeader';

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
