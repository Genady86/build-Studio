/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useEffect, useRef, useState, type FormEvent, type KeyboardEvent} from 'react';
import {Gem, ImagePlus, Loader2, Moon, RotateCcw, Sun} from 'lucide-react';
import {GalleryTile} from './components/GalleryTile';
import {LightboxModal} from './components/LightboxModal';
import {BackendStatus} from './components/BackendStatus';
import {
  INITIAL_GALLERY_ITEMS,
  PLACEHOLDER_POOL,
  type GalleryItem,
} from './data/placeholderImages';

// Dauer der simulierten Bilderzeugung in Millisekunden (3 Sekunden)
const GENERATION_DURATION_MS = 3000;
// Startwert und Kosten pro Bildgenerierung für das Platzhalter-Gems-System
const INITIAL_GEMS = 10;
const GEM_COST_PER_IMAGE = 2;

type ThemeMode = 'dark' | 'light';

export default function App() {
  // Design-Zustand (standardmäßig dunkles Design)
  const [theme, setTheme] = useState<ThemeMode>('dark');
  // Zustand für Prompt-Text, Ladezustand, Gems-Konto und Galerie-Einträge
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gems, setGems] = useState<number>(INITIAL_GEMS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Zähler für rotierende Platzhalterbilder und Timer-Referenz zum sauberen Aufräumen
  const poolIndexRef = useRef(3);
  const timerRef = useRef<number | null>(null);

  // Klasse ".dark" am HTML-Wurzelelement synchron halten
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Laufenden Timer beim Verlassen der Komponente abbrechen
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Reduziert den aktuellen Gem-Stand um den angegebenen Betrag
  const deductGems = (amount: number) => {
    setGems((prevGems) => Math.max(0, prevGems - amount));
  };

  // Setzt den Platzhalter-Gem-Stand wieder auf den Ausgangswert zurück
  const handleResetGems = () => {
    setGems(INITIAL_GEMS);
  };

  const hasEnoughGems = gems >= GEM_COST_PER_IMAGE;

  // Startet die 3-sekündige Platzhalter-Generierung und aktualisiert anschließend Galerie & Gems
  const handleGenerate = (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    if (isGenerating || !hasEnoughGems) return;

    const trimmedPrompt = prompt.trim();
    const nextAsset = PLACEHOLDER_POOL[poolIndexRef.current % PLACEHOLDER_POOL.length];
    poolIndexRef.current += 1;

    // Fallback-Beschreibung nutzen, falls das Textfeld leer gelassen wurde
    const finalPrompt = trimmedPrompt.length > 0 ? trimmedPrompt : nextAsset.defaultPrompt;

    setIsGenerating(true);

    timerRef.current = window.setTimeout(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Neues Platzhalterbild am Anfang der Galerie einfügen
      const newItem: GalleryItem = {
        id: `gen-${Date.now()}`,
        prompt: finalPrompt,
        imageUrl: nextAsset.imageUrl,
        createdAt: `Heute, ${timeLabel}`,
        aspectLabel: '4:3',
      };

      setGalleryItems((prev) => [newItem, ...prev]);
      deductGems(GEM_COST_PER_IMAGE);
      setIsGenerating(false);
      timerRef.current = null;
    }, GENERATION_DURATION_MS);
  };

  // Generierung bequem per Strg+Enter oder Cmd+Enter auslösen
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#09090B] dark:text-zinc-100">
      {/* Kopfzeile mit App-Namen, Navigation und aktueller Gems-Anzeige oben rechts */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur-md transition-colors duration-200 dark:border-zinc-800/80 dark:bg-[#09090B]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          {/* Bereich 1: Wortmarke */}
          <a
            href="#erstellen"
            className="font-display text-lg font-semibold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 dark:text-white"
          >
            Bild-Studio
          </a>

          {/* Bereich 2: Schlichte Navigationslinks */}
          <nav
            aria-label="Hauptnavigation"
            className="hidden items-center gap-6 text-sm font-medium text-zinc-600 sm:flex dark:text-zinc-400"
          >
            <a
              href="#erstellen"
              className="transition-colors hover:text-zinc-950 whitespace-nowrap shrink-0 dark:hover:text-white"
            >
              Erstellen
            </a>
            <a
              href="#galerie"
              className="transition-colors hover:text-zinc-950 whitespace-nowrap shrink-0 dark:hover:text-white"
            >
              Galerie
            </a>
          </nav>

          {/* Bereich 3: Aktueller Gem-Stand oben rechts */}
          <div
            aria-live="polite"
            aria-label={`Aktueller Gem-Stand: ${gems}`}
            className="flex items-center gap-2 font-mono text-sm font-medium text-zinc-800 tabular-nums whitespace-nowrap shrink-0 dark:text-zinc-200"
          >
            <Gem
              className="h-4 w-4 text-amber-600 dark:text-[#F2B705]"
              aria-hidden="true"
            />
            <span>Gems: {gems}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="mb-5 flex justify-end">
          <BackendStatus />
        </div>
        {/* Bereich für die Prompt-Eingabe, Design-Umschaltung und den Generieren-Button */}
        <section id="erstellen" aria-labelledby="erstellen-titel" className="mb-14">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <h1
                id="erstellen-titel"
                className="font-display text-3xl font-semibold tracking-tight text-zinc-950 text-balance sm:text-4xl dark:text-white"
              >
                Neues Motiv entwerfen
              </h1>
              <p className="mt-2.5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Beschreibe deine Bildidee im Textfeld und starte eine Vorschau mit
                lokalen Platzhalter-Daten.
              </p>
            </div>

            {/* Umschalter zwischen dunklem und hellem Design */}
            <div
              role="group"
              aria-label="Farbdesign wählen"
              className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-[#111114]"
            >
              <button
                type="button"
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  theme === 'dark'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Dunkel</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  theme === 'light'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Hell</span>
              </button>
            </div>
          </div>

          <form
            onSubmit={handleGenerate}
            className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors duration-200 sm:p-6 dark:border-zinc-800 dark:bg-[#111114]"
          >
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="prompt-eingabe"
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Prompt
              </label>
              <span className="font-mono text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
                Kosten: {GEM_COST_PER_IMAGE} Gems pro Bild
              </span>
            </div>

            <textarea
              id="prompt-eingabe"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              rows={5}
              placeholder="Beschreibe dein gewünschtes Motiv, z. B. Ein minimalistischer Betonpavillon im Hochgebirge bei Dämmerung..."
              className="min-h-[140px] w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base leading-relaxed text-zinc-900 placeholder:text-zinc-500 transition-colors focus:border-amber-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-[#09090B] dark:text-zinc-100 dark:focus:border-[#F2B705]"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              {/* Statusmeldung, Hinweis auf fehlende Gems oder Tastenkürzel */}
              <div
                aria-live="polite"
                className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"
              >
                {isGenerating ? (
                  <span className="inline-flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-200">
                    <Loader2
                      className="h-4 w-4 animate-spin text-amber-600 dark:text-[#F2B705]"
                      aria-hidden="true"
                    />
                    <span>Wird erzeugt...</span>
                  </span>
                ) : !hasEnoughGems ? (
                  <>
                    <span className="font-medium text-rose-700 dark:text-rose-400">
                      Nicht genügend Gems verfügbar ({gems} von {GEM_COST_PER_IMAGE} benötigt)
                    </span>
                    <button
                      type="button"
                      onClick={handleResetGems}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-100 whitespace-nowrap shrink-0 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Gems auf {INITIAL_GEMS} zurücksetzen</span>
                    </button>
                  </>
                ) : (
                  <span>Tipp: Strg + Eingabe zum Starten</span>
                )}
              </div>

              {/* Primäre Aktion: Generieren-Button */}
              <button
                type="submit"
                disabled={isGenerating || !hasEnoughGems}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#F2B705] px-6 py-2.5 text-sm font-semibold text-zinc-950 transition-colors duration-150 hover:bg-[#e5ad04] active:translate-y-px disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 whitespace-nowrap shrink-0 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Wird erzeugt...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                    <span>Generieren</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Galerie-Bereich für erzeugte Bilder als Kacheln */}
        <section id="galerie" aria-labelledby="galerie-titel">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800/80">
            <h2
              id="galerie-titel"
              className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white"
            >
              Galerie
            </h2>
            <p className="font-mono text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
              {galleryItems.length} {galleryItems.length === 1 ? 'Bild' : 'Bilder'} · Platzhalter-Modus
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Aktive Platzhalter-Kachel während der 3-sekündigen Erzeugung */}
            {isGenerating && (
              <div
                aria-busy="true"
                className="flex flex-col overflow-hidden rounded-2xl border border-amber-500/50 bg-white dark:border-[#F2B705]/40 dark:bg-[#111114]"
              >
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-zinc-100 p-6 text-center dark:bg-zinc-900/90">
                  <Loader2
                    className="h-7 w-7 animate-spin text-amber-600 dark:text-[#F2B705]"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Wird erzeugt...
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                  <p className="line-clamp-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {prompt.trim() || 'Neues Platzhalter-Motiv wird vorbereitet'}
                  </p>
                  <span className="font-mono text-xs text-zinc-500">Vorschau · 4:3</span>
                </div>
              </div>
            )}

            {/* Vorhandene und neu erzeugte Bild-Kacheln */}
            {galleryItems.map((item) => (
              <GalleryTile
                key={item.id}
                item={item}
                onSelect={(clickedItem) => setSelectedItem(clickedItem)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Großansicht beim Klick auf eine Bild-Kachel */}
      <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
