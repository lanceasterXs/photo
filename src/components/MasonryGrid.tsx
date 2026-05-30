import { useState, useRef, useEffect, useCallback } from 'react';
import type { PhotoEntry, Theme } from '../types';
import Lightbox from './Lightbox';

interface MasonryItemProps {
  photo: PhotoEntry;
  index: number;
  onClick: () => void;
}

function MasonryItem({ photo, index, onClick }: MasonryItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible]     = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const delay = Math.min(index % 6, 4) * 55;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          revealObs.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -20px 0px', threshold: 0.04 }
    );

    const loadObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          loadObs.unobserve(el);
        }
      },
      { rootMargin: '400px 0px', threshold: 0 }
    );

    revealObs.observe(el);
    loadObs.observe(el);
    return () => {
      revealObs.disconnect();
      loadObs.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className="masonry-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
      onClick={onClick}
    >
      {!imgLoaded && (
        <div
          className="img-skeleton w-full"
          style={{ paddingBottom: '140%' }}
        />
      )}

      {shouldLoad && (
        <img
          src={photo.thumb}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto"
          style={{ 
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            display: 'block',
          }}
          onLoad={() => setImgLoaded(true)}
        />
      )}

      <div className="photo-overlay" />
    </div>
  );
}

interface MasonryGridProps {
  photos: PhotoEntry[];
  theme: Theme;
}

export default function MasonryGrid({ photos, theme }: MasonryGridProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const isDark = theme === 'dark';

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev  = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + photos.length) % photos.length : null), [photos.length]);
  const next  = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % photos.length : null), [photos.length]);

  if (photos.length === 0) {
    return (
      <div
        className="text-center py-24 font-light tracking-wider"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1.1rem',
          color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(120,113,108,0.4)',
          fontStyle: 'italic',
        }}
      >
        — 照片即将呈现 —
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid">
        {photos.map((photo, i) => (
          <MasonryItem
            key={photo.full}
            photo={photo}
            index={i}
            onClick={() => setLightboxIdx(i)}
          />
        ))}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          src={photos[lightboxIdx].full}
          onClose={close}
          onPrev={photos.length > 1 ? prev : undefined}
          onNext={photos.length > 1 ? next : undefined}
          theme={theme}
        />
      )}
    </>
  );
}
