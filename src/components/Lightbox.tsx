import { useEffect, useCallback, useState } from 'react';
import type { Theme } from '../types';

interface LightboxProps {
  src: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  theme: Theme;
}

export default function Lightbox({ src, onClose, onPrev, onNext }: LightboxProps) {
  const [show, setShow] = useState(false);
  const [imgKey, setImgKey] = useState(src);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
  }, []);

  useEffect(() => {
    setImgLoaded(false);
    setImgKey(src);
  }, [src]);

  const handleClose = useCallback(() => {
    setShow(false);
    setTimeout(onClose, 350);
  }, [onClose]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
    if (e.key === 'ArrowRight' && onNext) onNext();
  }, [handleClose, onPrev, onNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  // Touch swipe support
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) {
        if (dx < 0 && onNext) onNext();
        if (dx > 0 && onPrev) onPrev();
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onPrev, onNext]);

  return (
    <div
      className="lightbox-overlay fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: `rgba(6,6,6,${show ? 0.82 : 0})`,
        transition: 'background 0.35s ease',
        cursor: 'zoom-out',
      }}
      onClick={handleClose}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          zIndex: 10,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.75)',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s, background 0.2s',
          backdropFilter: 'blur(4px)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = '#fff';
          (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.45)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.25)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Prev arrow */}
      {onPrev && (
        <button
          onClick={e => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous photo"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.65)',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'color 0.2s, background 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = '#fff';
            el.style.transform = 'translateY(-50%) translateX(-2px)';
            el.style.background = 'rgba(0,0,0,0.4)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = 'rgba(255,255,255,0.65)';
            el.style.transform = 'translateY(-50%) translateX(0)';
            el.style.background = 'rgba(0,0,0,0.2)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '92vw',
          maxHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: show && imgLoaded ? 1 : 0,
          transform: show && imgLoaded ? 'scale(1)' : 'scale(0.96)',
          transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)',
          cursor: 'default',
        }}
      >
        <img
          key={imgKey}
          src={imgKey}
          alt=""
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '2px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.4)',
            display: 'block',
            userSelect: 'none',
          }}
          draggable={false}
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      {/* Next arrow */}
      {onNext && (
        <button
          onClick={e => { e.stopPropagation(); onNext(); }}
          aria-label="Next photo"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.65)',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'color 0.2s, background 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = '#fff';
            el.style.transform = 'translateY(-50%) translateX(2px)';
            el.style.background = 'rgba(0,0,0,0.4)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = 'rgba(255,255,255,0.65)';
            el.style.transform = 'translateY(-50%) translateX(0)';
            el.style.background = 'rgba(0,0,0,0.2)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}
