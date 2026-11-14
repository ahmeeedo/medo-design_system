// "use client" rules for packages/ui/src (React Server Components). The package ships one module per source file, so
// each file decides for itself whether it runs on the server.
//  1. A file that uses React Aria or React Stately, a hook, createContext or an event handler starts with 'use client'.
//  2. These files stay without it, so Stack, Grid, Container, Badge and Code render on the server. A change that makes
//     one of them need the client fails here: decide whether it is worth it, then update the list.
// Type-only imports and exports do not count. Stories and story helpers are not part of the package.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../packages/ui/src/', import.meta.url));
const SERVER = ['layout/Layout.tsx', 'badge/Badge.tsx', 'code-block/Code.tsx', 'utils/cx.ts', 'utils/highlight.tsx', 'index.ts'];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.tsx?$/.test(name) && !/\.stories\.|story-helpers|\.test\.|\.d\.ts$/.test(name)) files.push(path);
  }
};
walk(src);

const problems = [];
for (const path of files) {
  const file = relative(src, path).replaceAll('\\', '/');
  const text = readFileSync(path, 'utf8');
  const code = text.replace(/(import|export) type [^;]+;/g, '').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  const directive = /^'use client';/.test(text);
  const needs = [
    /from 'react-(aria|stately)/.test(code) && 'React Aria',
    /\buse[A-Z]\w*\(/.test(code) && 'a hook',
    /\bcreateContext\b/.test(code) && 'createContext',
    /\son[A-Z]\w*=\{/.test(code) && 'an event handler',
  ].filter(Boolean);
  if (SERVER.includes(file)) {
    if (directive) problems.push(`${file}: renders on the server – remove 'use client' (or take it off the list in this script)`);
    else if (needs.length) problems.push(`${file}: uses ${needs.join(', ')} but should render on the server`);
  } else if (needs.length && !directive) {
    problems.push(`${file}: uses ${needs.join(', ')} – start the file with 'use client';`);
  }
}

if (problems.length) {
  console.error(`${problems.join('\n')}\n\n× ${problems.length} "use client" problem${problems.length > 1 ? 's' : ''}`);
  process.exit(1);
}
console.log(`✓ "use client": ${files.length} files, ${SERVER.length} render on the server`);
