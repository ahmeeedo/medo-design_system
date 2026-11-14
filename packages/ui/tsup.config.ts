import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig, type Options } from 'tsup';
import type { Plugin } from 'esbuild';

/**
 * One JS module per source file (dist/button/Button.js …), not one bundle: a bundler then keeps only what an app
 * imports, and "use client" stays on the modules that need it. Modules without it (Layout, Badge, Code, cx, the
 * messages) render in React Server Components. Types stay one file: dist/index.d.ts.
 * Every file is its own entry; this plugin keeps relative imports as imports, with the .js extension that Node's ESM
 * and strict bundlers (webpack's fullySpecified) need.
 */
const keepRelativeImports: Plugin = {
  name: 'keep-relative-imports',
  setup(build) {
    build.onResolve({ filter: /^\.{1,2}\// }, (args) => {
      if (args.kind === 'entry-point') return undefined;
      const target = resolve(args.resolveDir, args.path);
      const file = ['.ts', '.tsx'].some((ext) => existsSync(target + ext)) ? `${args.path}.js` : `${args.path}/index.js`;
      return { path: file, external: true };
    });
  },
};

const shared: Options = { format: ['esm'], target: 'es2022', sourcemap: true };

export default defineConfig([
  {
    ...shared,
    entry: ['src/**/*.{ts,tsx}', '!src/**/*.stories.tsx', '!src/**/*.test.{ts,tsx}', '!src/story-helpers.tsx', '!src/code-block/highlight.ts'],
    outDir: 'dist',
    bundle: true,
    esbuildPlugins: [keepRelativeImports],
    dts: { entry: { index: 'src/index.ts' } },
    clean: ['!highlight.*'],
  },
  {
    ...shared,
    entry: { highlight: 'src/code-block/highlight.ts' },
    dts: true,
    clean: false,
    external: ['shiki'],
  },
]);
