// Datenmodell und lokale Platzhalter-Bilder für das Bild-Studio

export interface GalleryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  aspectLabel: string;
}

// Pool aus lokal erzeugten Platzhalterbildern (keine externen Dienste)
export const PLACEHOLDER_POOL: Array<{
  imageUrl: string;
  defaultPrompt: string;
}> = [
  {
    imageUrl: '/src/assets/images/studio_alpine_architecture_1794850667625.jpg',
    defaultPrompt: 'Minimalistischer Betonpavillon über nebeligen Alpengipfeln zur blauen Stunde',
  },
  {
    imageUrl: '/src/assets/images/studio_botanical_glasshouse_1794850667640.jpg',
    defaultPrompt: 'Historisches Gewächshaus aus Eisen und Glas in der Abenddämmerung',
  },
  {
    imageUrl: '/src/assets/images/studio_ceramic_still_life_1794850669521.jpg',
    defaultPrompt: 'Stillleben handgefertigter Keramikgefäße auf dunklem Schiefer',
  },
  {
    imageUrl: '/src/assets/images/studio_coastal_lighthouse_1794850668319.jpg',
    defaultPrompt: 'Nordische Basaltküste mit schlichtem Leuchtturm unter grauen Wolken',
  },
];

// Initiale Galerie-Kacheln beim Start der Anwendung
export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'init-1',
    prompt: PLACEHOLDER_POOL[0].defaultPrompt,
    imageUrl: PLACEHOLDER_POOL[0].imageUrl,
    createdAt: 'Vorlage 01',
    aspectLabel: '4:3',
  },
  {
    id: 'init-2',
    prompt: PLACEHOLDER_POOL[1].defaultPrompt,
    imageUrl: PLACEHOLDER_POOL[1].imageUrl,
    createdAt: 'Vorlage 02',
    aspectLabel: '4:3',
  },
  {
    id: 'init-3',
    prompt: PLACEHOLDER_POOL[2].defaultPrompt,
    imageUrl: PLACEHOLDER_POOL[2].imageUrl,
    createdAt: 'Vorlage 03',
    aspectLabel: '4:3',
  },
];
