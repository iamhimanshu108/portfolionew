import { Fragment, useLayoutEffect, useState } from 'react';
import { useSpotlight } from '../lib/useSpotlight.js';
import { FiArrowUpRight, FiFileText } from 'react-icons/fi';
import { profile } from '../../data/profileData.js';
import { trackEvent } from '../lib/track.js';

import avatar from '../../data/photo-96.webp';

const answers = [
  {
    id: 'hiring',
    label: 'I’m hiring',
    text: 'Full-stack developer at BizSkill since 2025, now focused on AI features: RAG, agents and automation. Open to full-time roles.',
    links: [
      { label: 'Résumé', href: profile.resumeUrl, event: 'Resume click' },
      { label: 'LinkedIn', href: profile.linkedinUrl },
    ],
  },
  {
    id: 'project',
    label: 'I have a project',
    text: 'Tell me what’s slow or manual today. I’ll build a first version you can use: a web app, an API, or an AI assistant on your data.',
    links: [
      { label: 'Email me', href: `mailto:${profile.email}`, event: 'Contact' },
      { label: 'See work', href: '#work' },
    ],
  },
  {
    id: 'developer',
    label: 'I’m a developer',
    text: 'Hey! My Next.js apps, FastAPI services and automation experiments are all on GitHub. Happy to talk RAG and agents.',
    links: [
      { label: 'GitHub', href: profile.githubUrl },
      { label: 'X / Twitter', href: profile.xUrl },
    ],
  },
];

// The full answer is rendered on the server (good for crawlers and no-JS),
// then streamed in on the client before the first paint.
function useStream(text, enabled, delay) {
  const [count, setCount] = useState(text.length);
  useLayoutEffect(() => {
    if (!enabled) { setCount(text.length); return undefined; }
    setCount(0);
    let index = 0;
    let interval;
    // wait for the hero intro to finish, then type roughly one "token" at a time
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index = Math.min(text.length, index + 2 + Math.floor(Math.random() * 4));
        setCount(index);
        if (index >= text.length) window.clearInterval(interval);
      }, 24);
    }, delay);
    return () => { window.clearTimeout(start); window.clearInterval(interval); };
  }, [text, enabled, delay]);
  return { shown: text.slice(0, count), done: count >= text.length };
}

function AskPanel() {
  const [active, setActive] = useState(answers[0]);
  const [animate, setAnimate] = useState(false);
  const [delay, setDelay] = useState(1100);
  useLayoutEffect(() => { setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  const { shown, done } = useStream(active.text, animate, delay);
  const spotlight = useSpotlight();

  const choose = (answer) => {
    setDelay(150);
    setActive(answer);
    trackEvent('Hero intent', { intent: answer.id });
  };

  return <div className="ask" {...spotlight}>
    <p className="ask-question" id="ask-question">What brings you here?</p>
    <div className="ask-options" role="radiogroup" aria-labelledby="ask-question">
      {answers.map((answer) => <button key={answer.id} type="button" role="radio" aria-checked={active.id === answer.id} className="ask-option" onClick={() => choose(answer)}>{answer.label}</button>)}
    </div>
    <div className="ask-reply" aria-live="polite" aria-busy={!done}>
      <img className="ask-avatar" src={avatar} alt="" width="36" height="36" />
      <div>
        <p className="ask-text">{shown}{!done && <span className="ask-caret" aria-hidden="true" />}</p>
        <div className={`ask-links${done ? ' is-ready' : ''}`}>
          {active.links.map((link) => {
            const external = link.href.startsWith('http');
            return <a key={link.label} href={link.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} onClick={() => link.event && trackEvent(link.event, { from: 'hero' })} tabIndex={done ? 0 : -1}>{link.label}{external && <FiArrowUpRight aria-hidden="true" />}</a>;
          })}
        </div>
      </div>
    </div>
  </div>;
}

const title = 'I build web products and the AI that runs inside them.'.split(' ');

export function Hero() {
  return <section id="top" className="hero">
    <div className="container hero-grid">
      <div className="hero-copy">
        <h1>
          <span className="hero-name"><span className="status-dot" aria-hidden="true" />Himanshu Yadav, full-stack &amp; AI developer.</span>{' '}
          <span className="hero-title">{title.map((word, i) => <Fragment key={i}><span className="word" style={{ '--i': i }}><span>{word}</span></span>{i < title.length - 1 ? ' ' : ''}</Fragment>)}</span>
        </h1>
        <p className="hero-lede">React, Next.js, Node.js and Python, with LLM workflows built in.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#work">See my work</a>
          <a className="btn btn-quiet" href={profile.resumeUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('Resume click', { from: 'hero' })}><FiFileText aria-hidden="true" />Résumé</a>
        </div>
      </div>
      <AskPanel />
      <div className="hero-glow" aria-hidden="true" />
    </div>
  </section>;
}
