import { useEffect, useState } from 'react';
import { usePhotoManifest } from './hooks/usePhotoManifest';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GallerySection from './components/GallerySection';
import AboutSection from './components/AboutSection';

export default function App() {
  const { manifest, loading } = usePhotoManifest();
  const { theme, toggleTheme } = useTheme();
  const [appReady, setAppReady] = useState(false);
  const isDark = theme === 'dark';

  // Give a brief moment for fonts to load before showing
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setAppReady(true), 150);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? '#0a0a0a' : '#ffffff',
        color: isDark ? '#e8e2d9' : '#1c1917',
        transition: 'background-color 0.5s ease, color 0.5s ease',
      }}
    >
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      {/* Loading screen */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          background: isDark ? '#0a0a0a' : '#ffffff',
          opacity: appReady ? 0 : 1,
          pointerEvents: appReady ? 'none' : 'all',
          transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.4rem',
            fontWeight: 300,
            letterSpacing: '0.25em',
            color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(41,37,36,0.5)',
          }}
        >
          M&amp;D · 光影
        </p>

        {/* Animated loading bar */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(41,37,36,0.12)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(41,37,36,0.5)',
              animation: 'loadBar 1.2s ease-in-out infinite alternate',
            }}
          />
        </div>
      </div>

      <main>
        <HeroSection photos={manifest.hero} theme={theme} />
        <GallerySection
          portraits={manifest.categories.portraits}
          stillLife={manifest.categories['still-life']}
          landscapes={manifest.categories.landscapes}
          theme={theme}
        />
        <AboutSection theme={theme} />
      </main>

      <style>{`
        @keyframes loadBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
