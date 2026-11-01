#!/usr/bin/env node
/**
 * Consumer test: installs the packed npm packages – exactly what npm would ship – into a fresh Vite app and a fresh
 * Next.js app (App Router) and builds both. Catches what tests inside the monorepo cannot: package exports, CSS
 * imports, "use client", types and server rendering in a real project.
 *
 * The app code is not kept here: it is taken from “Your first page” in apps/storybook/src/Introduction.mdx, so the
 * documented example is the tested one and the two can never drift apart.
 *
 * Run: npm run test:consumers (npm pack builds the packages). Needs network access for npm install.
 */
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const work = join(tmpdir(), 'medo-consumers');
const run = (cmd, cwd) => {
  console.log(`\n$ ${cmd}  (${cwd.replace(work, '<tmp>')})`);
  // NODE_PATH removed: globally installed packages must not hide a missing dependency, like in CI.
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, NODE_PATH: '', NEXT_TELEMETRY_DISABLED: '1' } });
};
const write = (dir, files) => {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n');
  }
};

/* ---------- the documented example ---------- */
const intro = readFileSync(join(root, 'apps/storybook/src/Introduction.mdx'), 'utf8');
const blocks = [...intro.matchAll(/```tsx\n(\/\/ (\S+)[^\n]*\n[\s\S]*?)```/g)].map(([, code, path]) => ({ path, code }));
const code = (path) => {
  const block = blocks.find((b) => b.path === path);
  if (!block) throw new Error(`Introduction.mdx: no code block that starts with "// ${path}"`);
  return block.code;
};

/* ---------- pack the packages ---------- */
rmSync(work, { recursive: true, force: true });
const packs = join(work, 'packs');
mkdirSync(packs, { recursive: true });
for (const pkg of ['packages/tokens', 'packages/ui']) run(`npm pack --pack-destination "${packs}"`, join(root, pkg));
const tarballs = readdirSync(packs).map((f) => `"${join(packs, f)}"`).join(' ');

const shared = {
  react: '^19.3.1',
  'react-dom': '^19.3.1',
  'react-aria-components': '^1.22.1',
  '@fontsource/dm-sans': '^5.3.0',
  '@fontsource/dm-mono': '^5.3.0',
};
// Same type packages as a new project of each tool; Next.js also needs @types/node.
const types = { typescript: '~5.9.3', '@types/react': '^19.0.0', '@types/react-dom': '^19.0.0' };

/* ---------- Vite ---------- */
const vite = join(work, 'vite');
write(vite, {
  'package.json': { name: 'medo-consumer-vite', private: true, type: 'module', dependencies: shared, devDependencies: { ...types, vite: '^8.0.0', '@vitejs/plugin-react': '^6.0.0' } },
  'index.html': '<!doctype html>\n<html lang="en">\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n',
  'vite.config.ts': "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n",
  'tsconfig.json': {
    compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: false, types: ['vite/client'] },
    include: ['src'],
  },
  'src/main.tsx': code('src/main.tsx'),
  'src/App.tsx': code('src/App.tsx'),
});
run(`npm install --no-audit --no-fund ${tarballs}`, vite);
run('npx tsc -p .', vite);
run('npx vite build', vite);

/* ---------- Next.js (App Router) ---------- */
const next = join(work, 'next');
write(next, {
  'package.json': { name: 'medo-consumer-next', private: true, dependencies: { ...shared, next: '^16.0.0' }, devDependencies: { ...types, '@types/node': '^24.0.0' } },
  'tsconfig.json': {
    compilerOptions: {
      target: 'ES2022',
      lib: ['dom', 'dom.iterable', 'esnext'],
      module: 'esnext',
      moduleResolution: 'bundler',
      jsx: 'react-jsx',
      strict: true,
      noEmit: true,
      // As create-next-app sets it: Next's own type files need newer DOM types. Our types are checked in the Vite app.
      skipLibCheck: true,
      isolatedModules: true,
      esModuleInterop: true,
      resolveJsonModule: true,
      allowJs: true,
      incremental: true,
      plugins: [{ name: 'next' }],
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
    exclude: ['node_modules'],
  },
  'app/providers.tsx': code('app/providers.tsx'),
  'app/layout.tsx': code('app/layout.tsx'),
  'app/page.tsx': code('app/page.tsx'),
});
run(`npm install --no-audit --no-fund ${tarballs}`, next);
// next build type-checks and renders the page on the server – a server-side error fails here.
run('npx next build', next);

console.log('\n✓ Consumer test: Vite and Next.js build with the packed packages.');
