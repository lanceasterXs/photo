import { useState, useEffect, useCallback, useRef } from 'react';
import type { Theme } from '../types';

interface HeroSectionProps {
  photos: string[];
  theme: Theme;
}

export default function HeroSection({ photos, theme }: HeroSectionProps) {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark = theme === 'dark';

  // Shuffle on mount
  useEffect(() => {
    if (photos.length === 0) return;
    const arr = [...photos].sort(() => Math.random() - 0.5);
    setSlides(arr);
    const t = setTimeout(() => setTextVisible(true), 900);
    return () => clearTimeout(t);
  }, [photos]);

  const advance = useCallback(() => {
    if (slides.length < 2) return;
    const next = (current + 1) % slides.length;
    setPrev(current);
    setFading(true);
    setCurrent(next);
    // After transition, clear prev
    const t = setTimeout(() => {
      setPrev(null);
      setFading(false);
    }, 1400);
    return t;
  }, [current, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    timerRef.current = setTimeout(() => {
      advance();
    }, 6500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [advance, slides, current]);

  const goTo = (idx: number) => {
    if (idx === current || fading) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setPrev(current);
    setFading(true);
    setCurrent(idx);
    setTimeout(() => { setPrev(null); setFading(false); }, 1400);
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '500px' }}
    >
      {/* Slides */}
      {slides.length === 0 ? (
        <div className={`absolute inset-0 ${isDark ? 'bg-stone-950' : 'bg-stone-200'}`} />
      ) : (
        <>
          {/* Previous slide — fading out */}
          {prev !== null && (
            <div
              key={`prev-${prev}`}
              className="absolute inset-0"
              style={{
                opacity: fading ? 0 : 1,
                transition: 'opacity 1.4s ease-in-out',
                zIndex: 1,
              }}
            >
              <img
                src={slides[prev]}
                alt=""
                className="w-full h-full object-cover hero-slide"
                draggable={false}
              />
            </div>
          )}

          {/* Current slide — fading in */}
          <div
            key={`cur-${current}`}
            className="absolute inset-0"
            style={{
              opacity: 1,
              zIndex: 2,
            }}
          >
            <img
              src={slides[current]}
              alt=""
              className="w-full h-full object-cover hero-slide"
              draggable={false}
              loading="eager"
            />
          </div>
        </>
      )}

      {/* Overlay gradient — left heavy */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.08) 100%)',
          zIndex: 3,
        }}
      />

      {/* Bottom gradient for slide indicators */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
          zIndex: 3,
        }}
      />

      {/* Text — left side */}
      <div
        className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-8 md:px-16 lg:px-24"
        style={{ zIndex: 4, maxWidth: 'min(440px, 90vw)' }}
      >
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateX(0)' : 'translateX(-28px)',
            transition: 'opacity 1.3s cubic-bezier(0.22,1,0.36,1), transform 1.3s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Brand micro-label */}
          <p
            className="text-white/45 tracking-[0.35em] uppercase mb-7"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '10px',
              fontWeight: 300,
            }}
          >
            mimiland
          </p>

          {/* Divider */}
          <div
            className="mb-6"
            style={{
              width: '32px',
              height: '1px',
              background: 'rgba(255,255,255,0.4)',
            }}
          />

          {/* Tagline */}
          <h1
            className="hero-tagline text-white"
            style={{ fontSize: 'clamp(1.35rem, 3.5vw, 2rem)' }}
          >
            Light, Memory,
            <br />
            <span style={{ paddingLeft: '1.2em', display: 'block' }}>and the spaces</span>
            <span style={{ paddingLeft: '2.4em', display: 'block' }}>between.</span>
          </h1>

          {/* Divider bottom */}
          <div
            className="mt-6"
            style={{
              width: '32px',
              height: '1px',
              background: 'rgba(255,255,255,0.35)',
            }}
          />
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-7 left-1/2 flex gap-2 items-center"
          style={{ transform: 'translateX(-50%)', zIndex: 5 }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? '24px' : '6px',
                height: '5px',
                borderRadius: '3px',
                background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll hint — vertical text */}
      <div
        className="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-3"
        style={{
          zIndex: 5,
          opacity: textVisible ? 0.55 : 0,
          transition: 'opacity 1.5s ease 1.5s',
        }}
      >
        <span
          className="text-white uppercase tracking-widest"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '9px',
            writingMode: 'vertical-rl',
            letterSpacing: '0.2em',
          }}
        >
          scroll
        </span>
        <div
          className="w-px bg-white/50"
          style={{
            height: '48px',
            animation: 'kenBurns 1.8s ease-in-out infinite alternate',
          }}
        />
      </div>
    </section>
  );
}
