// Bakes the rendered page into dist/index.html so search engines and link
// previews see real content without running JavaScript.
// Runs after: vite build && vite build --ssr src/entry-server.jsx --outDir dist-ssr
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const distDir = path.resolve(root, process.argv[2] ?? 'dist');
const ssrEntry = path.resolve(root, process.argv[3] ?? 'dist-ssr/entry-server.js');

const { render } = await import(pathToFileURL(ssrEntry).href);
const file = path.join(distDir, 'index.html');
const template = fs.readFileSync(file, 'utf8');
const placeholder = '<div id="root"></div>';
if (!template.includes(placeholder)) throw new Error(`Could not find ${placeholder} in ${file}`);

fs.writeFileSync(file, template.replace(placeholder, `<div id="root">${render()}</div>`));
if (!process.argv[3]) fs.rmSync(path.dirname(ssrEntry), { recursive: true, force: true });
console.log('Pre-rendered', path.relative(root, file));
