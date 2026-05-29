import { useEffect, useCallback } from 'react';
import type { Photo } from '../imageConfig';

interface Props {
  photo: Photo;
  allPhotos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  dark?: boolean;
}

export default function Lightbox({
  photo,
  allPhotos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);



  const total = allPhotos.length;

  // ── Button style helper
  const btnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '50%',
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'background 0.3s ease, transform 0.2s ease',
    flexShrink: 0,
  };

  return (
    <div
      className="lightbox-backdrop"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Counter */}
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 300,
          }}
        >
          {currentIndex + 1} / {total}
        </span>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={btnStyle}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Prev arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous photo"
        style={{
          ...btnStyle,
          position: 'absolute',
          left: 'clamp(10px, 3vw, 28px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next photo"
        style={{
          ...btnStyle,
          position: 'absolute',
          right: 'clamp(10px, 3vw, 28px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Main image */}
      <img
        key={photo.id}
        src={photo.src}
        alt=""
        className="lightbox-img"
        onClick={(e) => e.stopPropagation()}
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== photo.thumb) img.src = photo.thumb;
        }}
      />

      {/* Bottom thumbnail strip */}
      {total > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 20px 16px',
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
            zIndex: 10,
            overflowX: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {allPhotos.map((p, i) => (
            <div
              key={p.id}
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: 2,
                overflow: 'hidden',
                opacity: i === currentIndex ? 1 : 0.4,
                transform: i === currentIndex ? 'scale(1.15)' : 'scale(1)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                cursor: 'pointer',
                border: i === currentIndex ? '1px solid rgba(255,255,255,0.7)' : '1px solid transparent',
              }}
            >
              <img
                src={p.thumb}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { if (e.currentTarget.src !== p.src) e.currentTarget.src = p.src; }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
