import { useState, useEffect } from 'react';
import type { Theme } from '../types';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const isDark = theme === 'dark';

  return (
    <>
      <header
        className={`navbar-glass fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? isDark
              ? 'bg-black/40 border-b border-white/10'
              : 'bg-white/40 border-b border-black/8'
            : isDark
              ? 'bg-black/20'
              : 'bg-white/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className={`font-cormorant text-lg md:text-xl tracking-widest font-light transition-opacity hover:opacity-70 ${
              isDark ? 'text-white/90' : 'text-stone-800'
            }`}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            M&amp;D · 光影
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Nav links — desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Gallery', id: 'gallery' },
                { label: 'About', id: 'about' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`font-cormorant text-sm tracking-widest uppercase transition-opacity hover:opacity-60 ${
                    isDark ? 'text-white/80' : 'text-stone-700'
                  }`}
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${
                isDark
                  ? 'text-amber-200 hover:text-amber-100'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <div className="transition-all duration-500">
                {isDark ? <SunIcon /> : <MoonIcon />}
              </div>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
              className={`w-8 h-8 flex items-center justify-center transition-all duration-300 hover:opacity-60 ${
                isDark ? 'text-white/80' : 'text-stone-700'
              }`}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Full menu drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 ${isDark ? 'bg-black/90' : 'bg-white/92'} navbar-glass`}
          onClick={() => setMenuOpen(false)}
        />
        <nav className="relative flex flex-col items-center justify-center h-full gap-10">
          {[
            { label: 'Home', id: 'hero' },
            { label: 'Gallery', id: 'gallery' },
            { label: 'About', id: 'about' },
          ].map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-cormorant text-4xl md:text-5xl font-light tracking-widest uppercase transition-all duration-300 hover:opacity-50 ${
                isDark ? 'text-white/90' : 'text-stone-800'
              }`}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                transitionDelay: menuOpen ? `${i * 80}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, color 0.3s ease`,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
