APM_RULES {

## Communication

- Respond in German. Write all code, variable names, function names, and inline code comments in English.
- Keep responses short and precise.
- After completing work, document what was done and what the next steps are.
- No unnecessary code comments — only add a comment when the *why* is non-obvious.

## Context Management

- When context exceeds 50%, suggest starting a new conversation or using subagents for independent tasks.
- Proactively recommend context-saving strategies: use file reads instead of pasting, suggest /compact when context is heavy, recommend subagents for research tasks.

## Code Quality

- Write sustainable, maintainable code. Prefer clarity and reusability over cleverness.
- No half-finished implementations. Every delivered piece of code must be functional.
- Do not add error handling, fallbacks, or validation for scenarios that cannot happen. Only validate at system boundaries (user input, external APIs).

## Styling

- All styling uses Tailwind CSS utility classes. Do not create new CSS Module files (`.module.css`).
- Tailwind classes must reference design tokens from `src/styles/tokens.css` via the configured `tailwind.config.js` mappings. Never hardcode color, spacing, radius, or shadow values directly in JSX or CSS.
- When a required design token does not exist in `src/styles/tokens.css`: stop, document the missing token, and report it to the Manager for User clarification. Do not invent token values.
- `src/styles/global.css` structure: ONE `@theme inline` block (no duplicates), ONE `:root` block. `--font-sans` must be set to a string literal in `@theme inline` — never `var(--font-sans)` (circular). `--radius` must be a concrete pixel value (e.g. `8px`) — never `var(--radius-lg)` (circular). Do not add `@source` directives — `@tailwindcss/vite` scans all project files automatically in both dev and build modes.
- Do not add `@import "shadcn/tailwind.css"` — its `@custom-variant` and `@utility` content is already inlined in `global.css`. Running `npx shadcn@latest add` only installs component primitives; it must not overwrite or add duplicate blocks to `global.css`.
- After every `npx shadcn@latest add <name>`, immediately inspect all generated files in `src/components/ui/` for lucide-react imports. Replace every lucide-react icon import with the `Icon` component from `src/components/Icon/Icon.jsx` using the equivalent Material Symbols name. Never leave lucide-react imports in the codebase.

## DemoPanel

- Every component docs page must include `<DemoPanel>` as the **first JSX element inside the Overview tab content**, before any `<Section>` elements. This applies when creating new component pages and when retrofitting existing ones.
- Import: `import { DemoPanel } from '../docs/PageLayout'` (DemoPanel is re-exported from PageLayout alongside Section, GridWrapper, Content).
- DemoPanel is for component docs pages only. Info pages (WhatIsMedoPage, ReleasesPage, ImpressumPage, DatenschutzPage) do not use DemoPanel.
- Configure via two props: `component` (function receiving current control values, returns ReactNode), `controls` (array of dropdown/toggle definitions). See `src/docs/DemoPanel.jsx` for the full API.

## Internationalization

- Every user-facing string in JSX must be wrapped in `t()` from `react-i18next`. Never hardcode German (or any language) text directly in JSX without the `t()` wrapper.
- Every new translation key must be added to both `src/i18n/locales/de.json` (German, default) and `src/i18n/locales/en.json` (English).

## Build Validation

- Run `npm run build` before committing. Fix all build errors before proceeding.
- Run `npm run dev` and perform a visual browser check after any component or page change.

## Version Control

- Create a feature branch before starting any Task: `type/short-description` (e.g., `feat/tailwind-setup`, `docs/buttons-page`).
- Commit convention: `type: short description`. Types: `feat`, `fix`, `refactor`, `docs`, `chore`.
- Never commit directly to `main`. Merge feature branch into `main`, then push: `git push origin main` without confirmation when build is clean and merge is successful.
- Commit author is the project owner (ahmeeedo). Do not include AI tool references in commit messages, code comments, or documentation.

} //APM_RULES
