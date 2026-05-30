/**
 * Image Configuration — Dynamic via Vite import.meta.glob
 * ─────────────────────────────────────────────────────────────────────────────
 * Simply drop images into any of these folders and they'll appear automatically:
 *
 *   public/photos/hero/          → Hero slideshow
 *   public/photos/portraits/     → Portraits gallery (hi-res, lightbox)
 *   public/photos/still-life/    → Still life gallery
 *   public/photos/landscapes/    → Landscapes gallery
 *
 *   public/photos/portraits/thumbs/    → Low-res previews (optional)
 *   public/photos/still-life/thumbs/   → Low-res previews (optional)
 *   public/photos/landscapes/thumbs/   → Low-res previews (optional)
 *
 * If a thumbs/ version is missing the site falls back to the hi-res version.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Category = 'portraits' | 'still-life' | 'landscapes';

export interface Photo {
  id: string;
  src: string;    // hi-res  (lightbox)
  thumb: string;  // low-res (grid preview)
  category: Category;
}

// ── Vite build-time glob scans ─────────────────────────────────────────────

// Hero images are loaded at runtime from /photos/hero/ (public directory)
// to avoid duplicates from Vite's build-time processing.
function getHeroPhotos(): string[] {
  // In development, use Vite's glob; in production, rely on runtime fetch
  if (import.meta.env.DEV) {
    const mods = import.meta.glob(
      '/public/photos/hero/*.{jpg,jpeg,png,webp}',
      { eager: true, query: '?url', import: 'default' }
    ) as Record<string, string>;
    return Object.values(mods);
  }
  // In production, return empty here; actual URLs are resolved at runtime
  return [];
}

const portraitHiRes = import.meta.glob(
  '/public/photos/portraits/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const portraitThumbs = import.meta.glob(
  '/public/photos/portraits/thumbs/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const stillLifeHiRes = import.meta.glob(
  '/public/photos/still-life/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const stillLifeThumbs = import.meta.glob(
  '/public/photos/still-life/thumbs/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const landscapeHiRes = import.meta.glob(
  '/public/photos/landscapes/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const landscapeThumbs = import.meta.glob(
  '/public/photos/landscapes/thumbs/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

// ── Helpers ────────────────────────────────────────────────────────────────

function thumbMap(mods: Record<string, string>): Map<string, string> {
  const m = new Map<string, string>();
  for (const [path, url] of Object.entries(mods)) {
    const name = path.split('/').pop() ?? '';
    m.set(name, url);
  }
  return m;
}

function buildPhotos(
  hiRes: Record<string, string>,
  thumbs: Record<string, string>,
  category: Category
): Photo[] {
  const tMap = thumbMap(thumbs);
  return Object.entries(hiRes).map(([path, url]) => {
    const filename = path.split('/').pop() ?? '';
    return {
      id:    `${category}__${filename}`,
      src:   url,
      thumb: tMap.get(filename) ?? url,   // fallback to hi-res
      category,
    };
  });
}

// ── Exports ────────────────────────────────────────────────────────────────

export const heroPhotos      = getHeroPhotos();
export const portraitPhotos  = buildPhotos(portraitHiRes,  portraitThumbs,  'portraits');
export const stillLifePhotos = buildPhotos(stillLifeHiRes, stillLifeThumbs, 'still-life');
export const landscapePhotos = buildPhotos(landscapeHiRes, landscapeThumbs, 'landscapes');

export const allPhotos: Photo[] = [
  ...portraitPhotos,
  ...stillLifePhotos,
  ...landscapePhotos,
];

export function getHeroUrls(): string[] {
  const shuffled = [...heroPhotos].sort(() => Math.random() - 0.5);
  return shuffled;
}

export const CATEGORY_LABELS: Record<Category | 'all', { en: string; zh: string }> = {
  all:          { en: 'All',       zh: '全部' },
  portraits:    { en: 'Portraits', zh: '人像' },
  'still-life': { en: 'Still Life', zh: '静物' },
  landscapes:   { en: 'Landscapes', zh: '风景' },
};
