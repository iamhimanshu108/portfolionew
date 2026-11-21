import { useEffect, useState } from 'react';

const storageKey = 'hky-theme';

function readStored() {
  try { return localStorage.getItem(storageKey); } catch { return null; }
}

export function useTheme() {
  const [theme, setTheme] = useState(() => readStored() ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));

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
