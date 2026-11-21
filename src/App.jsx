import { useCallback, useEffect, useState } from 'react';
import { profile } from '../data/profileData.js';
import { Nav } from './components/Nav.jsx';
import { CommandPalette } from './components/CommandPalette.jsx';
import { Hero } from './sections/Hero.jsx';
import { Work } from './sections/Work.jsx';
import { About } from './sections/About.jsx';
import { Experience } from './sections/Experience.jsx';
import { Contact } from './sections/Contact.jsx';
import { useTheme } from './lib/useTheme.js';
import { useCopy } from './lib/useCopy.js';
import { useReveal } from './lib/useReveal.js';

export function App() {
  const { theme, toggle } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState('');
  const { copy } = useCopy();
  useReveal();

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(''), 2000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const copyEmail = useCallback(async () => {
    setToast((await copy(profile.email)) ? 'Email address copied' : `Couldn’t copy. The address is ${profile.email}`);
  }, [copy]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="scroll-progress" aria-hidden="true" />
    <Nav theme={theme} onToggleTheme={toggle} onOpenPalette={() => setPaletteOpen(true)} />
    <main id="main">
      <Hero />
      <Work />
      <About />
      <Experience />
      <Contact />
    </main>
    <footer className="footer">
      <div className="container footer-inner">
        <span suppressHydrationWarning>© {new Date().getFullYear()} {profile.name}</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
    <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} theme={theme} onToggleTheme={toggle} onCopyEmail={copyEmail} />
    <div className={`toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
  </>;
}
