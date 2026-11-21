import { useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowRight, FiCopy, FiFileText, FiGithub, FiLinkedin, FiMail, FiMoon, FiSearch, FiSun } from 'react-icons/fi';
import { profile } from '../../data/profileData.js';

export function CommandPalette({ open, onClose, theme, onToggleTheme, onCopyEmail }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const returnFocus = useRef(null);

  const commands = useMemo(() => [
    { id: 'work', label: 'Go to selected work', icon: FiArrowRight, run: () => { location.hash = 'work'; } },
    { id: 'about', label: 'Go to about & stack', icon: FiArrowRight, run: () => { location.hash = 'about'; } },
    { id: 'experience', label: 'Go to experience', icon: FiArrowRight, run: () => { location.hash = 'experience'; } },
    { id: 'contact', label: 'Go to contact', icon: FiArrowRight, run: () => { location.hash = 'contact'; } },
    { id: 'copy', label: 'Copy email address', icon: FiCopy, run: onCopyEmail },
    { id: 'mail', label: 'Write an email', icon: FiMail, run: () => { location.href = `mailto:${profile.email}`; } },
    { id: 'resume', label: 'Open résumé', icon: FiFileText, run: () => window.open(profile.resumeUrl, '_blank', 'noopener') },
    { id: 'github', label: 'Open GitHub', icon: FiGithub, run: () => window.open(profile.githubUrl, '_blank', 'noopener') },
    { id: 'linkedin', label: 'Open LinkedIn', icon: FiLinkedin, run: () => window.open(profile.linkedinUrl, '_blank', 'noopener') },
    { id: 'theme', label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', icon: theme === 'dark' ? FiSun : FiMoon, run: onToggleTheme },
  ], [theme, onToggleTheme, onCopyEmail]);

  const fold = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const results = commands.filter((command) => fold(command.label).includes(fold(query.trim())));

  useEffect(() => {
    if (!open) return undefined;
    returnFocus.current = document.activeElement;
    setQuery(''); setIndex(0);
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = ''; returnFocus.current?.focus?.(); };
  }, [open]);

  useEffect(() => { setIndex(0); }, [query]);

  if (!open) return null;

  const run = (command) => { onClose(); command.run(); };
  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); setIndex((i) => (i + 1) % Math.max(results.length, 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1)); }
    else if (event.key === 'Enter' && results[index]) { event.preventDefault(); run(results[index]); }
    else if (event.key === 'Tab') { event.preventDefault(); }
  };

  return <div className="palette-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="palette" role="dialog" aria-modal="true" aria-label="Quick actions" onKeyDown={onKeyDown}>
      <div className="palette-search">
        <FiSearch aria-hidden="true" />
        <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Jump to a section or run an action" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined} aria-autocomplete="list" />
        <kbd>Esc</kbd>
      </div>
      <ul id="palette-list" role="listbox" className="palette-list">
        {results.length === 0 && <li className="palette-empty">No matches. Try “contact” or “résumé”.</li>}
        {results.map((command, i) => {
          const Icon = command.icon;
          return <li key={command.id} id={`cmd-${command.id}`} role="option" aria-selected={i === index} className="palette-item" onMouseMove={() => setIndex(i)} onClick={() => run(command)}>
            <Icon aria-hidden="true" />{command.label}
          </li>;
        })}
      </ul>
    </div>
  </div>;
}
