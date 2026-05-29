import { useEffect, useRef, useState } from 'react';

interface Props {
  dark: boolean;
}

// Custom reveal hook
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function revealStyle(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  };
}

export default function About({ dark }: Props) {
  const titleBlock = useReveal(0.2);
  const bioBlock   = useReveal(0.12);
  const divBlock   = useReveal(0.1);
  const qrBlock    = useReveal(0.1);

  const textMain  = dark ? 'rgba(255,255,255,0.88)' : 'rgba(15,12,8,0.85)';
  const textMuted = dark ? 'rgba(255,255,255,0.36)' : 'rgba(0,0,0,0.30)';
  const textBody  = dark ? 'rgba(255,255,255,0.68)' : 'rgba(30,22,12,0.70)';
  const cardBg    = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)';
  const cardBorder= dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)';
  const divider   = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';

  return (
    <section
      id="about"
      style={{
        width: '100%',
        paddingTop: '6rem',
        paddingBottom: '8rem',
        paddingLeft: 'clamp(1.5rem, 8vw, 10rem)',
        paddingRight: 'clamp(1.5rem, 8vw, 10rem)',
      }}
    >
      {/* ── Section title ── */}
      <div ref={titleBlock.ref} style={revealStyle(titleBlock.visible, 0)}>
        <h2
          className="section-title"
          style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
            color: textMain,
            margin: 0,
            marginBottom: 6,
            lineHeight: 1,
          }}
        >
          About
        </h2>
        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            color: textMuted,
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            margin: 0,
            marginBottom: '3.5rem',
          }}
        >
          关于我
        </p>
      </div>

      {/* ── Bio text ── */}
      <div ref={bioBlock.ref} style={{ maxWidth: 640, ...revealStyle(bioBlock.visible, 0.1) }}>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.05rem, 2.5vw, 1.28rem)',
            lineHeight: 2.1,
            fontWeight: 300,
            letterSpacing: '0.04em',
            color: textBody,
            margin: 0,
          }}
        >
          用镜头捕捉光线流转的瞬息，在平凡中寻找诗意。
        </p>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.05rem, 2.5vw, 1.28rem)',
            lineHeight: 2.1,
            fontWeight: 300,
            letterSpacing: '0.04em',
            color: textBody,
            margin: '1.4rem 0 0',
          }}
        >
          我相信每一帧画面背后都藏着一段无声的故事——
          <br />
          关于时间、关于情绪，关于那些稍纵即逝的温柔。
        </p>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.05rem, 2.5vw, 1.28rem)',
            lineHeight: 2.1,
            fontWeight: 300,
            letterSpacing: '0.04em',
            color: textBody,
            margin: '1.4rem 0 0',
          }}
        >
          摄影于我，是一种对世界保持敏感的方式。
        </p>
      </div>

      {/* ── Divider ── */}
      <div
        ref={divBlock.ref}
        style={{
          ...revealStyle(divBlock.visible, 0.05),
          width: 48,
          height: 1,
          background: divider,
          margin: '4rem 0',
        }}
      />

      {/* ── Contact / QR ── */}
      <div ref={qrBlock.ref} style={revealStyle(qrBlock.visible, 0.1)}>
        <p
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: textMuted,
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            marginBottom: '1.75rem',
          }}
        >
          Contact · 联系
        </p>

        {/* WeChat QR card */}
        <div
          className="qr-card"
          style={{
            display: 'inline-block',
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: 6,
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              width: 'min(200px, 54vw)',
              aspectRatio: '1',
              background: dark ? '#1a1a1a' : '#f5f3f0',
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/photos/wechat-qr.jpg"
              alt="WeChat QR Code"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                // Show placeholder if image not added yet
                const img = e.currentTarget;
                img.style.display = 'none';
                const parent = img.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div style="
                      display:flex; flex-direction:column; align-items:center; justify-content:center;
                      gap:10px; color:${dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'};
                      font-family:var(--font-sans); font-size:0.65rem; letter-spacing:0.12em;
                      text-align:center; padding:1.5rem;
                    ">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="3" height="3"/>
                        <rect x="18" y="14" width="3" height="3"/>
                        <rect x="14" y="18" width="7" height="3"/>
                      </svg>
                      <span>放入二维码图片</span>
                    </div>
                  `;
                }
              }}
            />
          </div>

          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              color: textMuted,
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: 0,
            }}
          >
            微信扫码联系
          </p>
        </div>
      </div>
    </section>
  );
}
