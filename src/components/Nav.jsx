import { useEffect, useState } from 'react';
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';

const items = [['Work', 'work'], ['About', 'about'], ['Experience', 'experience'], ['Contact', 'contact']];
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export function Nav({ theme, onToggleTheme, onOpenPalette }) {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    ['top', ...items.map(([, id]) => id)].forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  return <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
    <div className="container nav-inner">
      <a className="brand" href="#top" onClick={() => setOpen(false)} aria-label="Himanshu Yadav, back to top">
        <span className="brand-mark" aria-hidden="true">hy</span>
        <span className="brand-name">Himanshu Yadav</span>
      </a>
      <nav aria-label="Sections" id="site-menu" className="nav-links">
        {items.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="nav-tools">
        <button type="button" className="palette-trigger" onClick={onOpenPalette} aria-label="Open quick actions" aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}>
          <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd>
        </button>
        <button type="button" className="icon-button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          {theme === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>
        <button type="button" className="icon-button menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>
    </div>
  </header>;
}
