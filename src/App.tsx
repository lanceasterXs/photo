import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlideshow from './components/HeroSlideshow';
import Gallery from './components/Gallery';
import About from './components/About';

export default function App() {
  // ── Theme ──────────────────────────────────────────────────────────────
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('photo-theme');
      if (saved !== null) return saved === 'dark';
    } catch (_) { /* noop */ }
    return true; // default dark for photography
  });

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      try { localStorage.setItem('photo-theme', next ? 'dark' : 'light'); } catch (_) { /* noop */ }
      return next;
    });
  };

  // ── Scroll progress bar ────────────────────────────────────────────────
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollY }  = window;
      const { scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? (scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  // ── Styles ─────────────────────────────────────────────────────────────
  const bg     = dark ? '#0a0a0a'           : '#faf8f5';
  const fg     = dark ? 'rgba(255,255,255,0.84)' : 'rgba(15,12,8,0.84)';

  return (
    <div
      style={{
        background: bg,
        color: fg,
        minHeight: '100vh',
        transition: 'background 0.55s ease, color 0.55s ease',
        overflowX: 'hidden',
      }}
    >
      {/* ── Read progress bar ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${progress}%`,
          height: 1,
          background: dark
            ? 'rgba(210,195,175,0.6)'
            : 'rgba(90,70,50,0.45)',
          zIndex: 200,
          transition: 'width 0.08s linear',
          pointerEvents: 'none',
        }}
      />

      {/* ── Navigation ── */}
      <Navbar dark={dark} onToggleDark={toggleDark} />

      {/* ── Main content ── */}
      <main>
        <HeroSlideshow dark={dark} />

        {/* Thin separator */}
        <div
          style={{
            height: 1,
            background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          }}
        />

        <Gallery dark={dark} />

        {/* Thin separator */}
        <div
          style={{
            height: 1,
            background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            marginLeft: 'clamp(1.5rem, 8vw, 10rem)',
            marginRight: 'clamp(1.5rem, 8vw, 10rem)',
          }}
        />

        <About dark={dark} />
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          color: dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 300,
          borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        }}
      >
        © {new Date().getFullYear()}&nbsp;&nbsp;·&nbsp;&nbsp;mimiland&nbsp;&nbsp;·&nbsp;&nbsp;All rights reserved
      </footer>
    </div>
  );
}
