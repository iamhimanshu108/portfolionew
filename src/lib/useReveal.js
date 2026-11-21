import { useEffect } from 'react';

// Adds .is-in to [data-reveal] elements as they scroll into view, and drives the
// gold scroll-progress bar. Content stays visible without JS or with reduced motion.
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bar = document.querySelector('.scroll-progress');
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = root.scrollHeight - window.innerHeight;
        bar?.style.setProperty('--progress', max > 0 ? String(window.scrollY / max) : '0');
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    let observer;
    if (!reduce && 'IntersectionObserver' in window) {
      const targets = [...document.querySelectorAll('[data-reveal]')];
      // anything already on screen is shown immediately, so there is no flash
      targets.forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add('is-in'); });
      root.classList.add('motion-ready');
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); }
      }), { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
      targets.forEach((el) => { if (!el.classList.contains('is-in')) observer.observe(el); });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);
}
