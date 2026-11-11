import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FiCheck, FiLoader } from 'react-icons/fi';
import { motionDuration, motionEase } from '../lib/animation.js';

const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
const maxMessageLength = 1200;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function recordEvent(name, props = {}) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(name, { props });
  }
}

export function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const errors = useMemo(() => ({
    name: values.name.trim() ? '' : 'Tell me your name.',
    email: emailPattern.test(values.email.trim()) ? '' : 'Add a valid email address.',
    message: values.message.trim() ? '' : 'Add a short message so I know how to help.',
  }), [values]);
  const isValid = !errors.name && !errors.email && !errors.message && !values.website;

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: name === 'message' ? value.slice(0, maxMessageLength) : value }));
    setTouched((current) => ({ ...current, [name]: true }));
    if (status.type !== 'idle') setStatus({ type: 'idle', message: '' });
  };

  const submit = async (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!isValid || status.type === 'loading') return;

    const now = Date.now();
    const lastSubmit = Number(window.localStorage.getItem('hky-last-contact-submit') || 0);
    if (now - lastSubmit < 60_000) {
      setStatus({ type: 'error', message: 'Please wait a minute before sending another message.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Sending your message…' });
    recordEvent('Contact form submit');
    const payload = { name: values.name.trim(), email: values.email.trim(), subject: values.subject.trim(), message: values.message.trim() };

    try {
      if (!endpoint) {
        const mailto = `mailto:iamhimanshu.in1@gmail.com?subject=${encodeURIComponent(payload.subject || `Message from ${payload.name}`)}&body=${encodeURIComponent(`${payload.message}\n\nReply to: ${payload.email}`)}`;
        window.localStorage.setItem('hky-last-contact-submit', String(now));
        window.location.href = mailto;
        setStatus({ type: 'success', message: "Thanks, I'll reply within 24 hours." });
        return;
      }

      const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Form submission failed');
      window.localStorage.setItem('hky-last-contact-submit', String(now));
      setStatus({ type: 'success', message: "Thanks, I'll reply within 24 hours." });
    } catch {
      setStatus({ type: 'error', message: 'I could not send that yet. Please try again or email me directly.' });
    }
  };

  if (status.type === 'success') {
    return <motion.div className="contact-success" role="status" aria-live="polite" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: motionDuration.standard, ease: motionEase }}><motion.span className="success-check" initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: motionDuration.short, ease: motionEase }}><FiCheck aria-hidden="true" /></motion.span><strong>{status.message}</strong><span>Your note is on its way.</span></motion.div>;
  }

  return <form className="contact-form" onSubmit={submit} noValidate>
    <label className="field"><input name="name" value={values.name} onChange={update} onBlur={() => setTouched((current) => ({ ...current, name: true }))} required autoComplete="name" placeholder=" " aria-invalid={Boolean(touched.name && errors.name)} aria-describedby={touched.name && errors.name ? 'name-error' : undefined} /><span>Name</span>{touched.name && errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label>
    <label className="field"><input name="email" value={values.email} onChange={update} onBlur={() => setTouched((current) => ({ ...current, email: true }))} required type="email" autoComplete="email" placeholder=" " aria-invalid={Boolean(touched.email && errors.email)} aria-describedby={touched.email && errors.email ? 'email-error' : undefined} /><span>Email</span>{touched.email && errors.email && <small id="email-error" className="field-error">{errors.email}</small>}</label>
    <label className="field"><input name="subject" value={values.subject} onChange={update} placeholder=" " /><span>Subject <em>(optional)</em></span></label>
    <label className="field"><textarea name="message" value={values.message} onChange={update} onBlur={() => setTouched((current) => ({ ...current, message: true }))} required rows="5" maxLength={maxMessageLength} placeholder=" " aria-invalid={Boolean(touched.message && errors.message)} aria-describedby={touched.message && errors.message ? 'message-error' : 'message-count'} /><span>Message</span><small id="message-count" className="character-count">{values.message.length}/{maxMessageLength}</small>{touched.message && errors.message && <small id="message-error" className="field-error">{errors.message}</small>}</label>
    <label className="honeypot">Website<input name="website" value={values.website} onChange={update} tabIndex="-1" autoComplete="off" /></label>
    <button className="button-base button-primary form-submit" type="submit" disabled={!isValid || status.type === 'loading'}>{status.type === 'loading' ? <><FiLoader className="button-spinner" aria-hidden="true" /> Sending…</> : <>Send enquiry <span className="button-arrow" aria-hidden="true">→</span></>}</button>
    {status.type === 'error' && <p className="form-status error" role="alert" aria-live="assertive">{status.message} <button type="button" className="retry-link" onClick={() => setStatus({ type: 'idle', message: '' })}>Try again</button></p>}
  </form>;
}
