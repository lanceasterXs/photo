import { useState, useEffect } from 'react';
import type { PhotoManifest } from '../types';

const EMPTY_MANIFEST: PhotoManifest = {
  hero: [],
  categories: { portraits: [], 'still-life': [], landscapes: [] },
};

export function usePhotoManifest() {
  const [manifest, setManifest] = useState<PhotoManifest>(EMPTY_MANIFEST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/photo-manifest.json')
      .then(r => r.json())
      .then((data: PhotoManifest) => {
        setManifest(data);
        setLoading(false);
      })
      .catch(() => {
        setManifest(EMPTY_MANIFEST);
        setLoading(false);
      });
  }, []);

  return { manifest, loading };
}
