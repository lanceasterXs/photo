import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

function getImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort();
}

export function photoManifestPlugin(): Plugin {
  const generateManifest = (publicDir: string) => {
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
    console.log('✅ Photo manifest generated');
  };

  return {
    name: 'photo-manifest',
    configResolved(config) {
      generateManifest(config.publicDir);
    },
    configureServer(server) {
      // Regenerate on file changes in photos folder
      server.watcher.add(path.join(server.config.publicDir, 'photos'));
      server.watcher.on('add', () => generateManifest(server.config.publicDir));
      server.watcher.on('unlink', () => generateManifest(server.config.publicDir));
    },
  };
}
