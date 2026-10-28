# med.o Design System

[![Storybook tests](https://github.com/ahmeeedo/medo-design_system/actions/workflows/storybook-tests.yml/badge.svg)](https://github.com/ahmeeedo/medo-design_system/actions/workflows/storybook-tests.yml)

An accessible design system for web products: design tokens, CSS, a Tailwind CSS v4 theme and React components.
Light and Dark, responsive, WCAG 2.2 AA.

**Documentation and live examples: [design.med-o.de](https://design.med-o.de)** – every component with a playground, its variants and the rules for using it.

| Package | Contents |
| --- | --- |
| [`@med-o/design-tokens`](packages/tokens) | CSS variables (`--medo-*`), text style classes, Tailwind v4 theme, JavaScript values. Works with any framework and plain HTML. |
| [`@med-o/ui`](packages/ui) | React components. Behaviour from React Aria Components, look from plain CSS on top of the tokens, icons from Lucide. |

## Contents

- [Getting started](#getting-started)
- [Components](#components)
- [Accessibility](#accessibility)
- [Develop locally](#develop-locally)
- [Contributing](#contributing)
- [Maintaining](#maintaining)
- [License](#license)

## Getting started

### Install

```bash
npm install @med-o/design-tokens            # tokens only, any framework
npm install @med-o/design-tokens @med-o/ui   # tokens + React components (React 19)
```

### Design tokens in CSS

```css
@import "@med-o/design-tokens/css";               /* variables, Light + Dark */
@import "@med-o/design-tokens/css/typography.css"; /* optional: .medo-text-* classes */

.card {
  background: var(--medo-color-surface-raised);
  color: var(--medo-color-text-primary);
  padding: var(--medo-space-6);
  border-radius: var(--medo-radius-lg);
  box-shadow: var(--medo-shadow-elevation-2);
}
```

Use the semantic tokens (`surface`, `text`, `border`, `action`, `feedback` …). They switch between Light and Dark and keep the contrast.

### Tailwind CSS v4

```css
@import "tailwindcss";
@import "@med-o/design-tokens/css";
@import "@med-o/design-tokens/tailwind";
```

```html
<div class="bg-surface-raised text-text-primary p-6 rounded-lg shadow-elevation-2">
  <h2 class="text-heading-md">Title</h2>
  <p class="text-body-sm text-text-secondary">Text</p>
</div>
```

- Only system values exist: the default Tailwind colors, shadows, radii and text sizes are removed.
- Spacing: one Tailwind step is 4 px (`p-4` = `--medo-space-4`, `p-0.5` = `--medo-space-0-5`).
- Tailwind only finds complete class names. Never build class names from variables.

### React components

```tsx
// once, e.g. in your app entry
import '@med-o/design-tokens/css';
import '@med-o/ui/styles.css';
```

```tsx
import { Button, TextField } from '@med-o/ui';

<TextField label="Email" type="email" isRequired />
<Button onPress={save}>Save</Button>
```

- React Aria naming: `onPress` instead of `onClick`, `isDisabled` instead of `disabled`, `isInvalid`, `isRequired`, `isReadOnly`.
- ESM only, marked `"use client"`: works in Vite, Next.js (App Router) and other modern bundlers.
- Dates use [`@internationalized/date`](https://react-spectrum.adobe.com/internationalized/date/). Its helpers (`parseDate`, `today` …) are re-exported from `@med-o/ui`.

#### Language

The built-in texts (close buttons, screen-reader names, announcements, validation messages) are English and German. The language comes from React Aria – the same source as date and number formats: `I18nProvider`, else the browser. Pin it once at the root:

```tsx
import { I18nProvider } from 'react-aria-components';

<I18nProvider locale="de-DE">{app}</I18nProvider>
```

Regional variants use their language (`de-AT`, `de-CH` → German); other languages fall back to English. A prop of a single component (`closeLabel`, `texts` …) always wins. For another language or a different tone, pass your own texts – TypeScript checks that none is missing:

```tsx
import { MessagesProvider, enMessages, type Messages } from '@med-o/ui';

const fr: Messages = { ...enMessages, common: { ...enMessages.common, close: 'Fermer' /* … */ } };
<MessagesProvider messages={fr}>{app}</MessagesProvider>
```

#### Overriding styles

All component styles sit in the cascade layer `components`. Your own CSS without a layer always wins over it – whatever the specificity, no `!important`:

```css
.medo-button { border-radius: 0; } /* wins, even though it comes from a single class */
```

With Tailwind v4 the utilities win as well (`<Button className="mt-4">`). The layer order is the one of Tailwind: `theme, base, components, utilities`.

#### Without a bundler

`@med-o/ui/styles.min.css` is all component CSS in one minified file (about 20 KB gzip), e.g. for a CDN link. With a bundler import `@med-o/ui/styles.css`; it inlines and minifies the files itself.

### Light and Dark

The tokens follow the operating system. Force a theme with `data-theme` on `<html>` or on any element:

```html
<html data-theme="dark">  <!-- "light" | "dark" | no attribute = system -->
```

With “Increase contrast” in the system settings (`prefers-contrast: more`) secondary text and borders get stronger: secondary text ≥ 9.4 : 1 on every surface, borders ≥ 4.3 : 1. Nothing to set up.

### Responsive layout tokens

`--medo-layout-columns`, `--medo-layout-gutter`, `--medo-layout-margin` and `--medo-layout-section` change automatically:
Mobile (default), Tablet (≥ 640 px), Desktop (≥ 1024 px).

### Fonts

DM Sans and DM Mono (SIL Open Font License). Self-host them, for example with `@fontsource/dm-sans` and `@fontsource/dm-mono` (weights 400, 500, 600, 700).

### Other frameworks

The component CSS reads states only from data attributes: `data-hovered`, `data-pressed`, `data-focus-visible`,
`data-selected`, `data-indeterminate`, `data-invalid`, `data-disabled`, `data-readonly`, `data-pending`, `data-allows-removing`.
React Aria sets them. A Vue, Angular or plain HTML implementation can set the same attributes and reuse `@med-o/ui/styles.css` unchanged.
Buttons also work as plain HTML (`:hover`, `:active`, `:focus-visible`, `:disabled` as fallback).

## Components

Live examples and all props: [design.med-o.de](https://design.med-o.de).

| Component | Notes |
| --- | --- |
| `Button`, `ButtonGroup` | primary, secondary, ghost, danger, text, ghost-danger · sm/md/lg · `isPending` · group: footer/header/content, stacks on mobile |
| `IconButton` | `aria-label` required, shown as tooltip · `shortcut` · `media` / `media-ghost` on images and video (Media icon button, sm 28 with 44 hit area) |
| `TextField` (+ `InputAction`) | label, helper, error, icons, character counter, `multiline` = Textarea |
| `Checkbox`, `CheckboxGroup` | indeterminate, description · group without visible label via `aria-label` |
| `Radio`, `RadioGroup` | 2–4 options, horizontal or vertical · group without visible label via `aria-label` |
| `Switch` | label start/end, loading state |
| `Tag`, `TagGroup` | removable values or selectable filters · sm/md |
| `Tooltip`, `TooltipTrigger` | 500 ms delay, instant on focus, shortcut |
| `ToggleButton`, `ToggleButtonGroup`, `Toolbar` | stays pressed (`aria-pressed`) · segmented (single, `fullWidth`) or toolbar (multiple) · groups with divider |
| `ListBox`, `Option`, `ListBoxSection` | list behind Select / Combobox · check (single) or checkbox (multi) · groups, descriptions, wrapping |
| `Select` | hidden native select (forms, autofill) · single or multiple (tags + “+N”) · clearable, read-only · sm/md/lg · mobile: system picker (single) or Bottom Sheet (multi) · without visible label via `aria-label` (filter bars) |
| `Combobox` | type to filter (contains, case and accent insensitive, match bold) · single or multiple (removable tags + “+N”) · “Add …” for tags · server search (`isLoading`) |
| `BottomSheet` | modal sheet from the bottom · swipe, scrim, Esc, close button · max 90 % · Select / Combobox use it below 640 px (commit live or on close) |
| `MenuTrigger`, `Menu`, `MenuItem`, `MenuSection`, `Submenu`, `MenuButton` | actions from a trigger · icon required · shortcuts (`Mod`) · danger last · one submenu level · mobile: Bottom Sheet with second view |
| `DialogTrigger`, `Dialog`, `AlertDialog` | sm/md/lg · only the body scrolls · `primaryAction` (form submit, promise = pending) · `isDirty` asks “Discard changes?” · Alert dialog: danger/warning/info, focus on Cancel · mobile: fullscreen (forms) or Bottom Sheet |
| `Drawer` | modal panel from the side · right (account, filters, details) or left (navigation) · sm/md/lg · free footer (`close`, `cancel`) · `isDirty` · mobile viewport − 56, swipe to close · SideNav uses it on tablets |
| `Badge`, `BadgeCount`, `BadgeDot` | 6 tones · dot or icon · counts “99+” |
| `Spinner`, `ProgressBar`, `Skeleton` | reduced motion: slower / static |
| `List`, `ListItem`, `DescriptionList`, `DescriptionItem` | real ul/ol/dl · bullet, number (tabular, `start`), check with `excluded` · level 2 · follows the text size · DL stacks below 360 px (container query) |
| `Avatar`, `AvatarGroup` | image → initials → icon · colour from id · status · max 4 + “+N” |
| `ListView`, `ListRow`, `ListRowIcon`, `ListCard` | React Aria GridList: ↑ ↓ rows, Tab into row controls · 1–3 lines · leading (avatar auto-sized) · meta, menu, chevron, switch or buttons · `unread` · selection with checkboxes · plain / card · `isLoading` skeleton rows · `variant="cards"` with ListCard (Table cards on mobile, checkbox lg) · `swipeActions` on touch: left Delete, right Archive, snaps open from 88 px, full swipe ≥ 50 % or flick, Toast “Undo” – same actions in the “…” menu |
| `EmptyState` | 5 types (first use, no results, error, no access, all done) with icon and tone · page / section / inline · structured `action` (primary only for first use) and `secondaryAction` (text button or Link) · illustration slot · `section` named by its heading · “no results” in `role="status"` · used by List view and Table |
| `Pagination` | navigation region · full: summary (live region), rows per page (Select sm), ‹ 1 … 4 5 6 … 19 › (max 7, first and last always) · compact below 640 px: ‹ Page 5 of 19 › 48 px · buttons (`onChange`) or real links (`getPageHref`) · current page `aria-current`, action/selected · one page: hidden · “Load more” is a Button pattern |
| `SearchField`, `SearchResult`, `QuickSearch`, `Highlight` | search field (Esc clears, Enter submits, label or `aria-label`) · result: page, document, person, media · base / aesthetic · every match bold · Quick search Cmd/Ctrl+K: React Aria Autocomplete, recent and suggested, groups, “All results”, full screen on mobile · search page pattern (tabs, filters, tags, sort, list/grid) |
| `Breadcrumbs` | React Aria Breadcrumbs: nav “Breadcrumb”, ordered list, current page last (`aria-current`) · home icon · sm / md · from 5 levels “…” with a Menu · labels over 200 px with Tooltip · mobile: back link to the parent page |
| `Accordion`, `AccordionItem` | React Aria DisclosureGroup · contained group md / lg · header button in a real heading · icon, description, badge · several open by default (or one at a time) · closed panels findable (`until-found`) · “Expand all” from 7 sections · deep link via `#id` · Search: sidebar filters and mobile filter sheet |
| `Slider`, `SliderField`, `NumberField` | React Aria Slider: single or range, thumbs never cross · value always shown and read in the same format (Intl) · halo, value tooltip while dragging · ticks (≤ 10 steps), min/max · Slider field with number inputs (sync, clamp on blur) · NumberField: Input look, Intl format, clamps |
| `UploadField`, `Dropzone`, `FileTrigger`, `FileItem`, `FileTile` | React Aria DropZone + FileTrigger: button always there, drag and drop a shortcut, paste on focus · controlled list (app uploads, `loaded`, `error`, `previewUrl`) · type, size and count checked before upload, messages that fix · progress per file, Retry and Remove at the file · names truncate in the middle · List · Grid · Compact (auto below 640 px) · polite announcements, focus kept on remove |
| `DatePicker`, `DateRangePicker`, `DateField`, `TimeField`, `Calendar`, `RangeCalendar` | React Aria + `@internationalized/date` (helpers re-exported) · typing first: segments, digits only, auto-advance, locale order, 24 × 24 targets · calendar as helper: month and year grids, ISO week numbers · range: two months, presets (default list or own) · date + time with a time field in the panel · time slots behind a clock button, booked ones with reason · Bottom Sheet lg below 640 px · messages that name the rule |
| `Image`, `Figure`, `MediaPlayButton`, `EmbedConsent` | Image: ratios reserve the space (1:1 · 3:4 · 4:3 · 3:2 · 16:9 · 21:9 · original), `alt` required, blur-up or Skeleton, fade-in, error keeps the space · cover / contain · lazy by default, `priority` for the hero · overlays: text on gradient, one badge, play (states from the surrounding link) · Figure with caption and credit · Embed consent: two-click (GDPR), nothing loads before the click, Compact below 480 px, iframe takes the focus |
| `Card` | outlined, elevated, filled, brand, plain · compact · horizontal · whole card as link (`href`) |
| `Alert` | info, success, warning, danger · inline or banner · actions, dismiss, `announce` |
| `ToastRegion`, `toast()` | region once at the root, `toast(message, { action, persistent })` from anywhere · 5 s / 8 s with action / errors until closed · pauses on hover, focus, hidden tab · max 3 · F6, Esc |
| `Tabs`, `TabList`, `Tab`, `TabPanel` | track with sliding thumb · md/lg, `fullWidth` · icon, count · panels stay mounted (`keepMounted`) · mobile: lg, up to 3 fill, more scroll with fade · URL via `selectedKey` |
| `PopoverTrigger`, `Popover`, `Toggletip` | click only, bottom start, 8 px · sm/md/lg/auto · `title` (header + close), `primaryAction` (footer) · mobile: Bottom Sheet · Toggletip: info button + text + link |
| `NavItem`, `NavGroup`, `NavSection`, `NavList`, `SkipLink`, `SiteHeader`, `AppHeader`, `SideNav`, `BottomTabBar`, `TabBarItem`, `TabBarMore` | links with `aria-current`, any router via `RouterProvider` · website header with dropdown (disclosure) and fullscreen menu < 768 px · side navigation 256 / rail 64 (tooltips), overlay 640–1023 px · bottom tab bar + Nav sheet < 640 px |
| `StaticTable`, `Table` (+ `TableHeader`, `Column`, `TableBody`, `Row`, `Cell`) | native table or interactive grid · sorting, selection, compact · numbers right · `toolbar` and `footer` in one frame · `ColumnsMenu` (show/hide, locked columns) |
| `BulkActionBar` | appears with ≥ 1 selected · desktop: floating inverse bar with Toast buttons · mobile: full-width bar, ghost lg, safe area · max 3 actions + “…” menu · count announced · Esc / × clears, focus returns · Table and List view |
| `Link` | inline (always underlined) or standalone · external icon · new-tab hint |

Marketing components (carousel, video player, hero sections) are not part of the library.

## Accessibility

- Target: WCAG 2.2 AA in Light and Dark. Contrast values are documented in the token descriptions.
- Behaviour, keyboard and screen reader support come from React Aria Components.
- Focus is always visible (`:focus-visible`), with a fallback for the high contrast mode of the operating system (`forced-colors`).
- Motion uses interruptible spring transitions (`--medo-motion-spring-*`). With `prefers-reduced-motion` only cross-fades remain.
- Every story is checked with axe, and every interactive component has an interaction test (keyboard, focus, pointer). Both run in CI.

## Develop locally

Requirements: [Node.js](https://nodejs.org) 24 LTS (22 or newer works).

```bash
git clone https://github.com/ahmeeedo/medo-design_system.git
cd medo-design_system
npm install
npm run storybook   # http://localhost:6006
```

| Command | What it does |
| --- | --- |
| `npm run storybook` | Builds the tokens and starts Storybook with hot reload |
| `npm test` | Runs every story in a headless browser, in Light and Dark: rendering, axe (WCAG 2.2 AA) and the interaction tests. Once before: `npx playwright install chromium` |
| `npm run build:packages` | Builds `@med-o/design-tokens` and `@med-o/ui` for npm |
| `npm run build-storybook` | Builds Storybook as a static site (`apps/storybook/storybook-static`) |
| `npm run changeset` | Describes a change for the next release (see [Contributing](#contributing)) |

Project structure:

```
packages/tokens     @med-o/design-tokens – DTCG source tokens (src/) and the Style Dictionary build (build.mjs)
packages/ui         @med-o/ui – one folder per component: React component, CSS and stories
apps/storybook      Documentation site: foundations, guides, patterns, Storybook and test configuration
```

## Contributing

Issues and pull requests are welcome. Please follow these rules:

- **Reuse before you build.** Use the existing components and tokens. Add something new only when nothing fits, and explain why.
- **Proven libraries for behaviour.** Interactive behaviour and accessibility come from React Aria Components, not from own implementations.
- **Only semantic tokens in components.** No hard-coded colors, spacing, radii or font sizes.
- **State contract.** CSS reads states only from data attributes (`data-hovered`, `data-pressed`, `data-focus-visible`, `data-selected`, `data-invalid`, `data-disabled` …), so other frameworks can reuse it.
- **Accessibility.** WCAG 2.2 AA, visible `:focus-visible`, `forced-colors` fallback, `prefers-reduced-motion`.
- **Stories.** Every component has stories for its variants, sizes and states, Light and Dark, and an interaction test for interactive behaviour. The playground renders from its args, and every control must change what you see.
- **Tests pass.** Run `npm test` before you open a pull request. CI runs the same tests, plus the visual check.
- **Visual check.** CI compares a screenshot of every documented story, Light and Dark, with its reference in `apps/storybook/__screenshots__/`. On a mismatch the workflow run has the actual and diff images as artifact `screenshot-diffs`. If the change is intended, run the workflow **Update screenshots** on your branch (Actions → Update screenshots → Run workflow); it commits the new references. References are made in CI only, because fonts render differently on every OS. Stories that cannot be stable (live timers) set `tags: ['!visual']`.
- **Changesets.** If your change affects a published package, run `npm run changeset` and commit the generated file. It sets the version bump (patch, minor, major) and the changelog entry.

Token values come from the design library and are generated (see [Maintaining](#maintaining)). To propose a token change, please open an issue.

## Maintaining

### Token pipeline

The token values are maintained in the internal design library. Its export is versioned in this repository:

```
figma/variables.json          export of the design library (variables, text and effect styles)
   │  npm run tokens:from-figma   (scripts/figma-to-dtcg.mjs)
   ▼
packages/tokens/src/*.json    DTCG format (W3C Design Tokens Community Group)
   │  npm run build:tokens        (Style Dictionary)
   ▼
CSS variables · Tailwind theme · JS · docs JSON
```

`scripts/figma-export.js` runs inside the design tool (Plugin API) and produces `figma/variables.json`.
Never edit generated files by hand: `figma/variables.json`, `packages/tokens/src/**` and every `dist/` folder.

### Releasing

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets). Both packages always share one version.

1. Pull requests add changesets (`npm run changeset`).
2. On `main`, the Release workflow opens a “Version Packages” pull request with the new versions and changelogs.
3. Merging it publishes both packages to npm with provenance (npm trusted publishing, no token stored in GitHub).

### Deploy the documentation

The `Dockerfile` builds Storybook and serves it with nginx on port 80:

```bash
docker build -t medo-storybook .
docker run -p 8080:80 medo-storybook   # http://localhost:8080
```

Version 1 of the design system (own component library with a documentation portal) is kept under the Git tag `v1.0.0`.

## License

[MIT](LICENSE). The fonts DM Sans and DM Mono are licensed under the SIL Open Font License.
