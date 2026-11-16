import {useEffect} from 'react';
import {X} from 'lucide-react';
import type {GalleryItem} from '../data/placeholderImages';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

// Vollbild-Ansicht (Lightbox) beim Klick auf eine Galerie-Kachel
export function LightboxModal({item, onClose}: LightboxModalProps) {
  // Schließen per Escape-Taste ermöglichen
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bildansicht"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs sm:p-8 dark:bg-black/90"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#111114]"
      >
        {/* Kopfleiste der Großansicht mit Schließen-Button */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-3.5 dark:border-zinc-800">
          <span className="font-mono text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
            {item.createdAt} · {item.aspectLabel}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 whitespace-nowrap shrink-0 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <span>Schließen</span>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Großformatige Bilddarstellung */}
        <div className="flex items-center justify-center bg-zinc-950 p-2 sm:p-4 dark:bg-black">
          <img
            src={item.imageUrl}
            alt={item.prompt}
            referrerPolicy="no-referrer"
            className="max-h-[68vh] w-auto rounded-lg object-contain"
          />
        </div>

        {/* Zugehöriger Prompt-Text */}
        <div className="border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {item.prompt}
          </p>
        </div>
      </div>
    </div>
  );
}
