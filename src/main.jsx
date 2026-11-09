import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { createRoot } from 'react-dom/client';
import { FiBox } from 'react-icons/fi';
import { SiDocker, SiFastapi, SiGit, SiJavascript, SiLangchain, SiLinux, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiPostgresql, SiPython, SiReact, SiTailwindcss, SiTypescript } from 'react-icons/si';
import { aboutContent } from '../data/aboutData.js';
import { experience } from '../data/experienceData.js';
import { profile } from '../data/profileData.js';
import { projects } from '../data/projectsData.js';
import { cn } from './lib/cn.js';
import './index.css';

const photo = new URL('../data/My.png', import.meta.url).href;
const easeOut = [0.22, 1, 0.36, 1];
const roles = ['Full-Stack Developer', 'AI Engineer', 'Automation Builder'];
const navItems = [['About', '#about'], ['Stack', '#stack'], ['Work', '#work'], ['Experience', '#experience'], ['Contact', '#contact']];
const workflow = [
  ['01', 'Plan', 'Make the problem legible before choosing the tools.', 'compass'],
  ['02', 'Build', 'Turn the sharpest idea into a useful, testable system.', 'brackets'],
  ['03', 'Ship', 'Put the work in people’s hands with a clear path to value.', 'rocket'],
  ['04', 'Iterate', 'Listen to the signal, then improve what matters most.', 'refresh'],
];
const techGroups = [
  { title: 'Frontend', items: [['React', SiReact], ['Next.js', SiNextdotjs], ['JavaScript', SiJavascript], ['TypeScript', SiTypescript], ['Tailwind CSS', SiTailwindcss]] },
  { title: 'Backend', items: [['Node.js', SiNodedotjs], ['Python', SiPython], ['FastAPI', SiFastapi], ['REST APIs', FiBox]] },
  { title: 'AI / ML', items: [['Generative AI', SiLangchain], ['Agentic AI', SiLangchain], ['RAG', FiBox], ['LLMs', SiLangchain], ['AI Integrations', FiBox]] },
  { title: 'Databases', items: [['MongoDB', SiMongodb], ['PostgreSQL', SiPostgresql], ['MySQL', SiMysql]] },
  { title: 'DevOps & Tools', items: [['Docker', SiDocker], ['Git', SiGit], ['CI/CD', FiBox], ['Linux', SiLinux], ['n8n', FiBox]] },
];
const projectFeatures = {
  'ats-score-analyzer': ['Compare a resume to a target role', 'Surface missing skills', 'Generate actionable next steps'],
  'automation-router': ['Route triggers across multiple channels', 'Connect business tools through APIs', 'Run workflows in Docker'],
  'crypto-tracker': ['Track live market prices', 'Review trends and sentiment', 'Save personal watchlists'],
  'weather-dashboard': ['See location-aware forecasts', 'Review historical context', 'Get weather alerts'],
};
const aboutSkills = [
  ['Full-Stack Development', 'React, Next.js, Node.js, and Python products.', 'brackets'],
  ['AI & Agents', 'Generative AI, RAG, LLMs, and agentic workflows.', 'compass'],
  ['Automation & DevOps', 'APIs, Docker, CI/CD, and systems that ship.', 'rocket'],
];

function Icon({ name, size = 18 }) {
  const paths = {
    arrow: <path d="M4 9h11m-4-4 4 4-4 4" />,
    moon: <path d="M14.4 10.7A5.6 5.6 0 0 1 5.3 1.6 5.8 5.8 0 1 0 14.4 10.7Z" />,
    sun: <><circle cx="8" cy="8" r="2.5" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M13 3l-1.4 1.4M4.4 11.6 3 13" /></>,
    menu: <><path d="M2 4h12M2 8h12M2 12h12" /></>,
    close: <><path d="m3 3 10 10M13 3 3 13" /></>,
    arrowUp: <path d="M8 14V2m-4 4 4-4 4 4" />,
    compass: <><circle cx="8" cy="8" r="6" /><path d="m10.5 5.5-1.4 3.6-3.6 1.4 1.4-3.6 3.6-1.4Z" /></>,
    brackets: <><path d="M5 3 2 8l3 5M11 3l3 5-3 5M9 2 7 14" /></>,
    rocket: <><path d="M9.5 3.1c1.8-1.2 3.5-1.2 3.5-1.2s0 1.7-1.2 3.5l-3.2 3.2-2.6-.3-.3-2.6 3.8-2.6Z" /><path d="m6.1 8.9-2.6 2.6M5.1 12.9l-1.9-.1-.1-1.9M8.6 9.4l2 2" /></>,
    refresh: <path d="M13 5V2l-2 2a5.5 5.5 0 1 0 1.2 6.1" />,
    external: <><path d="M9 3h4v4M13 3 7 9" /><path d="M11 8v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></>,
    x: <path d="M3 3h2.6l2.1 3.1L10.4 3H13l-4 4.8L13.2 13h-2.6L8.2 9.6 5.6 13H3l4-4.8L3 3Z" fill="currentColor" stroke="none" />,
    github: <path d="M8 1.4a6.6 6.6 0 0 0-2.1 12.9c.3.1.4-.1.4-.3v-1.2c-1.7.4-2-.8-2-.8-.3-.8-.7-1-.7-1-.6-.4 0-.4 0-.4.7.1 1 .7 1 .7.6 1 1.6.7 2 .5.1-.4.2-.7.4-.9-1.3-.1-2.7-.7-2.7-2.9 0-.6.2-1.1.6-1.5-.1-.2-.3-.8.1-1.5 0 0 .5-.2 1.6.6a5.7 5.7 0 0 1 2.9 0c1.1-.8 1.6-.6 1.6-.6.4.7.2 1.3.1 1.5.4.4.6.9.6 1.5 0 2.2-1.4 2.8-2.7 2.9.2.2.4.6.4 1.1V14c0 .2.1.4.4.3A6.6 6.6 0 0 0 8 1.4Z" fill="currentColor" stroke="none" />,
    linkedin: <path d="M3 5.2A1.2 1.2 0 1 1 3 2.8a1.2 1.2 0 0 1 0 2.4ZM2 6.7h2V13H2V6.7Zm3.3 0h1.9v.9h.1c.3-.6 1-1.1 2-1.1 2.1 0 2.5 1.4 2.5 3.2V13h-2v-2.9c0-.7 0-1.7-1-1.7s-1.1.8-1.1 1.7V13h-2V6.7Z" fill="currentColor" stroke="none" />,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Reveal({ children, className, delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, delay, ease: easeOut }}>{children}</motion.div>;
}

function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null); const x = useSpring(0, { stiffness: 500, damping: 35 }); const y = useSpring(0, { stiffness: 500, damping: 35 }); const bounds = useRef(null);
  const updateBounds = () => { bounds.current = ref.current?.getBoundingClientRect() ?? null; };
  const move = (event) => { const box = bounds.current; if (!box) return; x.set((event.clientX - box.left - box.width / 2) * 0.12); y.set((event.clientY - box.top - box.height / 2) * 0.12); };
  return <motion.a ref={ref} className={cn('button-base inline-flex min-h-12 items-center justify-center gap-3 px-5 py-3 text-sm font-medium', className)} style={{ x, y }} onPointerEnter={updateBounds} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function HeroBackdrop() {
  const x = useMotionValue(0); const y = useMotionValue(0); const sx = useSpring(x, { stiffness: 90, damping: 24 }); const sy = useSpring(y, { stiffness: 90, damping: 24 }); const bounds = useRef(null);
  const move = (event) => { const box = bounds.current; if (!box) return; x.set((event.clientX - box.left - box.width / 2) * 0.025); y.set((event.clientY - box.top - box.height / 2) * 0.025); };
  return <div className="hero-backdrop" onPointerEnter={(event) => { bounds.current = event.currentTarget.getBoundingClientRect(); }} onPointerMove={move}><div className="hero-grid" /><motion.div className="hero-orb hero-orb-one" style={{ x: sx, y: sy }} /><motion.div className="hero-orb hero-orb-two" style={{ x: useTransform(sx, (value) => value * -1), y: useTransform(sy, (value) => value * -1) }} /></div>;
}

function Cursor() {
  const x = useMotionValue(-20); const y = useMotionValue(-20); const sx = useSpring(x, { stiffness: 500, damping: 40 }); const sy = useSpring(y, { stiffness: 500, damping: 40 }); const [active, setActive] = useState(false);
  useEffect(() => { if (!window.matchMedia('(pointer:fine)').matches) return undefined; const move = (event) => { x.set(event.clientX - 4); y.set(event.clientY - 4); }; const enter = () => setActive(true); const leave = () => setActive(false); window.addEventListener('pointermove', move, { passive: true }); const links = document.querySelectorAll('a,button'); links.forEach((link) => { link.addEventListener('mouseenter', enter); link.addEventListener('mouseleave', leave); }); return () => { window.removeEventListener('pointermove', move); links.forEach((link) => { link.removeEventListener('mouseenter', enter); link.removeEventListener('mouseleave', leave); }); }; }, [x, y]);
  return <><motion.div aria-hidden="true" className="custom-cursor-dot" style={{ x: sx, y: sy }} /><motion.div aria-hidden="true" className="custom-cursor-ring" style={{ x: sx, y: sy }} animate={{ scale: active ? 1.8 : 1, opacity: active ? 0.65 : 0.35 }} transition={{ duration: 0.16 }} /></>;
}

function PhotoBlock() {
  const x = useSpring(0, { stiffness: 250, damping: 30 }); const y = useSpring(0, { stiffness: 250, damping: 30 }); const rotate = useSpring(0, { stiffness: 250, damping: 30 }); const [ready, setReady] = useState(false);
  const move = (event) => { const box = event.currentTarget.getBoundingClientRect(); x.set(((event.clientX - box.left) / box.width - 0.5) * 7); y.set(((event.clientY - box.top) / box.height - 0.5) * 7); rotate.set(((event.clientX - box.left) / box.width - 0.5) * 3); };
  return <div className="photo-float"><motion.div className="photo-frame" style={{ x, y, rotate }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); rotate.set(0); }}><img className="absolute inset-0 size-full object-cover grayscale" src={photo} alt="Portrait of Himanshu Yadav" width="1254" height="1254" loading="eager" /><motion.img className="absolute inset-0 size-full object-cover" src={photo} alt="" width="1254" height="1254" loading="eager" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} /><motion.span className="absolute inset-0 z-10 bg-accent" initial={{ y: 0 }} animate={{ y: ready ? '-100%' : 0 }} transition={{ duration: 0.7, ease: easeOut }} onAnimationComplete={() => setReady(true)} aria-hidden="true" /><span className="photo-caption">/ 01 — Himanshu Yadav</span></motion.div></div>;
}

function ThemeIcon({ dark }) { return <Icon name={dark ? 'moon' : 'sun'} size={17} />; }

function TechIcon({ IconComponent }) {
  return <IconComponent aria-hidden="true" />;
}

function StackMarqueeRow({ items, reverse = false }) {
  const renderItems = (duplicate = false) => <div className={cn('stack-marquee-set', duplicate && 'stack-marquee-duplicate')} aria-hidden={duplicate}>{items.map(([name, IconComponent], index) => <span className="stack-marquee-item" key={`${name}-${duplicate ? 'duplicate' : 'visible'}-${index}`}><TechIcon IconComponent={IconComponent} />{name}</span>)}</div>;
  return <div className={cn('stack-marquee-row', reverse && 'is-reverse')}><div className="stack-marquee-track">{renderItems()}{renderItems(true)}</div></div>;
}

function StackSectionContent() {
  const marqueeItems = techGroups.flatMap((group) => group.items);
  return <div className="stack-content"><div className="stack-marquee" aria-label="Technology stack marquee"><StackMarqueeRow items={marqueeItems} /><StackMarqueeRow items={[...marqueeItems].reverse()} reverse /></div></div>;
}

function HeroHeadline() {
  const reduceMotion = useReducedMotion();
  const words = [
    ['I', false], ['build', false], ['full-stack', false], ['products', false],
    ['that', false], ['think,', true], ['automate,', false], ['and', false], ['scale.', true],
  ];
  return <h1>{words.map(([word, gradient], index) => <motion.span key={word} className={gradient ? 'gradient-text' : undefined} initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: index * 0.06, ease: easeOut }}>{word}{index < words.length - 1 ? ' ' : ''}</motion.span>)}</h1>;
}

function AboutHeading() {
  const reduceMotion = useReducedMotion();
  const words = [['Useful', false], ['complexity,', false], ['made', false], ['clear.', true]];
  return <h2 className="about-heading">{words.map(([word, gradient], index) => <motion.span key={word} className={gradient ? 'gradient-text' : undefined} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.5, delay: index * 0.07, ease: easeOut }}>{word}{index < words.length - 1 ? ' ' : ''}</motion.span>)}</h2>;
}

function AboutSkills() {
  const reduceMotion = useReducedMotion();
  return <div className="about-skill-list">{aboutSkills.map(([title, text, icon], index) => <motion.article key={title} className="about-skill-card" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.45, delay: index * 0.1, ease: easeOut }}><span className="about-skill-icon"><Icon name={icon} size={17} /></span><div><h3>{title}</h3><p>{text}</p></div></motion.article>)}</div>;
}

function HeroTechMarquee() {
  const items = ['React', 'Next.js', 'Node.js', 'Python', 'Generative AI', 'Automation', 'Docker'];
  return <div className="hero-tech page-grid"><span className="hero-tech-label">Built with</span><div className="hero-tech-window"><div className="hero-tech-track">{[...items, ...items].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></div></div>;
}

function projectCategory(project) {
  if (project.technologies.some((technology) => /generative ai|agentic ai|\brag\b|\bllms?\b|ai integrations/i.test(technology))) return 'AI';
  if (project.technologies.some((technology) => /automation|docker|fastapi/i.test(technology))) return 'Automation';
  return 'Full-Stack';
}

const projectImpact = {
  'ats-score-analyzer': 'Turns a long resume review into a clear next step.',
  'automation-router': 'One routing layer for everyday business workflows.',
  'crypto-tracker': 'Market context that is easier to act on at a glance.',
  'weather-dashboard': 'Forecasts and alerts shaped around the place you are in.',
};

function ProjectCard({ project, index, onOpen }) {
  const [spot, setSpot] = useState({ x: 50, y: 50 }); const [tilt, setTilt] = useState({ x: 0, y: 0 }); const bounds = useRef(null);
  const move = (event) => { if (!bounds.current) bounds.current = event.currentTarget.getBoundingClientRect(); const box = bounds.current; const px = (event.clientX - box.left) / box.width; const py = (event.clientY - box.top) / box.height; setSpot({ x: px * 100, y: py * 100 }); setTilt({ x: (0.5 - py) * 5, y: (px - 0.5) * 5 }); };
  return <motion.article className={cn('project-card group', index === 0 && 'project-card-featured')} layout initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} transition={{ duration: 0.4, ease: easeOut }} style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%`, rotateX: tilt.x, rotateY: tilt.y }} onPointerMove={move} onPointerLeave={() => { bounds.current = null; setTilt({ x: 0, y: 0 }); }}><button className="project-open" type="button" onClick={() => onOpen(project)} aria-label={`Open case study for ${project.title}`}><div className="project-image"><img src={project.imageUrl} alt="" loading="lazy" /><div className="project-image-overlay"><span>{String(index + 1).padStart(2, '0')}</span><Icon name="arrow" /></div></div><div className="project-content"><div className="project-meta"><span>{projectCategory(project)}</span></div><h3>{project.title}</h3><p>{projectImpact[project.id] ?? project.description}</p><ul className="project-features">{(projectFeatures[project.id] ?? []).map((feature) => <li key={feature}>{feature}</li>)}</ul><div className="tag-row">{project.technologies.slice(0, 3).map((technology) => <span key={technology}>{technology}</span>)}</div></div></button><div className="project-actions"><a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Live <Icon name="external" size={14} /></a><a href={project.repoUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>GitHub <Icon name="external" size={14} /></a></div></motion.article>;
}

function ProjectModal({ project, onClose }) {
  useEffect(() => { if (!project) return undefined; const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); }; document.body.style.overflow = 'hidden'; window.addEventListener('keydown', closeOnEscape); return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', closeOnEscape); }; }, [project, onClose]);
  if (!project) return null;
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><motion.div className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-study-title" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.98 }}><button className="modal-close" type="button" onClick={onClose} aria-label="Close case study"><Icon name="close" /></button><img src={project.imageUrl} alt="" /><div className="modal-copy"><span className="eyebrow">Case study / {projectCategory(project)}</span><h2 id="case-study-title">{project.title}</h2><p>{project.description}</p><div className="modal-detail-grid"><div><span>Problem</span><strong>Make a complex workflow easier to understand and use.</strong></div><div><span>Solution</span><strong>A focused product surface with useful automation under the hood.</strong></div><div><span>Stack</span><strong>{project.technologies.join(' · ')}</strong></div><div><span>Result</span><strong>{projectImpact[project.id] ?? 'A practical system built for repeat use.'}</strong></div></div><div className="project-actions modal-actions"><a href={project.liveUrl} target="_blank" rel="noreferrer">Open live <Icon name="external" size={14} /></a><a href={project.repoUrl} target="_blank" rel="noreferrer">View GitHub <Icon name="external" size={14} /></a></div></div></motion.div></motion.div>;
}

function Timeline() {
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72%', 'end 38%'] }); const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <div ref={ref} className="timeline"><div className="timeline-rail"><motion.div style={{ scaleY }} /></div>{experience.map((item, index) => <Reveal key={item.id} delay={index * 0.08} className="timeline-item"><span className="timeline-dot" /><div className="timeline-header"><span>{item.period}</span><span>0{index + 1}</span></div><h3>{item.role} <em>at</em> {item.company}</h3><ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></Reveal>)}</div>;
}

function App() {
  const [dark, setDark] = useState(() => { const stored = localStorage.getItem('hky-theme'); return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; });
  const [roleIndex, setRoleIndex] = useState(0); const [menuOpen, setMenuOpen] = useState(false); const [active, setActive] = useState('home'); const [filter, setFilter] = useState('All'); const [selectedProject, setSelectedProject] = useState(null); const [formState, setFormState] = useState({ type: 'idle', message: '' }); const [toast, setToast] = useState(''); const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll(); const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollY, 'change', (latest) => { const next = latest > 32; setScrolled((current) => current === next ? current : next); });
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('hky-theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { const stored = localStorage.getItem('hky-theme'); if (stored) return undefined; const media = window.matchMedia('(prefers-color-scheme: dark)'); const change = (event) => setDark(event.matches); media.addEventListener('change', change); return () => media.removeEventListener('change', change); }, []);
  useEffect(() => { const timer = setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2800); return () => clearInterval(timer); }, []);
  useEffect(() => { const sections = ['home', 'about', 'stack', 'work', 'experience', 'contact'].map((id) => document.getElementById(id)).filter(Boolean); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-25% 0px -60% 0px' }); sections.forEach((section) => observer.observe(section)); return () => observer.disconnect(); }, []);
  const copyEmail = async () => { try { await navigator.clipboard.writeText(profile.email); setToast('Email copied'); } catch { setToast('Copy failed — use the email link'); } window.setTimeout(() => setToast(''), 2200); };
  const submitContact = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const email = String(form.get('email') || ''); const message = String(form.get('message') || ''); if (!email || !message) { setFormState({ type: 'error', message: 'Add your email and a short message.' }); return; } try { const subject = encodeURIComponent(`Project enquiry from ${form.get('name')}`); const body = encodeURIComponent(`${message}\n\nReply to: ${email}`); window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`; setFormState({ type: 'success', message: 'Opening your email app…' }); } catch { setFormState({ type: 'error', message: 'Something went wrong. Please email me directly.' }); } };
  const filteredProjects = filter === 'All' ? projects : projects.filter((project) => projectCategory(project) === filter);
  const border = 'border-app-line'; const muted = 'text-app-muted';
  return <div className="site-shell min-h-dvh bg-app-bg text-app-text">
    <motion.div className="scroll-progress" style={{ scaleX: progressScale }} aria-hidden="true" />
    <header className={cn('site-nav-wrap', scrolled && 'is-scrolled')}><nav className={cn('site-nav', border)} aria-label="Main navigation"><a href="#home" className="brand" onClick={() => setMenuOpen(false)}>Himanshu<span>:</span></a><div className="desktop-nav">{navItems.map(([label, href]) => <a className={cn(active === href.slice(1) && 'is-active')} key={href} href={href}>{label}</a>)}</div><div className="nav-actions"><button className="theme-toggle" type="button" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} aria-pressed={dark}><ThemeIcon dark={dark} /></button><button className="menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}><Icon name={menuOpen ? 'close' : 'menu'} /></button></div></nav><AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{navItems.map(([label, href], index) => <motion.a key={href} href={href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>{label}<Icon name="arrow" size={15} /></motion.a>)}</motion.div>}</AnimatePresence></header>
    <main>
      <section id="home" className="hero-section"><HeroBackdrop /><div className="page-grid hero-inner"><div className="hero-copy"><motion.div className="status-chip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOut }}><span className="status-dot" />Available for work</motion.div><HeroHeadline /><motion.p className="hero-role" key={roles[roleIndex]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>{roles[roleIndex]}<span className="typing-caret" /></motion.p><p className="hero-intro">Full-Stack &amp; AI Developer crafting fast web apps and intelligent automation with React, Next.js, Node.js, and Python.</p><div className="hero-actions"><MagneticButton href="#work" className="button-primary">View My Work <Icon name="arrow" size={16} /></MagneticButton><MagneticButton href={profile.resumeUrl} target="_blank" rel="noreferrer" className="button-ghost">Download CV <Icon name="external" size={15} /></MagneticButton></div></div><PhotoBlock /></div><HeroTechMarquee /></section>
      <section id="about" className="section-block about-section"><div className="page-grid about-layout"><div className="about-main"><Reveal><span className="eyebrow">01 / About</span><AboutHeading /></Reveal><Reveal delay={0.12} className="about-body"><p>{aboutContent.workSummary}</p></Reveal></div><aside className="about-aside"><AboutSkills /><Reveal delay={0.2} className="quick-facts"><div className="quick-facts-heading"><span>Quick facts</span><span>///</span></div><dl><div><dt>Location</dt><dd>{profile.location}</dd></div><div><dt>Focus</dt><dd>Full-stack + AI systems</dd></div><div><dt>Stack</dt><dd>React · Next · Node · Python</dd></div><div><dt>Availability</dt><dd className="fact-available"><span className="status-dot" />Open to select work</dd></div></dl></Reveal></aside></div></section>
      <section id="stack" className="section-block section-dark stack-section"><div className="page-grid section-heading"><Reveal><span className="eyebrow">02 / Stack</span><h2>Tools that earn<br /><span className="gradient-text">their keep.</span></h2></Reveal></div><Reveal className="page-grid"><StackSectionContent /></Reveal></section>
      <section id="work" className="section-block"><div className="page-grid section-heading"><Reveal><span className="eyebrow">03 / Selected work</span><h2>Built to be<br /><span className="gradient-text">used.</span></h2></Reveal></div><div className="page-grid projects-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filter projects">{['All', 'Full-Stack', 'AI', 'Automation'].map((item) => <button key={item} type="button" className={cn(filter === item && 'is-selected')} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item}</button>)}</div><span className={muted}>{String(filteredProjects.length).padStart(2, '0')} projects</span></div><motion.div layout className="page-grid projects-grid"><AnimatePresence mode="popLayout">{filteredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={setSelectedProject} />)}</AnimatePresence></motion.div></section>
      <section id="experience" className="section-block section-dark"><div className="page-grid section-heading"><Reveal><span className="eyebrow">04 / Experience</span><h2>A short<br /><span className="gradient-text">timeline.</span></h2></Reveal></div><div className="page-grid experience-layout"><Timeline /><Reveal className="how-work"><span className="eyebrow">How I work</span><h3>Clarity in, momentum out.</h3><div className="workflow-grid"><motion.div className="workflow-line" aria-hidden="true" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: easeOut }} />{workflow.map(([number, title, text, icon], index) => <motion.div key={title} className="workflow-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}><span className="workflow-icon"><Icon name={icon} size={17} /></span><span className="workflow-number">{number}</span><h4>{title}</h4><p>{text}</p></motion.div>)}</div></Reveal></div></section>
      <section id="contact" className="contact-section"><div className="page-grid contact-grid"><Reveal className="contact-copy"><span className="eyebrow">05 / Contact</span><h2>Let’s build<br /><span className="gradient-text">something</span><br />together.</h2><div className="contact-details"><a href={`mailto:${profile.email}`}>{profile.email}</a><button type="button" className="copy-email" onClick={copyEmail}>Copy email</button><span>{profile.location}</span><span>Usually replies within 1–2 business days.</span></div><div className="contact-links"><a className="social-link" href={profile.xUrl} target="_blank" rel="noreferrer" aria-label="X profile" title="X"><Icon name="x" size={18} /></a><a className="social-link" href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile" title="GitHub"><Icon name="github" size={18} /></a><a className="social-link" href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile" title="LinkedIn"><Icon name="linkedin" size={18} /></a><a className="text-social-link" href={profile.resumeUrl} target="_blank" rel="noreferrer">Resume</a></div></Reveal><Reveal delay={0.08} className="contact-form-wrap"><form className="contact-form" onSubmit={submitContact}><label className="field"><input name="name" required placeholder=" " /><span>Name</span></label><label className="field"><input name="email" required type="email" placeholder=" " /><span>Email</span></label><label className="field"><textarea name="message" required rows="4" placeholder=" " /><span>Message</span></label><button className="button-base button-primary form-submit" type="submit">Send enquiry <Icon name="arrow" size={16} /></button>{formState.type !== 'idle' && <p className={cn('form-status', formState.type)} role="status">{formState.message}</p>}</form></Reveal></div></section>
    </main>
    <footer className={cn('site-footer page-grid', border, muted)}><span>© 2026 Himanshu Yadav</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <Icon name="arrowUp" size={14} /></button></footer>
    {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    <AnimatePresence>{selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}</AnimatePresence>
    <Cursor />
  </div>;
}

const rootElement = document.getElementById('root');
const root = rootElement._hkyRoot ?? createRoot(rootElement);
rootElement._hkyRoot = root;
root.render(<App />);
