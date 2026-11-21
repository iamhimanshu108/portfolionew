import { useMemo, useState } from 'react';
import { FiCheck, FiLoader } from 'react-icons/fi';
import { profile } from '../../data/profileData.js';
import { trackEvent } from '../lib/track.js';

const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
const maxMessageLength = 1200;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const empty = { name: '', email: '', message: '', website: '' };

function Field({ name, label, error, touched, children }) {
  const showError = touched && error;
  return <div className="field">
    <label htmlFor={`contact-${name}`}>{label}</label>
    {children({ id: `contact-${name}`, 'aria-invalid': Boolean(showError), 'aria-describedby': showError ? `contact-${name}-error` : undefined })}
    {showError && <p id={`contact-${name}-error`} className="field-error">{error}</p>}
  </div>;
}

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const errors = useMemo(() => ({
    name: values.name.trim() ? '' : 'Enter your name.',
    email: emailPattern.test(values.email.trim()) ? '' : 'Enter an email address like you@company.com.',
    message: values.message.trim() ? '' : 'Write a sentence or two about what you need.',
  }), [values]);
  const isValid = !errors.name && !errors.email && !errors.message;

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: name === 'message' ? value.slice(0, maxMessageLength) : value }));
    if (status.type === 'error') setStatus({ type: 'idle', message: '' });
  };
  const blur = (event) => setTouched((current) => ({ ...current, [event.target.name]: true }));

  const submit = async (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (values.website) return; // bot
    if (!isValid || status.type === 'loading') return;

    const now = Date.now();
    let last = 0;
    try { last = Number(localStorage.getItem('hky-last-contact-submit') || 0); } catch { /* ignore */ }
    if (now - last < 60_000) {
      setStatus({ type: 'error', message: 'You just sent a message. Wait a minute before sending another.' });
      return;
    }

    setStatus({ type: 'loading', message: '' });
    trackEvent('Contact form submit');
    const payload = { name: values.name.trim(), email: values.email.trim(), message: values.message.trim() };
    const remember = () => { try { localStorage.setItem('hky-last-contact-submit', String(now)); } catch { /* ignore */ } };

    try {
      if (!endpoint) {
        remember();
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Message from ${payload.name}`)}&body=${encodeURIComponent(`${payload.message}\n\nReply to: ${payload.email}`)}`;
        setStatus({ type: 'success', message: 'Your email app should open with the message ready to send.' });
        return;
      }
      const response = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Request failed');
      remember();
      setStatus({ type: 'success', message: 'Message sent. I usually reply within a day.' });
    } catch {
      setStatus({ type: 'error', message: `The message didn’t go through. Try again, or email ${profile.email} directly.` });
    }
  };

  if (status.type === 'success') {
    return <div className="form-done" role="status">
      <span className="form-done-icon"><FiCheck aria-hidden="true" /></span>
      <p><strong>Thanks, {values.name.trim().split(' ')[0]}.</strong> {status.message}</p>
      <button type="button" className="link-button" onClick={() => { setValues(empty); setTouched({}); setStatus({ type: 'idle', message: '' }); }}>Write another message</button>
    </div>;
  }

  return <form className="contact-form" onSubmit={submit} noValidate>
    <div className="field-row">
      <Field name="name" label="Name" error={errors.name} touched={touched.name}>
        {(props) => <input {...props} name="name" value={values.name} onChange={update} onBlur={blur} autoComplete="name" required />}
      </Field>
      <Field name="email" label="Email" error={errors.email} touched={touched.email}>
        {(props) => <input {...props} name="email" type="email" value={values.email} onChange={update} onBlur={blur} autoComplete="email" required />}
      </Field>
    </div>
    <Field name="message" label="What are you working on?" error={errors.message} touched={touched.message}>
      {(props) => <textarea {...props} name="message" rows="5" value={values.message} onChange={update} onBlur={blur} maxLength={maxMessageLength} required />}
    </Field>
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" value={values.website} onChange={update} tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-foot">
      <span className="char-count">{values.message.length}/{maxMessageLength}</span>
      <button className="btn btn-primary" type="submit" disabled={status.type === 'loading'}>
        {status.type === 'loading' ? <><FiLoader className="spin" aria-hidden="true" />Sending</> : 'Send message'}
      </button>
    </div>
    {status.type === 'error' && <p className="form-error" role="alert">{status.message}</p>}
  </form>;
}
