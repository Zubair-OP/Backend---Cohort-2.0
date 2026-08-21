import { useEffect, useRef } from 'react';

const observer =
  typeof window !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )
    : null;

export function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const delayClass = delay > 0 ? `scroll-reveal-delay-${delay}` : '';

  useEffect(() => {
    const el = ref.current;
    if (!el || !observer) return;

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${delayClass} ${className}`}>
      {children}
    </div>
  );
}
