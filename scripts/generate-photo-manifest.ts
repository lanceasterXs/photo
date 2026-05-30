import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

function getImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort();
}

const publicDir = path.resolve(process.cwd(), 'public');
const photosDir = path.join(publicDir, 'photos');

const categories = ['portraits', 'still-life', 'landscapes'];
const manifest: Record<string, any> = {
  hero: getImages(path.join(photosDir, 'hero')).map(f => `/photos/hero/${f}`),
  categories: {} as Record<string, { full: string; thumb: string }[]>,
};

for (const cat of categories) {
  const fullDir = path.join(photosDir, cat);
  const thumbDir = path.join(photosDir, cat, 'thumbs');
  const fullImages = getImages(fullDir);
  manifest.categories[cat] = fullImages.map(f => {
    const thumbExists = fs.existsSync(path.join(thumbDir, f));
    return {
      full: `/photos/${cat}/${f}`,
      thumb: thumbExists ? `/photos/${cat}/thumbs/${f}` : `/photos/${cat}/${f}`,
    };
  });
}

const outPath = path.join(publicDir, 'photo-manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log('✅ Photo manifest generated:', outPath);
