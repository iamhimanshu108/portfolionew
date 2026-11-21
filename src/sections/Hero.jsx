import { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiFileText } from 'react-icons/fi';
import { profile } from '../../data/profileData.js';
import { trackEvent } from '../lib/track.js';

const photo = new URL('../../data/My.png', import.meta.url).href;

const answers = [
  {
    id: 'hiring',
    label: 'I’m hiring',
    text: 'I’m a full-stack developer working in production at BizSkill since May 2025, across React, Next.js, Node.js and Python. Lately most of my time goes into AI features: resume scoring, retrieval over documents, and agent workflows that call real APIs. I’m open to full-time roles.',
    links: [
      { label: 'Read my résumé', href: profile.resumeUrl, event: 'Resume click' },
      { label: 'LinkedIn', href: profile.linkedinUrl },
    ],
  },
  {
    id: 'project',
    label: 'I have a project',
    text: 'Tell me what’s slow, manual or missing today. I’ll map the workflow with you, agree on a first version you can actually use, and build it with whatever fits: a web app, an API, an automation, or an AI assistant that works on your own data.',
    links: [
      { label: 'Email me', href: `mailto:${profile.email}`, event: 'Contact' },
      { label: 'See past work', href: '#work' },
    ],
  },
  {
    id: 'developer',
    label: 'I’m a developer',
    text: 'Hey! Most of what I build lives on GitHub: Next.js apps, FastAPI services, and automation experiments. Always happy to trade notes on RAG pipelines, agent tooling, or a tidy Docker setup.',
    links: [
      { label: 'GitHub', href: profile.githubUrl },
      { label: 'X / Twitter', href: profile.xUrl },
    ],
  },
];

function useStream(text, enabled) {
  const [count, setCount] = useState(enabled ? 0 : text.length);
  useEffect(() => {
    if (!enabled) { setCount(text.length); return undefined; }
    setCount(0);
    let index = 0;
    const id = window.setInterval(() => {
      // advance roughly one "token" (2–5 chars) at a time, like a model reply
      index = Math.min(text.length, index + 2 + Math.floor(Math.random() * 4));
      setCount(index);
      if (index >= text.length) window.clearInterval(id);
    }, 26);
    return () => window.clearInterval(id);
  }, [text, enabled]);
  return { shown: text.slice(0, count), done: count >= text.length };
}

function AskPanel() {
  const [active, setActive] = useState(answers[0]);
  const reduceMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches).current;
  const { shown, done } = useStream(active.text, !reduceMotion);

  const choose = (answer) => {
    setActive(answer);
    trackEvent('Hero intent', { intent: answer.id });
  };

  return <div className="ask">
    <p className="ask-question" id="ask-question">What brings you here?</p>
    <div className="ask-options" role="radiogroup" aria-labelledby="ask-question">
      {answers.map((answer) => <button key={answer.id} type="button" role="radio" aria-checked={active.id === answer.id} className="ask-option" onClick={() => choose(answer)}>{answer.label}</button>)}
    </div>
    <div className="ask-reply" aria-live="polite" aria-busy={!done}>
      <img className="ask-avatar" src={photo} alt="" width="36" height="36" />
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

export function Hero() {
  return <section id="top" className="hero">
    <div className="container hero-grid">
      <div className="hero-copy">
        <p className="hero-name"><span className="status-dot" aria-hidden="true" />Himanshu Yadav, full-stack &amp; AI developer in {profile.location.split(',')[0]}</p>
        <h1>I build web products and the AI that runs inside them.</h1>
        <p className="hero-lede">React and Next.js on the front, Node.js and Python behind it, and LLM workflows wherever they save someone real time.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#work">See my work</a>
          <a className="btn btn-quiet" href={profile.resumeUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('Resume click', { from: 'hero' })}><FiFileText aria-hidden="true" />Résumé</a>
        </div>
      </div>
      <AskPanel />
    </div>
  </section>;
}
