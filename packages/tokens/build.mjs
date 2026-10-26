/**
 * Builds the design tokens with Style Dictionary.
 *
 * Input:  src/**.json (DTCG format, generated from Figma)
 * Output: dist/css/tokens.css        CSS custom properties (light, dark, layout breakpoints)
 *         dist/css/typography.css    Text style classes (.medo-text-body-md …)
 *         dist/tailwind/theme.css    Tailwind v4 theme that maps to the CSS variables
 *         dist/js/tokens.js (+ .d.ts) Resolved values for JavaScript (charts, canvas …)
 *         dist/docs/*.json           Flat token lists for the Storybook documentation
 */
import StyleDictionary from 'style-dictionary';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const PREFIX = 'medo';
const BASE = [
  'src/color/primitive.json',
  'src/color/alias.json',
  'src/dimension.json',
  'src/typography.json',
  'src/motion.json',
  'src/layer.json',
  'src/opacity.json',
  'src/effect.json',
];

// Breakpoints for the responsive "Layout" tokens (Figma modes Mobile / Tablet / Desktop).
const dims = JSON.parse(readFileSync('src/dimension.json', 'utf8'));
const BP_TABLET = dims.breakpoint.sm.$value.value; // 640
const BP_DESKTOP = dims.breakpoint.lg.$value.value; // 1024

/* ------------------------------------------------------------------ */
/* Transforms                                                          */
/* ------------------------------------------------------------------ */

// Font sizes, line heights, spacing and component sizes in rem, so they
// follow the user's browser font size (accessibility). Radii, borders,
// breakpoints and shadows stay in px.
const REM_GROUPS = [['space'], ['size'], ['font', 'size'], ['font', 'line-height'], ['layout']];
StyleDictionary.registerTransform({
  name: 'medo/dimension/rem',
  type: 'value',
  filter: (t) =>
    (t.$type ?? t.type) === 'dimension' &&
    REM_GROUPS.some((g) => g.every((k, i) => t.path[i] === k)) &&
    typeof (t.$value ?? t.value) === 'object' &&
    (t.$value ?? t.value).unit === 'px',
  transform: (t) => {
    const { value } = t.$value ?? t.value;
    return value === 0 ? '0' : `${+(value / 16).toFixed(4)}rem`;
  },
});

// Typography with a font size that has no own token (11px, avatar sizes): rem as well.
StyleDictionary.registerTransform({
  name: 'medo/typography/rem',
  type: 'value',
  transitive: true,
  filter: (t) => (t.$type ?? t.type) === 'typography',
  transform: (t) => {
    const v = t.$value ?? t.value;
    const fs = v.fontSize;
    if (fs && typeof fs === 'object' && fs.unit === 'px') return { ...v, fontSize: `${+(fs.value / 16).toFixed(4)}rem` };
    return v;
  },
});

const TRANSFORMS = ['medo/dimension/rem', 'medo/typography/rem', ...StyleDictionary.hooks.transformGroups.css];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const cssVar = (path) => `--${PREFIX}-${path.join('-')}`;
/** "{font.size.base}" → "var(--medo-font-size-base)" */
const refToVar = (v) =>
  typeof v === 'string' ? v.replace(/\{([^}]+)\}/g, (_, p) => `var(${cssVar(p.split('.'))})`) : v;
const dimToCss = (v) => (v && typeof v === 'object' && 'unit' in v ? `${v.value}${v.unit}` : v);
/** Font sizes without their own token (e.g. 11px, avatar sizes) also go to rem, like the font/size tokens. */
const fontSizeToCss = (v) =>
  v && typeof v === 'object' && v.unit === 'px' ? `${+(v.value / 16).toFixed(4)}rem` : dimToCss(v);
const value = (t) => t.$value ?? t.value;
const original = (t) => t.original.$value ?? t.original.value;
const figmaName = (t) => t.path.slice(t.path[0] === 'color' ? 1 : 0).join('/');

/* ------------------------------------------------------------------ */
/* Formats                                                             */
/* ------------------------------------------------------------------ */

// Only the declarations, the selectors are added when the files are assembled.
StyleDictionary.registerFormat({
  name: 'medo/css/declarations',
  format: ({ dictionary }) =>
    dictionary.allTokens
      .map((t) => {
        const o = original(t);
        const type = t.$type ?? t.type;
        let v;
        if (type === 'shadow') {
          // Keep color references so shadows follow the theme.
          v = (Array.isArray(o) ? o : [o])
            .map((s) =>
              [s.inset ? 'inset' : null, dimToCss(s.offsetX), dimToCss(s.offsetY), dimToCss(s.blur), dimToCss(s.spread), refToVar(s.color)]
                .filter(Boolean)
                .join(' '),
            )
            .join(', ');
        } else if (type === 'typography') {
          v = `${refToVar(o.fontWeight)} ${refToVar(fontSizeToCss(o.fontSize))}/${o.lineHeight} ${refToVar(o.fontFamily)}`;
        } else if (typeof o === 'string' && /\{[^}]+\}/.test(o)) {
          v = refToVar(o);
        } else {
          v = value(t);
        }
        return `  ${cssVar(t.path)}: ${v};`;
      })
      .join('\n'),
});

StyleDictionary.registerFormat({
  name: 'medo/css/typography',
  format: ({ dictionary }) => {
    const rules = dictionary.allTokens
      .filter((t) => (t.$type ?? t.type) === 'typography')
      .map((t) => {
        const o = original(t);
        const transform = t.$extensions?.['com.medo']?.textTransform;
        const name = t.path.slice(1).join('-');
        return [
          `/* ${t.path.slice(1).join('/')} */`,
          `.${PREFIX}-text-${name} {`,
          `  font-family: ${refToVar(o.fontFamily)};`,
          `  font-size: ${refToVar(fontSizeToCss(o.fontSize))};`,
          `  font-weight: ${refToVar(o.fontWeight)};`,
          `  line-height: ${o.lineHeight};`,
          `  letter-spacing: ${refToVar(dimToCss(o.letterSpacing))};`,
          transform ? `  text-transform: ${transform};` : null,
          '}',
        ]
          .filter(Boolean)
          .join('\n');
      });
    return `/**\n * med.o Design System – text styles\n * Generated from Figma. Do not edit.\n */\n\n${rules.join('\n\n')}\n`;
  },
});

StyleDictionary.registerFormat({
  name: 'medo/tailwind/theme',
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens;
    const by = (fn) => tokens.filter(fn);
    const line = (name, v) => `  --${name}: ${v};`;
    const out = [];

    out.push('  /* Colors: semantic tokens only, so the UI never bypasses the system. */');
    out.push(line('color-*', 'initial'));
    out.push(line('color-transparent', 'transparent'));
    out.push(line('color-current', 'currentColor'));
    for (const t of by((t) => t.path[0] === 'color' && t.filePath.includes('light.json')))
      out.push(line(`color-${t.path.slice(1).join('-')}`, `var(${cssVar(t.path)})`));

    out.push('', '  /* Spacing: 1 step = space/1 (4px). p-4 = space/4 = 16px, p-0.5 = space/0-5. */');
    out.push(line('spacing', `var(${cssVar(['space', '1'])})`));

    out.push('', '  /* Radius */', line('radius-*', 'initial'));
    for (const t of by((t) => t.path[0] === 'radius')) out.push(line(`radius-${t.path[1]}`, `var(${cssVar(t.path)})`));

    out.push('', '  /* Shadows (elevation and focus ring) */', line('shadow-*', 'initial'), line('inset-shadow-*', 'initial'));
    for (const t of by((t) => t.path[0] === 'shadow')) out.push(line(`shadow-${t.path.slice(1).join('-')}`, `var(${cssVar(t.path)})`));

    out.push('', '  /* Blur */', line('blur-*', 'initial'));
    for (const t of by((t) => t.path[0] === 'blur')) out.push(line(`blur-${t.path[1]}`, `var(${cssVar(t.path)})`));

    out.push('', '  /* Fonts */', line('font-*', 'initial'));
    for (const t of by((t) => t.path[0] === 'font' && t.path[1] === 'family')) out.push(line(`font-${t.path[2]}`, `var(${cssVar(t.path)})`));
    out.push(line('font-weight-*', 'initial'));
    for (const t of by((t) => t.path[0] === 'font' && t.path[1] === 'weight')) out.push(line(`font-weight-${t.path[2]}`, `var(${cssVar(t.path)})`));
    out.push(line('tracking-*', 'initial'));
    for (const t of by((t) => t.path[0] === 'font' && t.path[1] === 'tracking')) out.push(line(`tracking-${t.path[2]}`, `var(${cssVar(t.path)})`));

    out.push('', '  /* Text styles: text-body-md sets size, line height, weight and tracking. */', line('text-*', 'initial'));
    for (const t of by((t) => (t.$type ?? t.type) === 'typography')) {
      const o = original(t);
      const n = `text-${t.path.slice(1).join('-')}`;
      out.push(line(n, refToVar(fontSizeToCss(o.fontSize))));
      out.push(line(`${n}--line-height`, o.lineHeight));
      out.push(line(`${n}--font-weight`, refToVar(o.fontWeight)));
      out.push(line(`${n}--letter-spacing`, refToVar(dimToCss(o.letterSpacing))));
    }

    out.push('', '  /* Easing */', line('ease-*', 'initial'));
    for (const t of by((t) => t.path[0] === 'motion' && t.path[1] === 'easing')) out.push(line(`ease-${t.path[2]}`, `var(${cssVar(t.path)})`));
    // Springs as easings (ease-spring-smooth) – pair them with their settle time (duration-spring-smooth).
    for (const t of by((t) => t.path[0] === 'motion' && t.path[1] === 'spring' && !t.path[2].endsWith('-duration'))) out.push(line(`ease-spring-${t.path[2]}`, `var(${cssVar(t.path)})`));

    out.push('', '  /* Max widths (max-w-prose, max-w-xl …) */', line('container-*', 'initial'));
    for (const t of by((t) => t.path[0] === 'container')) out.push(line(`container-${t.path[1]}`, `var(${cssVar(t.path)})`));

    // Breakpoints must be literal values (media queries cannot read CSS variables).
    const bps = by((t) => t.path[0] === 'breakpoint').map((t) => line(`breakpoint-${t.path[1]}`, `${value(t)}`));

    return `/**
 * med.o Design System – Tailwind CSS v4 theme
 * Generated from Figma. Do not edit.
 *
 * Usage (in your main CSS file):
 *   @import "tailwindcss";
 *   @import "@medo/design-tokens/css";
 *   @import "@medo/design-tokens/tailwind";
 *
 * "inline" makes every utility point to the --${PREFIX}-* variables, so light and dark
 * switch automatically. You rarely need the dark: variant.
 */

@theme inline {
${out.join('\n')}
}

@theme {
  --breakpoint-*: initial;
${bps.join('\n')}
}

/* dark: follows the same rules as the tokens (data-theme first, then the system setting). */
@custom-variant dark {
  &:where([data-theme="dark"], [data-theme="dark"] *) {
    @slot;
  }
  @media (prefers-color-scheme: dark) {
    &:where(:root:not([data-theme="light"]) *, :root:not([data-theme="light"])):not(:where([data-theme="light"], [data-theme="light"] *)) {
      @slot;
    }
  }
}
`;
  },
});

StyleDictionary.registerFormat({
  name: 'medo/json/docs',
  format: ({ dictionary }) =>
    JSON.stringify(
      dictionary.allTokens.map((t) => {
        const o = original(t);
        return {
          name: figmaName(t),
          path: t.path,
          type: t.$type ?? t.type,
          cssVar: cssVar(t.path),
          value: typeof value(t) === 'object' ? JSON.stringify(value(t)) : value(t),
          ...(typeof o === 'string' && o.startsWith('{') ? { ref: o.slice(1, -1).split('.').slice(1).join('/') } : {}),
          ...(t.$description ? { description: t.$description } : {}),
        };
      }),
      null,
      2,
    ),
});

StyleDictionary.registerFormat({
  name: 'medo/js/module',
  format: ({ dictionary, options }) => {
    const obj = Object.fromEntries(
      dictionary.allTokens.map((t) => [t.path.join('-'), typeof value(t) === 'object' ? value(t) : value(t)]),
    );
    return `// Generated from Figma. Do not edit.\nexport const ${options.exportName} = ${JSON.stringify(obj, null, 2)};\n`;
  },
});

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */

const tmp = 'dist/.tmp';
rmSync('dist', { recursive: true, force: true });

const build = async ({ include = [], source, files, filter }) => {
  const sd = new StyleDictionary({
    include,
    source,
    log: { verbosity: 'silent', warnings: 'disabled' },
    platforms: {
      main: {
        transforms: TRANSFORMS,
        buildPath: 'dist/',
        files: files.map((f) => ({ ...f, ...(filter ? { filter } : {}) })),
      },
    },
  });
  await sd.buildAllPlatforms();
};
const onlySource = (t) => t.isSource;

// 1. Light (+ everything that has no mode) and mobile layout
await build({
  source: [...BASE, 'src/color/light.json', 'src/layout/mobile.json'],
  files: [
    { destination: '.tmp/light.css', format: 'medo/css/declarations' },
    { destination: 'css/typography.css', format: 'medo/css/typography' },
    { destination: 'tailwind/theme.css', format: 'medo/tailwind/theme' },
    { destination: 'docs/tokens.light.json', format: 'medo/json/docs' },
    { destination: 'js/tokens.js', format: 'medo/js/module', options: { exportName: 'tokens' } },
  ],
});
// 2. Light semantic colors only (for [data-theme="light"] islands inside dark areas)
await build({ include: BASE, source: ['src/color/light.json'], filter: onlySource, files: [{ destination: '.tmp/light-colors.css', format: 'medo/css/declarations' }] });
// 3. Dark semantic colors
await build({
  include: BASE,
  source: ['src/color/dark.json'],
  filter: onlySource,
  files: [
    { destination: '.tmp/dark.css', format: 'medo/css/declarations' },
    { destination: 'docs/tokens.dark.json', format: 'medo/json/docs' },
    { destination: 'js/tokens.dark.js', format: 'medo/js/module', options: { exportName: 'darkColors' } },
  ],
});
// 4. Layout tokens for tablet and desktop
for (const mode of ['tablet', 'desktop']) {
  await build({ include: [...BASE, 'src/color/light.json'], source: [`src/layout/${mode}.json`], filter: onlySource, files: [{ destination: `.tmp/${mode}.css`, format: 'medo/css/declarations' }] });
}

const read = (f) => readFileSync(`${tmp}/${f}.css`, 'utf8');
// Shadows reference theme colors. Custom properties resolve where they are declared,
// so they are declared again in every theme block (needed for data-theme on any element).
const themed = read('light')
  .split('\n')
  .filter((l) => l.startsWith(`  --${PREFIX}-shadow-`))
  .join('\n');
const darkBlock = `${read('dark')}\n${themed}`;
const lightBlock = `${read('light-colors')}\n${themed}`;
const css = `/**
 * med.o Design System – design tokens
 * Generated from Figma. Do not edit: change Figma, then run the token build.
 *
 * Theme: follows the system setting. Force a theme with data-theme="light" | "dark"
 * on <html> or on any element (the theme then applies to that subtree).
 */

:root {
  color-scheme: light;
${read('light')}
}

[data-theme="light"] {
  color-scheme: light;
${lightBlock}
}

[data-theme="dark"] {
  color-scheme: dark;
${darkBlock}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${darkBlock.replaceAll('\n  ', '\n    ').replace(/^  /, '    ')}
  }
}

/* Layout: Figma modes Mobile (default), Tablet (≥ ${BP_TABLET}px), Desktop (≥ ${BP_DESKTOP}px) */
@media (min-width: ${BP_TABLET}px) {
  :root {
${read('tablet').replaceAll('\n  ', '\n    ').replace(/^  /, '    ')}
  }
}

@media (min-width: ${BP_DESKTOP}px) {
  :root {
${read('desktop').replaceAll('\n  ', '\n    ').replace(/^  /, '    ')}
  }
}
`;
mkdirSync('dist/css', { recursive: true });
writeFileSync('dist/css/tokens.css', css);

// Combine the JS modules and add type declarations.
const darkJs = readFileSync('dist/js/tokens.dark.js', 'utf8').replace('// Generated from Figma. Do not edit.\n', '');
writeFileSync('dist/js/tokens.js', readFileSync('dist/js/tokens.js', 'utf8') + '\n' + darkJs);
rmSync('dist/js/tokens.dark.js');
writeFileSync(
  'dist/js/tokens.d.ts',
  `// Generated from Figma. Do not edit.
/** Resolved token values (Light theme and all mode-independent tokens), keyed like the CSS variables without "--${PREFIX}-". */
export declare const tokens: Record<string, string | number | number[]>;
/** Resolved semantic colors of the Dark theme. */
export declare const darkColors: Record<string, string>;
`,
);
rmSync(tmp, { recursive: true, force: true });

console.log('✓ Tokens built: dist/css, dist/tailwind, dist/js, dist/docs');
