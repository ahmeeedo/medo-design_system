# med.o Design System – Code

Design tokens, CSS, Tailwind v4 theme, React components and Storybook for the **med.o Design System**.
Figma is the source of truth: [med.o Design System in Figma](https://www.figma.com/design/vOTfMtcpCwAJjuSZUkfpfj).

---

## Schnellstart (Deutsch)

1. **Node.js 24 LTS** installieren (22 geht auch): <https://nodejs.org> (Installer „LTS“).
2. Diesen Ordner in einem Terminal öffnen (Windows: Ordner öffnen → Adresszeile → `cmd` eingeben → Enter).
3. Einmalig die Pakete laden:
   ```
   npm install
   ```
4. Storybook starten:
   ```
   npm run storybook
   ```
   Der Browser öffnet <http://localhost:6006>. Oben in der Leiste kannst du zwischen Light und Dark umschalten.

Weitere Befehle:

| Befehl | Was passiert |
| --- | --- |
| `npm run tokens:from-figma` | Wandelt den Figma-Export (`figma/variables.json`) in DTCG-Token-Dateien um |
| `npm run build:tokens` | Erzeugt CSS-Variablen, Tailwind-Theme, JS und Doku-Daten |
| `npm run build-storybook` | Baut Storybook als statische Website (Ordner `apps/storybook/storybook-static`) |

---

## Structure

```
figma/variables.json          Raw export from Figma (variables, text styles, effect styles)
scripts/figma-export.js       Runs inside Figma and produces figma/variables.json
scripts/figma-to-dtcg.mjs     Converts the export to DTCG token files
packages/tokens               @medo/design-tokens
  src/                        DTCG tokens (generated, do not edit)
  build.mjs                   Style Dictionary build
  dist/css/tokens.css         CSS variables --medo-*, Light + Dark + responsive layout
  dist/css/typography.css     Text style classes .medo-text-*
  dist/tailwind/theme.css     Tailwind v4 theme on top of the CSS variables
  dist/js/tokens.js           Resolved values for JavaScript
  dist/docs/*.json            Flat token lists (used by Storybook)
packages/ui                   @medo/ui – components (plain CSS + React)
apps/storybook                Documentation and playground
```

## How the pipeline works

```
Figma variables & styles
   │  scripts/figma-export.js (inside Figma)
   ▼
figma/variables.json
   │  npm run tokens:from-figma
   ▼
packages/tokens/src/*.json   (DTCG format – the open standard of the W3C Design Tokens Community Group)
   │  npm run build:tokens   (Style Dictionary)
   ▼
CSS variables · Tailwind theme · JS · docs JSON
```

**Never edit generated files by hand.** Change Figma, export, rebuild.

### Updating tokens from Figma

1. Change variables or styles in Figma.
2. Run `scripts/figma-export.js` inside Figma (for example via Claude with the Figma connector, or a plugin that runs code such as Scripter) and save the result as `figma/variables.json`.
3. `npm run tokens:from-figma && npm run build:tokens`
4. Check the changes in Storybook, then commit.

## Using the tokens

### Any framework or plain HTML

```css
@import "@medo/design-tokens/css";
@import "@medo/design-tokens/css/typography.css"; /* optional */

.card {
  background: var(--medo-color-surface-raised);
  color: var(--medo-color-text-primary);
  padding: var(--medo-space-6);
  border-radius: var(--medo-radius-lg);
  box-shadow: var(--medo-shadow-elevation-2);
}
```

### Tailwind CSS v4

```css
@import "tailwindcss";
@import "@medo/design-tokens/css";
@import "@medo/design-tokens/tailwind";
```

```html
<div class="bg-surface-raised text-text-primary p-6 rounded-lg shadow-elevation-2">
  <h2 class="text-heading-md">Title</h2>
  <p class="text-body-sm text-text-secondary">Text</p>
</div>
```

- Only system values exist (default Tailwind colors, shadows, radii and text sizes are removed).
- Spacing: one Tailwind step = `space/1` (4 px). `p-4` = `space/4`, `p-0.5` = `space/0-5`.
- Tailwind only finds **complete** class names in the code. Never build class names from variables.

### Light and Dark

The tokens follow the operating system. Force a theme with `data-theme` on `<html>` or on any element:

```html
<html data-theme="dark">  <!-- "light" | "dark" | no attribute = system -->
```

### Responsive layout tokens

`--medo-layout-columns`, `-gutter`, `-margin`, `-section` change automatically:
Mobile (default), Tablet (≥ 640 px), Desktop (≥ 1024 px).

### Fonts

DM Sans and DM Mono (SIL Open Font License). Self-host them, for example with `@fontsource/dm-sans` and `@fontsource/dm-mono`.

## Components

`@medo/ui` = **React Aria Components** (behaviour, keyboard, focus, screen readers, touch) + **plain CSS** on top of the tokens + **Lucide** icons.

| Component | Figma | Notes |
| --- | --- | --- |
| `Button`, `ButtonGroup` | C01 | primary, secondary, ghost, danger, text, ghost-danger · sm/md/lg · `isPending` · group: footer/header/content, stacks on mobile |
| `IconButton` | C02 | `aria-label` required, shown as tooltip · `shortcut` |
| `TextField` (+ `InputAction`) | C03, C04, C13 | label, helper, error, icons, character counter, `multiline` = Textarea |
| `Checkbox`, `CheckboxGroup` | C05 | indeterminate, description |
| `Radio`, `RadioGroup` | C11 | 2–4 options, horizontal or vertical |
| `Switch` | C12 | label start/end, loading state |
| `Tag`, `TagGroup` | C06 | removable values or selectable filters · sm/md |
| `Tooltip`, `TooltipTrigger` | C14 | 500 ms delay, instant on focus, shortcut |
| `ToggleButton`, `ToggleButtonGroup`, `Toolbar` | C15 | stays pressed (`aria-pressed`) · segmented (single, `fullWidth`) or toolbar (multiple) · groups with divider |
| `ListBox`, `Option`, `ListBoxSection` | C07 | list behind Select / Combobox · check (single) or checkbox (multi) · groups, descriptions, wrapping |
| `Select` | C08 | hidden native select (forms, autofill) · single or multiple (tags + „+N“) · clearable, read-only · sm/md/lg · mobile: system picker (single) or Bottom Sheet (multi) |
| `Combobox` | C09 | type to filter (contains, case and accent insensitive, match bold) · single or multiple (removable tags + „+N“) · „Add …“ for tags · server search (`isLoading`) |
| `BottomSheet` | C10 | modal sheet from the bottom · swipe, scrim, Esc, close button · max 90 % · Select / Combobox use it below 640 px (commit live or on close) |
| `MenuTrigger`, `Menu`, `MenuItem`, `MenuSection`, `Submenu`, `MenuButton` | C18 | actions from a trigger · icon required · shortcuts (`Mod`) · danger last · one submenu level · mobile: Bottom Sheet with second view |
| `DialogTrigger`, `Dialog`, `AlertDialog` | C19 | sm/md/lg · only the body scrolls · `primaryAction` (form submit, promise = pending) · `isDirty` asks „Discard changes?“ · Alert dialog: danger/warning/info, focus on Cancel · mobile: fullscreen (forms) or Bottom Sheet |
| `Badge`, `BadgeCount`, `BadgeDot` | C17 | 6 tones · dot or icon · counts „99+“ |
| `Spinner`, `ProgressBar`, `Skeleton` | C26 | reduced motion: slower / static |
| `Avatar`, `AvatarGroup` | C28 | image → initials → icon · colour from id · status · max 4 + „+N“ |
| `Card` | C16 | outlined, elevated, filled, brand, plain · compact · horizontal · whole card as link (`href`) |
| `Alert` | C20 | info, success, warning, danger · inline or banner · actions, dismiss, `announce` |
| `StaticTable`, `Table` (+ `TableHeader`, `Column`, `TableBody`, `Row`, `Cell`) | C37 | native table or interactive grid · sorting, selection, compact · numbers right |
| `Link` | C45 | inline (always underlined) or standalone · external icon · new-tab hint |

```tsx
import { Button, TextField } from '@medo/ui';
import '@medo/ui/styles.css';

<TextField label="Email" type="email" isRequired />
<Button onPress={save}>Save</Button>
```

React Aria naming: `onPress` instead of `onClick`, `isDisabled` instead of `disabled`, `isInvalid`, `isRequired`, `isReadOnly`.

### State contract (framework-neutral CSS)

The CSS reads states from data attributes: `data-hovered`, `data-pressed`, `data-focus-visible`,
`data-selected`, `data-indeterminate`, `data-invalid`, `data-disabled`, `data-readonly`, `data-pending`, `data-allows-removing`.
React Aria sets them. A Vue or Angular wrapper sets the same attributes and reuses the CSS unchanged.
Buttons also work as plain HTML (`:hover`, `:active`, `:focus-visible`, `:disabled` as fallback).

## Accessibility

- Target: WCAG 2.2 AA. Contrast values are documented in the token descriptions.
- Storybook checks every story with axe (panel “Accessibility”).
- Focus is always visible (`:focus-visible`), with a fallback for Windows high contrast mode.
- Motion respects `prefers-reduced-motion`.

## Deployment (design.med-o.de)

The repository contains a `Dockerfile`: it builds the Storybook and serves it with nginx.

1. DNS: A records `design` and `storybook` → server IP.
2. Coolify: resource from this GitHub repository, build pack **Dockerfile**, port **80**, domains `https://design.med-o.de,https://storybook.med-o.de`.
   `storybook.med-o.de` redirects permanently to `design.med-o.de` (see `nginx.conf`).
3. Every push to `main` builds and deploys again (Coolify webhook / auto deploy).

## Previous version

Version 1 (own component library with documentation portal) is kept in the Git history under the tag **`v1.0.0`**.
Projects that still use it should pin the tag: `npm install github:ahmeeedo/medo-design_system#v1.0.0`.

## Roadmap

- More components in `@medo/ui` (order of the Figma library).
- Table, part 2: bulk action bar, column menu, pagination, cards on mobile.
- Storybook tests: Accessibility panel strict (`a11y: { test: 'error' }`, every violation fails); `play` functions for core behaviour (Table sort and select, Tag remove, Alert dismiss, Tooltip keyboard), visible in the Interactions panel and run in CI with the Storybook Vitest addon.
- Code examples per framework: one Storybook per framework (React, Vue, Angular), combined with **Storybook Composition** into one site.
- Publishing the packages (npm or a private registry) with versioning (e.g. Changesets).
- Automatic token export in CI.

## Tech

Style Dictionary 5 · DTCG token format · Tailwind CSS 4 · React 19 · Storybook 10 (Vite) · Node 24 LTS (≥ 22)
