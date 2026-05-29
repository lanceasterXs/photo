import { useEffect, useRef, useState, useCallback } from 'react';
import { getHeroUrls } from '../imageConfig';

interface Props {
  dark: boolean;
}

export default function HeroSlideshow({ dark }: Props) {
  const [slides] = useState<string[]>(() => {
    const urls = getHeroUrls();
    return urls.length > 0 ? urls : [];
  });

  const [current,      setCurrent]      = useState(0);
  const [prev,         setPrev]         = useState<number | null>(null);
  const [transitioning,setTransitioning]= useState(false);
  const [textVisible,  setTextVisible]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    if (transitioning || slides.length <= 1) return;
    setTransitioning(true);
    setPrev(current);
    setCurrent((c) => (c + 1) % slides.length);
    setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 1400);
  }, [current, transitioning, slides.length]);

  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(advance, 6500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance, slides.length]);

  const goTo = (i: number) => {
    if (i === current || transitioning) return;
    setTransitioning(true);
    setPrev(current);
    setCurrent(i);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 1400);
  };

  const revealText: React.CSSProperties = {
    opacity: textVisible ? 1 : 0,
    transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)',
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: 500,
        overflow: 'hidden',
      }}
    >
      {/* ── Slides ── */}
      {slides.map((url, i) => {
        const isActive = i === current;
        const isPrev   = i === prev;
        if (!isActive && !isPrev) return null;
        return (
          <div
            key={url + i}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: isActive ? 2 : 1,
              opacity: isActive ? 1 : 0,
              transition: isActive ? 'opacity 1.4s ease' : 'opacity 0.6s ease 0.8s',
            }}
          >
            <img
              src={url}
              alt=""
              className="ken-burns"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                animationDuration: '10s',
                animationTimingFunction: 'linear',
              }}
            />
          </div>
        );
      })}

      {/* ── Colour grading overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          background: dark
            ? `linear-gradient(
                to right,
                rgba(0,0,0,0.68) 0%,
                rgba(0,0,0,0.22) 55%,
                rgba(0,0,0,0.08) 100%
              ), linear-gradient(
                to top,
                rgba(0,0,0,0.55) 0%,
                transparent 45%
              )`
            : `linear-gradient(
                to right,
                rgba(0,0,0,0.58) 0%,
                rgba(0,0,0,0.16) 55%,
                rgba(0,0,0,0.04) 100%
              ), linear-gradient(
                to top,
                rgba(0,0,0,0.45) 0%,
                transparent 45%
              )`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Film grain ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          pointerEvents: 'none',
          opacity: 0.35,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── Text content ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(1.5rem, 5vw, 4rem)',
          paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        }}
      >
        <div style={{ maxWidth: 360 }}>
          {/* Tagline */}
          <div style={{ overflow: 'hidden', marginBottom: 6 }}>
            <p
              style={{
                ...revealText,
                transitionDelay: '0.2s',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(0.62rem, 1.8vw, 0.78rem)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                margin: 0,
                fontWeight: 300,
              }}
            >
              Photography Portfolio
            </p>
          </div>

          {/* Main quote */}
          <div style={{ overflow: 'hidden', marginBottom: '2rem' }}>
            <p
              style={{
                ...revealText,
                transitionDelay: '0.38s',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(1.15rem, 3.5vw, 1.75rem)',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.92)',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              Light, Memory,
              <br />
              <span style={{ color: 'rgba(255,255,255,0.68)' }}>
                and the spaces between.
              </span>
            </p>
          </div>

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div
              style={{
                ...revealText,
                transitionDelay: '0.6s',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  style={{
                    width: i === current ? 28 : 6,
                    height: 2,
                    borderRadius: 1,
                    background: 'rgba(255,255,255,0.75)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    opacity: i === current ? 1 : 0.35,
                    transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll indicator (right side) ── */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(1rem, 3vw, 2.5rem)',
          bottom: '2rem',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 1.2s ease 1.2s',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.58rem',
            letterSpacing: '0.24em',
            color: 'rgba(255,255,255,0.4)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 36,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.38), transparent)',
            animation: 'fadeInSlow 1s ease',
          }}
        />
      </div>
    </section>
  );
}
