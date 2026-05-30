import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.JPG', '.JPEG', '.PNG']);

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => IMAGE_EXTS.has(path.extname(f)))
    .sort();
}

const publicDir = path.resolve(__dirname, '..', 'public');
const photosDir = path.join(publicDir, 'photos');

const CATEGORIES = ['portraits', 'still-life', 'landscapes'];

const manifest = {
  hero: listImages(path.join(photosDir, 'hero')).map(f => `/photos/hero/${f}`),
  categories: {},
};

for (const cat of CATEGORIES) {
  const fullDir  = path.join(photosDir, cat);
  const thumbDir = path.join(photosDir, cat, 'thumbs');
  const images   = listImages(fullDir);

  manifest.categories[cat] = images.map(f => {
    const hasThumb = fs.existsSync(path.join(thumbDir, f));
    return {
      full:  `/photos/${cat}/${f}`,
      thumb: hasThumb ? `/photos/${cat}/thumbs/${f}` : `/photos/${cat}/${f}`,
    };
  });
}

const outPath = path.join(publicDir, 'photo-manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`✅  Photo manifest written → ${outPath}`);
console.log(`   hero: ${manifest.hero.length} photos`);
for (const cat of CATEGORIES) {
  console.log(`   ${cat}: ${manifest.categories[cat].length} photos`);
}
