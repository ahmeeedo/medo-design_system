/**
 * dist/styles.css: all component styles in one minified file (export "@med-o/ui/styles.min.css").
 * For pages without a bundler (CDN, plain HTML): one request instead of one per component.
 * With a bundler use "@med-o/ui/styles.css" – the bundler inlines and minifies it anyway.
 * Cascade layers stay as in src/styles.css; modern syntax is kept (no targets = no down-levelling).
 */
import { bundle } from 'lightningcss';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('./src/styles.css', import.meta.url));
const out = fileURLToPath(new URL('./dist/styles.css', import.meta.url));

const { code, warnings } = bundle({ filename: src, minify: true });
for (const w of warnings) console.warn(`${w.loc.filename}:${w.loc.line} ${w.message}`);

mkdirSync(fileURLToPath(new URL('./dist/', import.meta.url)), { recursive: true });
writeFileSync(out, code);
console.log(`dist/styles.css ${(code.length / 1024).toFixed(1)} KB`);
