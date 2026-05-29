import { useState, useEffect, useRef, useCallback } from 'react';
import {
  allPhotos,
  portraitPhotos,
  stillLifePhotos,
  landscapePhotos,
  CATEGORY_LABELS,
} from '../imageConfig';
import type { Photo, Category } from '../imageConfig';
import Lightbox from './Lightbox';

type Filter = Category | 'all';

interface Props {
  dark: boolean;
}

// ── Single masonry item with scroll reveal ────────────────────────────────
function MasonryItem({
  photo,
  index,
  onClick,
  dark,
}: {
  photo: Photo;
  index: number;
  onClick: () => void;
  dark: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded,  setLoaded]  = useState(false);
  const [hover,   setHover]   = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delay = (index % 3) * 0.07;

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        breakInside: 'avoid',
        marginBottom: 'clamp(6px, 1.2vw, 12px)',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 2,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.98)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        background: dark ? '#111' : '#ede9e3',
        position: 'relative',
      }}
    >
      {/* Skeleton loader */}
      {!loaded && (
        <div
          style={{
            paddingTop: '75%',
            background: dark
              ? 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)'
              : 'linear-gradient(90deg, #e8e4de 25%, #f0ece6 50%, #e8e4de 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      <img
        src={photo.thumb}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== photo.src) {
            img.src = photo.src;
          }
        }}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          opacity: loaded ? 1 : 0,
          transform: hover ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.65s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease, filter 0.4s ease',
          filter: hover ? 'brightness(0.88) saturate(1.1)' : 'brightness(1) saturate(1)',
        }}
      />

      {/* Hover overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hover
            ? 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)'
            : 'transparent',
          transition: 'background 0.4s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ── Main Gallery component ─────────────────────────────────────────────────
const FILTERS: Filter[] = ['all', 'portraits', 'still-life', 'landscapes'];

const PHOTO_SETS: Record<Filter, Photo[]> = {
  all: allPhotos,
  portraits: portraitPhotos,
  'still-life': stillLifePhotos,
  landscapes: landscapePhotos,
};

export default function Gallery({ dark }: Props) {
  const [filter,      setFilter]      = useState<Filter>('all');
  const [displayList, setDisplayList] = useState<Photo[]>(allPhotos);
  const [animating,   setAnimating]   = useState(false);
  const [lightbox,    setLightbox]    = useState<number | null>(null);

  const titleRef    = useRef<HTMLDivElement>(null);
  const [titleVis,  setTitleVis] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTitleVis(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const applyFilter = useCallback((f: Filter) => {
    if (f === filter || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setFilter(f);
      setDisplayList(PHOTO_SETS[f]);
      setTimeout(() => setAnimating(false), 50);
    }, 280);
  }, [filter, animating]);

  const closeLightbox = () => setLightbox(null);
  const prevPhoto = useCallback(() =>
    setLightbox((i) => i === null ? null : (i - 1 + displayList.length) % displayList.length),
    [displayList.length]
  );
  const nextPhoto = useCallback(() =>
    setLightbox((i) => i === null ? null : (i + 1) % displayList.length),
    [displayList.length]
  );

  // ── Colour tokens
  const textMain   = dark ? 'rgba(255,255,255,0.88)' : 'rgba(15,12,8,0.85)';
  const textMuted  = dark ? 'rgba(255,255,255,0.36)' : 'rgba(0,0,0,0.32)';
  const accent     = dark ? 'rgba(210,195,175,0.92)' : 'rgba(80,60,40,0.85)';
  const border     = dark ? 'rgba(255,255,255,0.1)'  : 'rgba(0,0,0,0.09)';

  return (
    <section
      id="gallery"
      style={{
        width: '100%',
        paddingTop: '6rem',
        paddingBottom: '7rem',
      }}
    >
      {/* ── Header ── */}
      <div
        ref={titleRef}
        style={{
          paddingLeft: 'clamp(1.25rem, 5vw, 5rem)',
          paddingRight: 'clamp(1.25rem, 5vw, 5rem)',
          marginBottom: '2.5rem',
        }}
      >
        {/* Title */}
        <div
          style={{
            overflow: 'hidden',
            marginBottom: 6,
          }}
        >
          <h2
            className="section-title"
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
              color: textMain,
              margin: 0,
              opacity: titleVis ? 1 : 0,
              transform: titleVis ? 'translateY(0)' : 'translateY(100%)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            Gallery
          </h2>
        </div>

        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            color: textMuted,
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            margin: '0 0 2.5rem',
            opacity: titleVis ? 1 : 0,
            transition: 'opacity 0.9s ease 0.12s',
          }}
        >
          画廊
        </p>

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(12px, 3vw, 32px)',
            borderBottom: `1px solid ${border}`,
            opacity: titleVis ? 1 : 0,
            transition: 'opacity 0.9s ease 0.2s',
          }}
        >
          {FILTERS.map((f) => {
            const isActive = f === filter;
            const label = f === 'all'
              ? CATEGORY_LABELS.all.zh
              : CATEGORY_LABELS[f as Category].zh;
            return (
              <button
                key={f}
                onClick={() => applyFilter(f)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: `1px solid ${isActive ? accent : 'transparent'}`,
                  padding: '8px 0 10px',
                  marginBottom: -1,
                  cursor: 'pointer',
                  color: isActive ? accent : textMuted,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.62rem, 1.5vw, 0.72rem)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  transition: 'color 0.35s ease, border-color 0.35s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Masonry grid ── */}
      <div
        style={{
          paddingLeft: 'clamp(0.75rem, 3vw, 3rem)',
          paddingRight: 'clamp(0.75rem, 3vw, 3rem)',
          columns: 'var(--masonry-cols, 2)',
          columnGap: 'clamp(6px, 1.2vw, 12px)',
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.28s ease',
        }}
        className="masonry-container"
      >
        {displayList.map((photo, idx) => (
          <MasonryItem
            key={photo.id}
            photo={photo}
            index={idx}
            dark={dark}
            onClick={() => setLightbox(idx)}
          />
        ))}

        {displayList.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '6rem 2rem',
              color: textMuted,
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              gridColumn: '1 / -1',
            }}
          >
            暂无照片
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && displayList[lightbox] && (
        <Lightbox
          photo={displayList[lightbox]}
          allPhotos={displayList}
          currentIndex={lightbox}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </section>
  );
}
