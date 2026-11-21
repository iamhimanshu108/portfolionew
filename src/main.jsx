import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App.jsx';
import './index.css';

const container = document.getElementById('root');
const app = <StrictMode><App /></StrictMode>;

// In production the HTML is pre-rendered (see scripts/prerender.mjs), so hydrate it.
// In `npm run dev` the root is empty, so render from scratch.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
