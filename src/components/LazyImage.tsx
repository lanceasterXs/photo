import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isDark?: boolean;
}

export default function LazyImage({ src, alt = '', className = '', style, onClick, isDark }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative overflow-hidden" style={style} onClick={onClick}>
      {/* Skeleton */}
      {!loaded && (
        <div
          className={`absolute inset-0 ${isDark ? 'bg-stone-800' : 'bg-stone-100'} img-skeleton`}
          style={{ minHeight: '120px' }}
        />
      )}

      {/* Actual image */}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-700 ease-out`}
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
