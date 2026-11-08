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
  return <motion.a ref={ref} className={cn('inline-flex items-center gap-3 border px-4 py-3 text-sm transition-opacity duration-150 hover:opacity-75', className)} style={{ x, y }} onPointerEnter={updateBounds} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function Cursor() {
  const x = useMotionValue(-20); const y = useMotionValue(-20);
  const sx = useSpring(x, { stiffness: 500, damping: 40 }); const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [active, setActive] = useState(false);
  useEffect(() => { if (!window.matchMedia('(pointer:fine)').matches) return undefined; const move = (event) => { x.set(event.clientX - 4); y.set(event.clientY - 4); }; window.addEventListener('pointermove', move, { passive: true }); const links = document.querySelectorAll('a,button'); const enter = () => setActive(true); const leave = () => setActive(false); links.forEach((link) => { link.addEventListener('mouseenter', enter); link.addEventListener('mouseleave', leave); }); return () => { window.removeEventListener('pointermove', move); links.forEach((link) => { link.removeEventListener('mouseenter', enter); link.removeEventListener('mouseleave', leave); }); }; }, [x, y]);
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

function Marquee() {
  const ref = useRef(null); const [playing, setPlaying] = useState(false); const items = skills.flatMap((category) => category.items); const doubled = [...items, ...items];
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting && !window.matchMedia('(prefers-reduced-motion: reduce)').matches), { threshold: 0 }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect(); }, []);
  return <div ref={ref} className="overflow-hidden border-y border-bone-line dark:border-[#2A2927]"><div className={cn('flex w-max', playing && 'animate-[ticker_28s_linear_infinite]')}><div className="flex shrink-0">{doubled.map((item, index) => <span className="whitespace-nowrap py-4 pr-5 font-display text-3xl text-muted-ink md:text-6xl" key={`${item}-${index}`}>{item}<span className="text-vermilion"> /</span></span>)}</div></div></div>;
}

function Timeline() {
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 35%'] }); const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <div ref={ref} className="relative mt-10 pl-6"><div className="absolute bottom-0 left-0 top-0 w-px bg-bone-line dark:bg-[#2A2927]"><motion.div className="h-full origin-top bg-vermilion" style={{ scaleY }} /></div>{experience.map((item, index) => <Reveal key={item.id} delay={index * 0.07} className="relative pb-10 last:pb-0"><motion.span className="absolute -left-[1.7rem] top-1 size-2 origin-center bg-vermilion" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.35, ease: easeOut }} /><span className="font-mono text-xs uppercase text-muted-ink">{item.period}</span><h3 className="mt-1 font-display text-xl">{item.company} · {item.role}</h3><p className="mt-1 max-w-2xl text-pretty text-muted-ink dark:text-[#9A958B]">{item.highlights[0]}</p></Reveal>)}</div>;
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('hky-theme') === 'dark'); const [roleIndex, setRoleIndex] = useState(0); const [copied, setCopied] = useState(false); const roles = ['Full-Stack Developer', 'AI Engineer', 'Automation Builder'];
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('hky-theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { const timer = setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2800); return () => clearInterval(timer); }, []);
  const copyEmail = async () => { try { await navigator.clipboard.writeText(profile.email); } catch { /* file:// clipboard can be unavailable */ } setCopied(true); setTimeout(() => setCopied(false), 1400); };
  return <div className="min-h-dvh bg-bone text-ink dark:bg-[#121212] dark:text-bone">
    <motion.div className="fixed inset-x-0 top-0 z-20 h-0.5 origin-left bg-vermilion" style={{ scaleX: progressScale }} aria-hidden="true" />
    <nav className="nav-surface fixed left-1/2 top-4 z-20 flex w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 items-center justify-between border border-bone-line bg-bone px-4 py-2 dark:border-[#2A2927] dark:bg-[#121212]" aria-label="Main navigation"><a href="#home" className="font-display text-lg">HKY<span className="text-vermilion">:</span></a><div className="hidden gap-4 text-sm text-muted-ink md:flex"><a href="#about">About</a><a href="#stack">Stack</a><a href="#work">Work</a><a href="#experience">Experience</a><a href="#contact">Contact</a></div><button className="size-8 border border-bone-line bg-bone-surface dark:border-[#2A2927] dark:bg-[#1B1B1A]" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">{dark ? '☾' : '☀'}</button></nav>
    <main>
      <section id="home" className="min-h-dvh border-b border-bone-line pb-20 pt-32 dark:border-[#2A2927]"><div className="mx-auto grid w-[calc(100%-2.5rem)] max-w-6xl items-center gap-12 md:grid-cols-[1fr_22rem]"><div><div className="mb-6 flex flex-wrap items-center gap-4 font-mono text-xs uppercase text-muted-ink"><span>{homeContent.eyebrow}</span><span className="inline-flex items-center gap-2 border border-bone-line px-2 py-1 dark:border-[#2A2927]"><span className="size-2 animate-pulse bg-vermilion" /> Available for projects</span></div><h1 className="font-display text-7xl leading-[.85] md:text-[9rem]"><motion.span className="block overflow-hidden" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .65, ease: easeOut }}>Himanshu</motion.span><motion.span className="block overflow-hidden" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .65, delay: .08, ease: easeOut }}>Kumar</motion.span><motion.span className="block overflow-hidden text-vermilion" initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .65, delay: .16, ease: easeOut }}>Yadav</motion.span></h1><motion.p className="mt-7 font-mono text-sm uppercase text-vermilion" key={roles[roleIndex]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2, ease: easeOut }}>{roles[roleIndex]}<span className="ml-1 inline-block h-4 w-px translate-y-1 bg-vermilion" /></motion.p><p className="mt-3 max-w-xl text-pretty text-lg text-muted-ink dark:text-[#9A958B]">{homeContent.intro}</p><div className="mt-8 flex flex-wrap gap-3"><MagneticButton href="#work" className="border-vermilion bg-vermilion">View Work <span>↘</span></MagneticButton><MagneticButton href="#contact">Let's Talk <span>↗</span></MagneticButton></div></div><PhotoBlock /></div></section>
      <section id="about" className="border-b border-bone-line py-24 dark:border-[#2A2927]"><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs uppercase text-vermilion">01 / About</p><ScrambleHeading>Software with a pulse.</ScrambleHeading><div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_.8fr]"><Reveal><p className="max-w-2xl text-pretty text-2xl leading-tight text-muted-ink dark:text-[#9A958B]">{aboutContent.workSummary}</p></Reveal><Reveal delay={.07} className="grid grid-cols-3 gap-4 self-end"><div className="border-t border-bone-line pt-3 dark:border-[#2A2927]"><strong className="font-display text-4xl text-vermilion">1+</strong><span className="mt-1 block font-mono text-xs uppercase text-muted-ink">years</span></div><div className="border-t border-bone-line pt-3 dark:border-[#2A2927]"><strong className="font-display text-4xl text-vermilion">{projects.length}</strong><span className="mt-1 block font-mono text-xs uppercase text-muted-ink">projects</span></div><div className="border-t border-bone-line pt-3 dark:border-[#2A2927]"><strong className="font-display text-4xl text-vermilion">n8n</strong><span className="mt-1 block font-mono text-xs uppercase text-muted-ink">automation</span></div></Reveal></div></div></section>
      <section id="stack" className="border-b border-bone-line py-24 dark:border-[#2A2927]"><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs uppercase text-vermilion">02 / Stack</p><ScrambleHeading>Things I build with.</ScrambleHeading><div className="mt-12"><Marquee /></div></div></section>
      <section id="work" className="border-b border-bone-line py-24 dark:border-[#2A2927]"><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs uppercase text-vermilion">03 / Projects</p><ScrambleHeading>A few things in the wild.</ScrambleHeading><div className="mt-12 border-t border-bone-line dark:border-[#2A2927]">{projects.map((project, index) => <Reveal key={project.id} delay={index * .07} className="group relative grid gap-4 overflow-hidden border-b border-bone-line py-5 md:grid-cols-[3rem_1fr_auto] md:items-center dark:border-[#2A2927]"><span className="relative z-10 font-mono text-xs text-vermilion group-hover:text-ink">{String(index + 1).padStart(2, '0')}</span><div className="relative z-10"><h3 className="font-display text-2xl transition-transform duration-150 group-hover:translate-x-2">{project.title}</h3><p className="mt-1 line-clamp-2 max-w-3xl text-pretty text-muted-ink group-hover:text-ink dark:text-[#9A958B]">{project.description}</p><div className="mt-3 flex flex-wrap gap-2">{project.technologies.slice(0, 3).map((technology) => <span key={technology} className="border border-bone-line px-2 py-1 font-mono text-[10px] text-muted-ink group-hover:border-ink group-hover:text-ink dark:border-[#2A2927]">{technology}</span>)}</div></div><a className="relative z-10 font-mono text-xs text-vermilion group-hover:text-ink" href={project.repoUrl} target="_blank" rel="noreferrer">GitHub ↗</a><span className="absolute inset-0 origin-left scale-x-0 bg-vermilion transition-transform duration-150 group-hover:scale-x-100" aria-hidden="true" /></Reveal>)}</div></div></section>
      <section id="experience" className="border-b border-bone-line py-24 dark:border-[#2A2927]"><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs uppercase text-vermilion">04 / Experience</p><ScrambleHeading>Where I learned the craft.</ScrambleHeading><Timeline /></div></section>
      <section id="contact" className="py-24"><div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl"><p className="font-mono text-xs uppercase text-vermilion">05 / Contact</p><h2 className="mt-4 max-w-4xl text-balance font-display text-7xl leading-[.85] md:text-[10rem]">Let's build something<span className="text-vermilion">.</span></h2><div className="mt-12 flex flex-wrap gap-6 text-muted-ink dark:text-[#9A958B]"><a href={`mailto:${profile.email}`}>{profile.email}</a><button className="font-mono text-xs text-vermilion" onClick={copyEmail}>Copy email</button><a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div></section>
    </main>
    <footer className="mx-auto flex w-[calc(100%-2.5rem)] max-w-6xl justify-between border-t border-bone-line py-8 font-mono text-xs uppercase text-muted-ink dark:border-[#2A2927] dark:text-[#9A958B]"><span>© 2026 Himanshu Kumar Yadav</span><span>Guwahati, India</span></footer>
    {copied && <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 bg-ink px-3 py-2 font-mono text-xs text-bone" role="status">Copied!</div>}
    <Cursor />
  </div>;
}

export default App;

createRoot(document.getElementById('root')).render(<App />);
