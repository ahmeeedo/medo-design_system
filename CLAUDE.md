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
- `src/styles/global.css` override order: all med.o token overrides must be placed **after** shadcn/ui's generated `@theme inline` block. shadcn's init overwrites `--color-primary`, `--radius-*`, and `--font-sans` — the med.o override block at the end of `global.css` restores these. Never insert med.o overrides before the shadcn block.

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
