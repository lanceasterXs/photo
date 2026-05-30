import { useState, useMemo } from 'react';
import type { PhotoEntry, Category, Theme } from '../types';
import MasonryGrid from './MasonryGrid';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface GallerySectionProps {
  portraits: PhotoEntry[];
  stillLife: PhotoEntry[];
  landscapes: PhotoEntry[];
  theme: Theme;
}

const TABS: { label: string; labelZh: string; value: Category }[] = [
  { label: 'Portrait',   labelZh: '人像', value: 'portraits' },
  { label: 'Still Life', labelZh: '静物', value: 'still-life' },
  { label: 'Landscape',  labelZh: '风景', value: 'landscapes' },
  { label: 'All',        labelZh: '全部', value: 'all' },
];

export default function GallerySection({ portraits, stillLife, landscapes, theme }: GallerySectionProps) {
  const [activeTab, setActiveTab] = useState<Category>('portraits');
  const headingRef = useScrollReveal(0.08);
  const tabsRef = useScrollReveal(0.08);
  const isDark = theme === 'dark';

  const allPhotos = useMemo(() => {
    // Interleave for visual variety
    const max = Math.max(portraits.length, stillLife.length, landscapes.length);
    const merged: PhotoEntry[] = [];
    for (let i = 0; i < max; i++) {
      if (portraits[i])  merged.push(portraits[i]);
      if (stillLife[i])  merged.push(stillLife[i]);
      if (landscapes[i]) merged.push(landscapes[i]);
    }
    return merged;
  }, [portraits, stillLife, landscapes]);

  const displayed = useMemo(() => {
    switch (activeTab) {
      case 'portraits':  return portraits;
      case 'still-life': return stillLife;
      case 'landscapes': return landscapes;
      default:           return allPhotos;
    }
  }, [activeTab, allPhotos, portraits, stillLife, landscapes]);

  return (
    <section
      id="gallery"
      className="py-20 md:py-28 transition-colors duration-500"
      style={{ background: isDark ? '#0d0d0d' : '#f7f6f4' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section heading */}
        <div ref={headingRef} className="reveal mb-10 md:mb-14">
          <p
            className="tracking-[0.32em] uppercase mb-3 font-light"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '10px',
              color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(120,113,108,0.9)',
            }}
          >
            Photography
          </p>
          <h2
            className="font-light tracking-wide"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: isDark ? 'rgba(255,255,255,0.88)' : '#292524',
            }}
          >
            Gallery
          </h2>
          <div
            style={{
              width: '34px',
              height: '1px',
              marginTop: '14px',
              background: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(120,113,108,0.5)',
            }}
          />
        </div>

        {/* Category tabs */}
        <div ref={tabsRef} className="reveal mb-10 md:mb-14">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="flex items-center gap-1.5 px-4 py-2.5 whitespace-nowrap transition-all duration-350 relative"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '15px',
                  fontWeight: 400,
                  letterSpacing: '0.06em',
                  color: activeTab === tab.value
                    ? (isDark ? 'rgba(255,255,255,0.92)' : '#292524')
                    : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(120,113,108,0.7)'),
                  borderBottom: activeTab === tab.value
                    ? `1px solid ${isDark ? 'rgba(255,255,255,0.75)' : '#292524'}`
                    : '1px solid transparent',
                  paddingBottom: '10px',
                }}
              >
                <span>{tab.labelZh}</span>
                <span style={{ fontSize: '11px', opacity: 0.55, fontStyle: 'italic' }}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <MasonryGrid photos={displayed} theme={theme} />

        {/* Note */}
        <p
          className="text-center mt-14 md:mt-20"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '11px',
            letterSpacing: '0.05em',
            color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(120,113,108,0.45)',
          }}
        >
          以上图片经过网页压缩，不代表最终画质
        </p>
      </div>
    </section>
  );
}
