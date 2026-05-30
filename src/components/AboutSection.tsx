import { useScrollReveal } from '../hooks/useScrollReveal';
import type { Theme } from '../types';

interface AboutSectionProps {
  theme: Theme;
}

export default function AboutSection({ theme }: AboutSectionProps) {
  const headingRef   = useScrollReveal(0.08);
  const nameRef      = useScrollReveal(0.08);
  const poemRef      = useScrollReveal(0.08);
  const contactRef   = useScrollReveal(0.06);
  const footerRef    = useScrollReveal(0.05);
  const isDark = theme === 'dark';

  const textPrimary   = isDark ? 'rgba(255,255,255,0.88)' : '#292524';
  const textSecondary = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(120,113,108,0.9)';
  const textMuted     = isDark ? 'rgba(255,255,255,0.30)' : 'rgba(120,113,108,0.5)';
  const borderColor   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(120,113,108,0.12)';
  const bg            = isDark ? '#080808' : '#ffffff';

  return (
    <section
      id="about"
      className="transition-colors duration-500"
      style={{ background: bg, paddingTop: '80px', paddingBottom: '0' }}
    >
      <div className="max-w-3xl mx-auto px-5 md:px-8" style={{ paddingBottom: '80px' }}>

        {/* ── Section heading ── */}
        <div ref={headingRef} className="reveal mb-12 md:mb-16">
          <p
            className="tracking-[0.32em] uppercase mb-3 font-light"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '10px',
              color: textMuted,
            }}
          >
            About
          </p>
          <h2
            className="font-light tracking-wide"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: textPrimary,
            }}
          >
            关于我们
          </h2>
          <div
            style={{
              width: '34px',
              height: '1px',
              marginTop: '14px',
              background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(120,113,108,0.35)',
            }}
          />
        </div>

        {/* ── Name / Identity ── */}
        <div ref={nameRef} className="reveal mb-10">
          <p
            className="font-light leading-loose"
            style={{
              fontFamily: "'Noto Serif SC', 'STSong', 'Songti SC', serif",
              fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)',
              color: textPrimary,
              lineHeight: 2,
            }}
          >
            我们是？
          </p>
          <p
            className="font-light leading-loose"
            style={{
              fontFamily: "'Noto Serif SC', 'STSong', 'Songti SC', serif",
              fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)',
              color: textPrimary,
              lineHeight: 2,
            }}
          >
            ——还没想好，就先叫 mimiland 吧
          </p>
        </div>

        {/* ── Poem ── */}
        <div ref={poemRef} className="reveal mb-16">
          {[
            '捕捉光线流转的瞬息，在遗忘之境',
            '每一帧画面都编织一段故事——',
            '关于时间、关于空间，关于那些稍纵即逝的情绪',
          ].map((line, i) => (
            <p
              key={i}
              className="font-light"
              style={{
                fontFamily: "'Noto Serif SC', 'STSong', 'Songti SC', serif",
                fontSize: 'clamp(0.9rem, 2.2vw, 1.05rem)',
                color: textSecondary,
                lineHeight: 2.8,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* ── Marquee ── */}
        <div
          className="overflow-hidden mb-16 py-3"
          style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="marquee-track" style={{ opacity: 0.8 }}>
            {[1, 2].map(n => (
              <span
                key={n}
                className="italic whitespace-nowrap"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                  letterSpacing: '0.18em',
                  color: textSecondary,
                  paddingRight: '0',
                }}
              >
                FINE&nbsp;ART&nbsp;·&nbsp;PROFESSIONAL&nbsp;·&nbsp;FASHION&nbsp;·&nbsp;EMOTIONAL&nbsp;·&nbsp;FILM&nbsp;·&nbsp;NATURAL&nbsp;·&nbsp;TIMELESS&nbsp;·&nbsp;VERSATILE&nbsp;·&nbsp;INSPIRING&nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── Contact ── */}
        <div ref={contactRef} className="reveal">
          <p
            className="tracking-[0.28em] uppercase mb-8 font-light"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '10px',
              color: textMuted,
            }}
          >
            Contact
          </p>

          <div className="flex flex-col sm:flex-row gap-8 md:gap-14 items-start">

            {/* WeChat QR — vertical card 3:4 ratio */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div
                className="overflow-hidden rounded-sm"
                style={{
                  width: '150px',
                  height: '200px',
                  background: isDark ? '#1c1c1c' : '#f5f4f2',
                  boxShadow: isDark
                    ? '0 8px 32px rgba(0,0,0,0.5)'
                    : '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
                <img
                  src="/photos/wechat-qr.jpg"
                  alt="微信名片"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.style.display = 'flex';
                      parent.style.alignItems = 'center';
                      parent.style.justifyContent = 'center';
                      const placeholder = document.createElement('p');
                      placeholder.textContent = '扫码添加微信';
                      placeholder.style.cssText = `font-size:12px;text-align:center;padding:16px;color:${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};font-family:'Noto Serif SC',serif;`;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: textMuted,
                }}
              >
                WeChat
              </p>
            </div>

            {/* Social links */}
            <div className="flex flex-col justify-center gap-5 pt-2">
              {/* Xiaohongshu */}
              <a
                href="https://xhslink.com/m/8w85xnzR1Nw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 group"
                style={{ textDecoration: 'none' }}
              >
                {/* XHS badge */}
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded text-white font-bold"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#FF2442',
                    fontSize: '9px',
                    fontFamily: 'sans-serif',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    transition: 'transform 0.3s ease',
                    textAlign: 'center',
                    padding: '2px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  小红书
                </span>

                <span
                  style={{
                    fontFamily: "'Noto Serif SC', 'STSong', serif",
                    fontSize: '1rem',
                    fontWeight: 300,
                    color: textSecondary,
                    letterSpacing: '0.04em',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = textPrimary)}
                  onMouseLeave={e => (e.currentTarget.style.color = textSecondary)}
                >
                  小红书 @sakiii
                </span>

                {/* Arrow */}
                <svg
                  width="13" height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{
                    color: textMuted,
                    opacity: 0.7,
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as SVGElement).style.transform = 'translateX(3px)';
                    (e.currentTarget as SVGElement).style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as SVGElement).style.transform = 'translateX(0)';
                    (e.currentTarget as SVGElement).style.opacity = '0.7';
                  }}
                >
                  <line x1="7" y1="17" x2="17" y2="7"/>
                  <polyline points="7 7 17 7 17 17"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        ref={footerRef}
        className="reveal"
        style={{
          borderTop: `1px solid ${borderColor}`,
          padding: '28px 0',
        }}
      >
        <p
          className="text-center tracking-widest font-light"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '12px',
            letterSpacing: '0.25em',
            color: textMuted,
          }}
        >
          2026 &nbsp;·&nbsp; mimiland &nbsp;·&nbsp; All rights reserved
        </p>
      </div>
    </section>
  );
}
