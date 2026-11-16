import {useState} from 'react';
import {ImageOff, Maximize2} from 'lucide-react';
import type {GalleryItem} from '../data/placeholderImages';

interface GalleryTileProps {
  item: GalleryItem;
  onSelect: (item: GalleryItem) => void;
}

// Einzelne Bild-Kachel in der Galerie mit sauberem Fallback und Hell/Dunkel-Unterstützung
export function GalleryTile({item, onSelect}: GalleryTileProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors duration-200 hover:border-zinc-300 dark:border-zinc-800 dark:bg-[#111114] dark:hover:border-zinc-700">
      {/* Kachel-Vorschaubereich im 4:3-Format */}
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-label={`Bild vergrößern: ${item.prompt}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705] dark:bg-zinc-900"
      >
        {hasError ? (
          // Stilvoller Fallback-Container, falls ein Bild nicht geladen werden kann
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 text-center dark:from-zinc-900 dark:to-zinc-950">
            <ImageOff className="h-6 w-6 text-zinc-500" aria-hidden="true" />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              Platzhalterbild nicht verfügbar
            </span>
          </div>
        ) : (
          <img
            src={item.imageUrl}
            alt={item.prompt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        )}

        {/* Dezenter Hinweis zum Vergrößern bei Hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950/85 text-zinc-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      {/* Beschriftung und ungerahmte Metadaten unter dem Bild */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 dark:tracking-[0.01em]">
          {item.prompt}
        </p>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 tabular-nums">
          <span>{item.createdAt}</span>
          <span aria-hidden="true">·</span>
          <span>{item.aspectLabel}</span>
        </div>
      </div>
    </article>
  );
}
