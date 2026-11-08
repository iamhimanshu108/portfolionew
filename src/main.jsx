import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { createRoot } from 'react-dom/client';
import { aboutContent } from '../data/aboutData.js';
import { experience } from '../data/experienceData.js';
import { homeContent } from '../data/homeData.js';
import { profile } from '../data/profileData.js';
import { projects } from '../data/projectsData.js';
import { skills } from '../data/skillsData.js';
import { cn } from './lib/cn.js';
import './index.css';

const photo = new URL('../data/My.png', import.meta.url).href;
const easeOut = 'easeOut';
const roles = ['Full-Stack Developer', 'AI Engineer', 'Automation Builder'];

function ThemeIcon({ dark }) {
  return dark
    ? <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M13.4 10.8A5.3 5.3 0 0 1 5.2 2.6 5.4 5.4 0 1 0 13.4 10.8Z" /></svg>
    : <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"><circle cx="8" cy="8" r="2.5" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M13 3l-1.4 1.4M4.4 11.6 3 13" /></svg>;
}

function Reveal({ children, className, delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay, ease: easeOut }}>{children}</motion.div>;
}

function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 500, damping: 35 });
  const y = useSpring(0, { stiffness: 500, damping: 35 });
  const bounds = useRef(null);
  const updateBounds = () => { bounds.current = ref.current?.getBoundingClientRect() ?? null; };
  const move = (event) => { const box = bounds.current; if (!box) return; x.set((event.clientX - box.left - box.width / 2) * 0.15); y.set((event.clientY - box.top - box.height / 2) * 0.15); };
  return <motion.a ref={ref} className={cn('inline-flex min-h-11 items-center gap-3 border px-4 py-3 text-sm transition-opacity duration-150 hover:opacity-75', className)} style={{ x, y }} onPointerEnter={updateBounds} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function Cursor() {
  const x = useMotionValue(-20); const y = useMotionValue(-20); const sx = useSpring(x, { stiffness: 500, damping: 40 }); const sy = useSpring(y, { stiffness: 500, damping: 40 }); const [active, setActive] = useState(false);
  useEffect(() => { if (!window.matchMedia('(pointer:fine)').matches) return undefined; const move = (event) => { x.set(event.clientX - 4); y.set(event.clientY - 4); setActive(false); }; const enter = () => setActive(true); const leave = () => setActive(false); window.addEventListener('pointermove', move, { passive: true }); const links = document.querySelectorAll('a,button'); links.forEach((link) => { link.addEventListener('mouseenter', enter); link.addEventListener('mouseleave', leave); }); return () => { window.removeEventListener('pointermove', move); links.forEach((link) => { link.removeEventListener('mouseenter', enter); link.removeEventListener('mouseleave', leave); }); }; }, [x, y]);
  return <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-30 size-2 rounded-full bg-vermilion" style={{ x: sx, y: sy }} animate={{ scale: active ? 2 : 1 }} transition={{ duration: 0.15, ease: easeOut }} />;
}

function PhotoBlock() {
  const x = useSpring(0, { stiffness: 250, damping: 30 }); const y = useSpring(0, { stiffness: 250, damping: 30 }); const rotate = useSpring(0, { stiffness: 250, damping: 30 }); const [ready, setReady] = useState(false);
  const move = (event) => { const box = event.currentTarget.getBoundingClientRect(); x.set(((event.clientX - box.left) / box.width - 0.5) * 8); y.set(((event.clientY - box.top) / box.height - 0.5) * 8); rotate.set(((event.clientX - box.left) / box.width - 0.5) * 4); };
  return <motion.div className="relative aspect-[4/5] w-full max-w-[22rem] bg-vermilion" style={{ x, y, rotate }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); rotate.set(0); }}><img className="absolute inset-0 size-full object-cover grayscale" src={photo} alt="Portrait of Himanshu Kumar Yadav" width="1254" height="1254" loading="eager" /><motion.img className="absolute inset-0 size-full object-cover" src={photo} alt="" width="1254" height="1254" loading="eager" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} /><motion.span className="absolute inset-0 z-10 bg-vermilion" initial={{ y: 0 }} animate={{ y: ready ? '-100%' : 0 }} transition={{ duration: 0.7, ease: easeOut }} onAnimationComplete={() => setReady(true)} aria-hidden="true" /></motion.div>;
}

function ScrambleHeading({ children, className }) {
  const [value, setValue] = useState(children); const done = useRef(false); const glyphs = '!<>-_\\/[]{}=+*?#';
  const resolve = () => { if (done.current) return; done.current = true; let frame = 0; const tick = () => { const progress = frame / 20; setValue([...children].map((char, index) => char === ' ' ? ' ' : index < children.length * progress ? char : glyphs[Math.floor(Math.random() * glyphs.length)]).join('')); if (frame++ < 20) requestAnimationFrame(tick); else setValue(children); }; tick(); };
  return <motion.h2 className={cn('max-w-[10ch] text-balance font-display text-5xl leading-[.95] md:text-7xl', className)} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, ease: easeOut }} onViewportEnter={resolve}>{value}</motion.h2>;
}

function StackLanes() {
  return <div className="divide-y divide-app-line border-y border-app-line">{skills.map((category, index) => <div className="grid gap-5 py-6 md:grid-cols-[3rem_15rem_1fr] md:items-start" key={category.id}><span className="font-mono text-xs text-vermilion">{String(index + 1).padStart(2, '0')}</span><h3 className="font-display text-xl text-app-text">{category.title}</h3><ul className="flex flex-wrap gap-x-5 gap-y-2 text-app-muted">{category.items.map((item) => <li className="font-mono text-sm transition-colors duration-150 hover:text-vermilion" key={item}>{item}</li>)}</ul></div>)}</div>;
}

function Timeline() {
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 35%'] }); const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <div ref={ref} className="relative mt-10 pl-6"><div className="absolute bottom-0 left-0 top-0 w-px bg-app-line"><motion.div className="h-full origin-top bg-vermilion" style={{ scaleY }} /></div>{experience.map((item, index) => <Reveal key={item.id} delay={index * 0.07} className="relative pb-10 last:pb-0"><motion.span className="absolute -left-[1.7rem] top-1 size-2 origin-center bg-vermilion" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.35, ease: easeOut }} /><span className="font-mono text-xs text-app-muted">{item.period}</span><h3 className="mt-1 font-display text-xl">{item.company} · {item.role}</h3><p className="mt-1 max-w-2xl text-pretty text-app-muted">{item.highlights[0]}</p></Reveal>)}</div>;
}

function projectType(project) {
  if (project.technologies.some((technology) => technology.includes('AI'))) return 'AI system';
  if (project.technologies.some((technology) => technology.includes('Automation'))) return 'Automation';
  return 'Web product';
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('hky-theme') === 'dark'); const [roleIndex, setRoleIndex] = useState(0); const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll(); const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('hky-theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { const timer = setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2800); return () => clearInterval(timer); }, []);
  const copyEmail = async () => { try { await navigator.clipboard.writeText(profile.email); } catch { /* clipboard may be unavailable on file:// */ } setCopied(true); setTimeout(() => setCopied(false), 1400); };
  const border = 'border-app-line'; const muted = 'text-app-muted';
  return <div className="min-h-dvh bg-app-bg text-app-text">
    <motion.div className="fixed inset-x-0 top-0 z-20 h-0.5 origin-left bg-vermilion" style={{ scaleX: progressScale }} aria-hidden="true" />
    <nav className={cn('nav-surface fixed left-1/2 top-4 z-20 flex w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 items-center justify-between border px-4 py-2', border)} aria-label="Main navigation"><a href="#home" className="font-display text-lg">HKY<span className="text-vermilion">:</span></a><div className={cn('hidden gap-4 text-sm md:flex', muted)}><a href="#about">About</a><a href="#stack">Stack</a><a href="#work">Work</a><a href="#experience">Experience</a><a href="#contact">Contact</a></div><button className={cn('flex size-11 items-center justify-center border bg-app-surface', border)} onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} aria-pressed={dark}><ThemeIcon dark={dark} /></button></nav>
    <main>
      <section id="home" className={cn('min-h-dvh border-b pb-20 pt-32', border)}><div className="mx-auto grid w-[calc(100%-2.5rem)] max-w-6xl items-center gap-12 md:grid-cols-[1fr_22rem]"><div><h1 className="text-balance font-display text-7xl leading-[.85] md:text-[9rem]"><motion.span className="block overflow-hidden" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .65, ease: easeOut }}>Himanshu</motion.span><motion.span className="block overflow-hidden" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .65, delay: .08, ease: easeOut }}>Kumar</motion.span><motion.span className="block overflow-hidden text-vermilion" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .65, delay: .16, ease: easeOut }}>Yadav</motion.span></h1><motion.p className="mt-7 font-mono text-sm text-vermilion" key={roles[roleIndex]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2, ease: easeOut }}>{roles[roleIndex]}<span className="ml-1 inline-block h-4 w-px translate-y-1 bg-vermilion" /></motion.p><p className={cn('mt-3 max-w-xl text-pretty text-lg', muted)}>{homeContent.intro}</p><div className="mt-8 flex flex-wrap gap-3"><MagneticButton href="#work" className="border-vermilion bg-vermilion">View work</MagneticButton><MagneticButton href="#contact">Let's talk</MagneticButton></div></div><PhotoBlock /></div></section>
      <section id="about" className={cn('border-b py-24', border)}><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs text-vermilion">About</p><ScrambleHeading>I build the useful kind of complex.</ScrambleHeading><div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_.8fr]"><Reveal><p className={cn('max-w-2xl text-pretty text-2xl leading-tight', muted)}>{aboutContent.workSummary}</p></Reveal><Reveal delay={.07} className="grid grid-cols-3 gap-4 self-end"><div className={cn('border-t pt-3', border)}><strong className="font-display text-4xl text-vermilion">1+</strong><span className={cn('mt-1 block font-mono text-xs', muted)}>years building</span></div><div className={cn('border-t pt-3', border)}><strong className="font-display text-4xl text-vermilion">{projects.length}</strong><span className={cn('mt-1 block font-mono text-xs', muted)}>shipped projects</span></div><div className={cn('border-t pt-3', border)}><strong className="font-display text-4xl text-vermilion">n8n</strong><span className={cn('mt-1 block font-mono text-xs', muted)}>workflow engine</span></div></Reveal></div></div></section>
      <section id="stack" className={cn('border-b py-24', border)}><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs text-vermilion">Stack</p><ScrambleHeading>Tools that earn their keep.</ScrambleHeading><div className="mt-12"><StackLanes /></div></div></section>
      <section id="work" className={cn('border-b py-24', border)}><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs text-vermilion">Selected work</p><ScrambleHeading>Built to be used.</ScrambleHeading><div className={cn('mt-12 border-t', border)}>{projects.map((project, index) => <Reveal key={project.id} delay={index * .07} className={cn('group relative grid gap-4 overflow-hidden border-b py-5 md:grid-cols-[3rem_minmax(0,1fr)_8rem_auto] md:items-center', border)}><span className="relative z-10 font-mono text-xs text-vermilion group-hover:text-ink">{String(index + 1).padStart(2, '0')}</span><div className="relative z-10"><h3 className="font-display text-2xl transition-transform duration-150 group-hover:translate-x-2">{project.title}</h3><p className={cn('mt-1 line-clamp-2 max-w-3xl text-pretty group-hover:text-ink', muted)}>{project.description}</p><div className="mt-3 flex flex-wrap gap-2"><span className={cn('border px-2 py-1 font-mono text-[10px] group-hover:border-ink group-hover:text-ink', border, muted)}>{projectType(project)}</span>{project.technologies.slice(0, 2).map((technology) => <span key={technology} className={cn('border px-2 py-1 font-mono text-[10px] group-hover:border-ink group-hover:text-ink', border, muted)}>{technology}</span>)}</div></div><div className="relative z-10 font-mono text-xs text-app-muted"><span className="block text-app-text">{project.status}</span><span className="block mt-1">{project.fileName}</span></div><a className="relative z-10 inline-flex min-h-11 items-center font-mono text-xs text-vermilion underline-offset-4 hover:underline group-hover:text-ink" href={project.repoUrl} target="_blank" rel="noreferrer">View repo</a><span className="absolute inset-0 origin-left scale-x-0 bg-vermilion transition-transform duration-150 group-hover:scale-x-100" aria-hidden="true" /></Reveal>)}</div></div></section>
      <section id="experience" className={cn('border-b py-24', border)}><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs text-vermilion">Experience</p><ScrambleHeading>A short timeline.</ScrambleHeading><Timeline /></div></section>
      <section id="contact" className="py-24"><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs text-vermilion">Contact</p><h2 className="mt-4 max-w-4xl text-balance font-display text-7xl leading-[.85] md:text-[10rem]">Let's build something<span className="text-vermilion">.</span></h2><div className={cn('mt-12 flex flex-wrap gap-6', muted)}><a href={`mailto:${profile.email}`}>{profile.email}</a><button className="min-h-11 font-mono text-xs text-vermilion underline-offset-4 hover:underline" onClick={copyEmail}>Copy email</button><a className="underline-offset-4 hover:underline" href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a><a className="underline-offset-4 hover:underline" href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a></div></div></section>
    </main>
    <footer className={cn('mx-auto flex w-[calc(100%-2.5rem)] max-w-6xl justify-between border-t py-8 font-mono text-xs', border, muted)}><span>© 2026 Himanshu Kumar Yadav</span><span>Guwahati, India</span></footer>
    {copied && <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 bg-app-text px-3 py-2 font-mono text-xs text-app-bg" role="status" aria-live="polite">Copied!</div>}
    <Cursor />
  </div>;
}

export default App;
createRoot(document.getElementById('root')).render(<App />);
