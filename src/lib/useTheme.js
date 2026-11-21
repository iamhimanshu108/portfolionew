import { useEffect, useLayoutEffect, useState } from 'react';

const storageKey = 'hky-theme';

function readStored() {
  try { return localStorage.getItem(storageKey); } catch { return null; }
}

export function useTheme() {
  // Start as 'dark' so the server render and first client render match,
  // then pick up what the inline script in index.html already applied.
  const [theme, setTheme] = useState('dark');
  useLayoutEffect(() => {
    setTheme(document.documentElement.dataset.theme || readStored() || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121530' : '#F3F4F8');
  }, [theme]);

  const toggle = () => setTheme((current) => {
    const next = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(storageKey, next); } catch { /* private mode */ }
    return next;
  });

  return { theme, toggle };
}
