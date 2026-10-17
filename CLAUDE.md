# Working rules for this repository

## Communication
- Answer in German, short and clear. Code, names and code comments in English.
- Explain decisions briefly (why this option), follow best practice and current standards.

## Source of truth
- **Figma is the source of truth** (file `vOTfMtcpCwAJjuSZUkfpfj`, med.o Design System). Code follows Figma, never the other way round.
- Token chain: Figma → `figma/variables.json` (scripts/figma-export.js) → `npm run tokens:from-figma` → `packages/tokens/src` (DTCG) → `npm run build:tokens` → `dist`.
- Never edit generated files by hand: `figma/variables.json`, `packages/tokens/src/**`, `**/dist/**`.

## Design system rules
- Always use the defined rules and reuse existing components. Build something new only when it is necessary and explain why.
- Prefer proven libraries over own implementations (e.g. headless UI libraries for behaviour and accessibility).
- Components: styles in plain CSS on top of the `--medo-*` tokens (framework-neutral), thin framework wrapper on top.
- Only semantic tokens in components. No hard-coded colors, spacing, radii or font sizes.
- Accessibility: WCAG 2.2 AA. Visible `:focus-visible`, forced-colors fallback, `prefers-reduced-motion`, axe clean in Storybook (Light and Dark).
- Every component: Storybook stories for variants, sizes, states, Light and Dark.

## Commands
- `npm install` · `npm run storybook` · `npm run build-storybook` · `npm run build:tokens` · `npm run tokens:from-figma`
