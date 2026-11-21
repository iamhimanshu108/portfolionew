import { FiArrowUpRight, FiCheck, FiCopy } from 'react-icons/fi';
import { profile } from '../../data/profileData.js';
import { ContactForm } from '../components/ContactForm.jsx';
import { useCopy } from '../lib/useCopy.js';
import { trackEvent } from '../lib/track.js';

const links = [
  ['GitHub', profile.githubUrl],
  ['LinkedIn', profile.linkedinUrl],
  ['X / Twitter', profile.xUrl],
  ['Résumé', profile.resumeUrl],
];

export function Contact() {
  const { copied, copy } = useCopy();
  return <section id="contact" className="section section-contact">
    <div className="container contact-grid">
      <div className="contact-copy" data-reveal>
        <h2>Have something to build?</h2>
        <p>Send a few lines. I reply within a day.</p>
        <div className="email-line">
          <a href={`mailto:${profile.email}`} onClick={() => trackEvent('Contact', { destination: 'email' })}>{profile.email}</a>
          <button type="button" className="icon-button" onClick={() => copy(profile.email)} aria-label={copied ? 'Email copied' : 'Copy email address'}>
            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
          </button>
          <span className="sr-only" aria-live="polite">{copied ? 'Email copied' : ''}</span>
        </div>
        <ul className="social-list">
          {links.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noreferrer">{label}<FiArrowUpRight aria-hidden="true" /></a></li>)}
        </ul>
      </div>
      <div data-reveal><ContactForm /></div>
    </div>
  </section>;
}
