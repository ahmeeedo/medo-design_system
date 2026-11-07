// Token rules for what Stylelint cannot see: TSX, TS and MDX (inline styles, docs pages, Storybook UI).
//  1. Every var(--medo-…) exists – a token or a custom property defined in the code. A typo would fall back silently.
//  2. No px or rem values, and no plain numbers in style objects (React adds px) – use tokens.
//     Media queries are fine (they cannot read CSS variables).
//  3. No fixed colors – use var(--medo-color-…). Image content (SVG markup, data: URIs) is fine.
// Exceptions need a reason: `lint-tokens-ignore: <why>` on the line or alone on the line above,
// or `lint-tokens-disable: <why>` … `lint-tokens-enable` around a block.
// Run after `npm run build:tokens` – the token CSS comes from packages/tokens/dist.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dirs = ['packages/ui/src', 'apps/storybook/src', 'apps/storybook/.storybook', 'packages/tokens/dist/css'];
const skip = /node_modules|storybook-static|__screenshots__|\.test\.|\.spec\./;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (skip.test(path)) continue;
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(css|tsx?|mdx)$/.test(name)) files.push(path);
  }
};
for (const dir of dirs) walk(join(root, dir));

const read = (path) => readFileSync(path, 'utf8');

// Defined custom properties: `--medo-x:` in CSS, `'--medo-x':` keys in style objects.
const defined = new Set();
for (const path of files) {
  const text = read(path);
  for (const [, name] of text.matchAll(/['"]?(--medo-[a-z0-9-]+)['"]?\s*:/g)) defined.add(name);
  // Set in a loop (`--medo-ui-${key}`): the keys are the object keys of that file.
  for (const [, prefix] of text.matchAll(/setProperty\(`(--medo-[a-z0-9-]+-)\$\{/g)) {
    for (const [, key] of text.matchAll(/^\s*'?([a-z0-9-]+)'?\s*:/gm)) defined.add(prefix + key);
  }
}

const quoted = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g;
const px = /(?<![\w.-])(?!0(?:px|rem)\b)\d*\.?\d+(px|rem)\b/;
const mediaQuery = /\((?:min-|max-)?(?:width|height)\s*:/;
const image = /<svg|<body|data:/;
// React adds px to plain numbers: `width: 320` is 320 px. Sizes of the sample images are not UI.
const numeric = /\b(?:(?:min|max)?(?:Width|Height|InlineSize|BlockSize)|width|height|inlineSize|blockSize|padding\w*|margin\w*|gap|rowGap|columnGap|top|right|bottom|left|inset\w*|fontSize|borderRadius|border\w*Width|outlineOffset|outlineWidth|flexBasis)\s*:\s*-?\d*\.?[1-9]\d*\b(?!\s*[%a-z'"`])/;
const sample = /sample(?:Photo|Screenshot)\(/;
const color = /['"`]#[0-9a-fA-F]{3,8}['"`]|[(,:]\s*#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/;

const problems = [];
for (const path of files) {
  const file = relative(root, path);
  const script = !path.endsWith('.css');
  let disabled = false;
  let fence = false;
  let ignoreNext = false;
  read(path)
    .split('\n')
    .forEach((line, i) => {
      const at = `${file}:${i + 1}`;
      if (/lint-tokens-disable:/.test(line)) disabled = true;
      if (/lint-tokens-enable/.test(line)) disabled = false;
      if (path.endsWith('.mdx') && /^\s*```/.test(line)) fence = !fence;
      const ignored = ignoreNext || /lint-tokens-ignore:/.test(line);
      ignoreNext = /^\s*(\/\/|\/\*|\{\/\*).*lint-tokens-ignore:/.test(line);
      if (disabled || fence || ignored) return;

      for (const [, name] of line.matchAll(/var\((--medo-[a-z0-9-]+)(?![a-z0-9-]|\$\{)/g)) {
        if (!defined.has(name)) problems.push(`${at}  Unknown token ${name}.`);
      }
      if (!script) return; // CSS: Stylelint checks units and colors.

      const bare = line.replace(quoted, "''");
      if (numeric.test(bare) && !sample.test(line)) problems.push(`${at}  Fixed size ${bare.match(numeric)[0]}: React adds px – use a token.`);
      for (const [str] of line.matchAll(quoted)) {
        if (image.test(str)) continue;
        if (px.test(str) && !mediaQuery.test(str)) problems.push(`${at}  Fixed size ${str.match(px)[0]}: use a token – var(--medo-space-…), var(--medo-size-…) …`);
        if (color.test(str)) problems.push(`${at}  Fixed color: use var(--medo-color-…).`);
      }
    });
}

if (problems.length) {
  console.error(`${problems.join('\n')}\n\n× ${problems.length} token problem${problems.length > 1 ? 's' : ''}`);
  process.exit(1);
}
console.log(`✓ Tokens: ${files.length} files, ${defined.size} custom properties`);
