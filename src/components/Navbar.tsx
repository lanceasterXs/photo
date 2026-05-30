import { useState, useEffect } from 'react';

interface Props {
  dark: boolean;
  onToggleDark: () => void;
}

const NAV_ITEMS = [
  { label: 'Home',    labelZh: '首页', href: '#home'    },
  { label: 'Gallery', labelZh: '画廊', href: '#gallery' },
  { label: 'About',   labelZh: '关于', href: '#about'   },
];

export default function Navbar({ dark, onToggleDark }: Props) {
  const [scrolled,  setScrolled]  = useState(false);
  const [active,    setActive]    = useState('home');
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);

      // Active section tracking
      const sections = ['home', 'gallery', 'about'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = scrolled
    ? dark
      ? 'rgba(10,10,10,0.88)'
      : 'rgba(250,248,245,0.88)'
    : 'transparent';

  const navColor = scrolled
    ? dark ? 'rgba(255,255,255,0.82)' : 'rgba(20,16,10,0.80)'
    : 'rgba(255,255,255,0.88)';

  const borderColor = scrolled
    ? dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
    : 'transparent';

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1rem, 5vw, 3rem)',
          background: navBg,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          transition: 'background 0.5s ease, border-color 0.5s ease',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNav('#home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: navColor,
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '0.06em',
            transition: 'color 0.4s ease',
          }}
        >
          光 · 影
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ label, href }) => {
            const id = href.replace('#', '');
            return (
              <button
                key={label}
                onClick={() => handleNav(href)}
                className="nav-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: active === id ? navColor : `${navColor.slice(0, -2)}55)`,
                  transition: 'color 0.4s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Theme toggle */}
          <button
            onClick={onToggleDark}
            className={`theme-toggle ${dark ? 'dark' : ''}`}
            aria-label="Toggle dark mode"
            style={{
              background: dark ? 'rgba(200,185,165,0.5)' : 'rgba(255,255,255,0.3)',
            }}
          />

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: navColor,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              transition: 'color 0.4s ease',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: i === 1 ? (menuOpen ? 20 : 14) : 20,
                  height: 1,
                  background: 'currentColor',
                  transition: 'width 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translateY(6px)'
                    : i === 2 ? 'rotate(-45deg) translateY(-6px)'
                    : 'scaleX(0)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        style={{
          position: 'fixed',
          top: 60,
          left: 0,
          right: 0,
          zIndex: 49,
          background: dark ? 'rgba(10,10,10,0.96)' : 'rgba(250,248,245,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: menuOpen ? '2rem clamp(1rem,5vw,3rem)' : '0 clamp(1rem,5vw,3rem)',
          maxHeight: menuOpen ? 300 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1), padding 0.45s ease',
          borderBottom: menuOpen ? `1px solid ${borderColor}` : 'none',
        }}
      >
        {NAV_ITEMS.map(({ label, labelZh, href }) => (
          <button
            key={label}
            onClick={() => handleNav(href)}
            style={{
              display: 'block',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.75rem 0',
              width: '100%',
              textAlign: 'left',
              color: dark ? 'rgba(255,255,255,0.78)' : 'rgba(20,16,10,0.78)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 300,
              borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            {label}
            <span
              style={{
                marginLeft: 12,
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                opacity: 0.5,
                fontFamily: 'var(--font-serif)',
                textTransform: 'none',
                fontStyle: 'italic',
              }}
            >
              {labelZh}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
