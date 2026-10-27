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
| `npm test` | Testet alle Stories im Browser, in Light und Dark: Rendern, axe (WCAG 2.2 AA) und die Interaction tests. Einmalig vorher: `npx playwright install chromium` |

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
| `IconButton` | C02 | `aria-label` required, shown as tooltip · `shortcut` · `media` / `media-ghost` on images and video (Media icon button, sm 28 with 44 hit area) |
| `TextField` (+ `InputAction`) | C03, C04, C13 | label, helper, error, icons, character counter, `multiline` = Textarea |
| `Checkbox`, `CheckboxGroup` | C05 | indeterminate, description · group without visible label via `aria-label` |
| `Radio`, `RadioGroup` | C11 | 2–4 options, horizontal or vertical · group without visible label via `aria-label` |
| `Switch` | C12 | label start/end, loading state |
| `Tag`, `TagGroup` | C06 | removable values or selectable filters · sm/md |
| `Tooltip`, `TooltipTrigger` | C14 | 500 ms delay, instant on focus, shortcut |
| `ToggleButton`, `ToggleButtonGroup`, `Toolbar` | C15 | stays pressed (`aria-pressed`) · segmented (single, `fullWidth`) or toolbar (multiple) · groups with divider |
| `ListBox`, `Option`, `ListBoxSection` | C07 | list behind Select / Combobox · check (single) or checkbox (multi) · groups, descriptions, wrapping |
| `Select` | C08 | hidden native select (forms, autofill) · single or multiple (tags + „+N“) · clearable, read-only · sm/md/lg · mobile: system picker (single) or Bottom Sheet (multi) · without visible label via `aria-label` (filter bars) |
| `Combobox` | C09 | type to filter (contains, case and accent insensitive, match bold) · single or multiple (removable tags + „+N“) · „Add …“ for tags · server search (`isLoading`) |
| `BottomSheet` | C10 | modal sheet from the bottom · swipe, scrim, Esc, close button · max 90 % · Select / Combobox use it below 640 px (commit live or on close) |
| `MenuTrigger`, `Menu`, `MenuItem`, `MenuSection`, `Submenu`, `MenuButton` | C18 | actions from a trigger · icon required · shortcuts (`Mod`) · danger last · one submenu level · mobile: Bottom Sheet with second view |
| `DialogTrigger`, `Dialog`, `AlertDialog` | C19 | sm/md/lg · only the body scrolls · `primaryAction` (form submit, promise = pending) · `isDirty` asks „Discard changes?“ · Alert dialog: danger/warning/info, focus on Cancel · mobile: fullscreen (forms) or Bottom Sheet |
| `Drawer` | C25 | modal panel from the side · right (account, filters, details) or left (navigation) · sm/md/lg · free footer (`close`, `cancel`) · `isDirty` · mobile viewport − 56, swipe to close · SideNav uses it on tablets |
| `Badge`, `BadgeCount`, `BadgeDot` | C17 | 6 tones · dot or icon · counts „99+“ |
| `Spinner`, `ProgressBar`, `Skeleton` | C26 | reduced motion: slower / static |
| `List`, `ListItem`, `DescriptionList`, `DescriptionItem` | C27 | real ul/ol/dl · bullet, number (tabular, `start`), check with `excluded` · level 2 · follows the text size · DL stacks below 360 px (container query) |
| `Avatar`, `AvatarGroup` | C28 | image → initials → icon · colour from id · status · max 4 + „+N“ |
| `ListView`, `ListRow`, `ListRowIcon`, `ListCard` | C29 | React Aria GridList: ↑ ↓ rows, Tab into row controls · 1–3 lines · leading (avatar auto-sized) · meta, menu, chevron, switch or buttons · `unread` · selection with checkboxes · plain / card · `isLoading` skeleton rows · `variant="cards"` with ListCard (Table cards on mobile, checkbox lg) · `swipeActions` on touch: left Delete, right Archive, snaps open from 88 px, full swipe ≥ 50 % or flick, Toast „Undo“ – same actions in the „…“ menu |
| `EmptyState` | C36 | 5 types (first use, no results, error, no access, all done) with icon and tone · page / section / inline · structured `action` (primary only for first use) and `secondaryAction` (text button or Link) · illustration slot · `section` named by its heading · „no results“ in `role="status"` · used by List view and Table |
| `Pagination` | C35 | navigation region · full: summary (live region), rows per page (Select sm), ‹ 1 … 4 5 6 … 19 › (max 7, first and last always) · compact below 640 px: ‹ Page 5 of 19 › 48 px · buttons (`onChange`) or real links (`getPageHref`) · current page `aria-current`, action/selected · one page: hidden · „Load more“ is a Button pattern |
| `SearchField`, `SearchResult`, `QuickSearch`, `Highlight` | C43 | search field (Esc clears, Enter submits, label or `aria-label`) · result: page, document, person, media · base / aesthetic · every match bold · Quick search Cmd/Ctrl+K: React Aria Autocomplete, recent and suggested, groups, „All results“, full screen on mobile · search page pattern (tabs, filters, tags, sort, list/grid) |
| `Breadcrumbs` | C44 | React Aria Breadcrumbs: nav „Breadcrumb“, ordered list, current page last (`aria-current`) · home icon · sm / md · from 5 levels „…“ with a Menu · labels over 200 px with Tooltip · mobile: back link to the parent page |
| `Accordion`, `AccordionItem` | C31 | React Aria DisclosureGroup · contained group md / lg · header button in a real heading · icon, description, badge · several open by default (or one at a time) · closed panels findable (`until-found`) · „Expand all“ from 7 sections · deep link via `#id` · Search: sidebar filters and mobile filter sheet |
| `Slider`, `SliderField`, `NumberField` | C32 | React Aria Slider: single or range, thumbs never cross · value always shown and read in the same format (Intl) · halo, value tooltip while dragging · ticks (≤ 10 steps), min/max · Slider field with number inputs (sync, clamp on blur) · NumberField: Input look, Intl format, clamps |
| `UploadField`, `Dropzone`, `FileTrigger`, `FileItem`, `FileTile` | C33 | React Aria DropZone + FileTrigger: button always there, drag and drop a shortcut, paste on focus · controlled list (app uploads, `loaded`, `error`, `previewUrl`) · type, size and count checked before upload, messages that fix · progress per file, Retry and Remove at the file · names truncate in the middle · List · Grid · Compact (auto below 640 px) · polite announcements, focus kept on remove |
| `DatePicker`, `DateRangePicker`, `DateField`, `TimeField`, `Calendar`, `RangeCalendar` | C34 | React Aria + `@internationalized/date` (helpers re-exported) · typing first: segments, digits only, auto-advance, locale order, 24 × 24 targets · calendar as helper: month and year grids, ISO week numbers · range: two months, presets (Figma list or own) · date + time with a time field in the panel · time slots behind a clock button, booked ones with reason · Bottom Sheet lg below 640 px · messages that name the rule |
| `Image`, `Figure`, `MediaPlayButton`, `EmbedConsent` | C30 | Image: ratios reserve the space (1:1 · 3:4 · 4:3 · 3:2 · 16:9 · 21:9 · original), `alt` required, blur-up or Skeleton, fade-in, error keeps the space · cover / contain · lazy by default, `priority` for the hero · overlays: text on gradient, one badge, play (states from the surrounding link) · Figure with caption and credit · Embed consent: two-click (GDPR), nothing loads before the click, Compact below 480 px, iframe takes the focus |
| `Card` | C16 | outlined, elevated, filled, brand, plain · compact · horizontal · whole card as link (`href`) |
| `Alert` | C20 | info, success, warning, danger · inline or banner · actions, dismiss, `announce` |
| `ToastRegion`, `toast()` | C21 | region once at the root, `toast(message, { action, persistent })` from anywhere · 5 s / 8 s with action / errors until closed · pauses on hover, focus, hidden tab · max 3 · F6, Esc |
| `Tabs`, `TabList`, `Tab`, `TabPanel` | C22 | track with sliding thumb · md/lg, `fullWidth` · icon, count · panels stay mounted (`keepMounted`) · mobile: lg, up to 3 fill, more scroll with fade · URL via `selectedKey` |
| `PopoverTrigger`, `Popover`, `Toggletip` | C23 | click only, bottom start, 8 px · sm/md/lg/auto · `title` (header + close), `primaryAction` (footer) · mobile: Bottom Sheet · Toggletip: info button + text + link |
| `NavItem`, `NavGroup`, `NavSection`, `NavList`, `SkipLink`, `SiteHeader`, `AppHeader`, `SideNav`, `BottomTabBar`, `TabBarItem`, `TabBarMore` | C24 | links with `aria-current`, any router via `RouterProvider` · website header with dropdown (disclosure) and fullscreen menu < 768 px · side navigation 256 / rail 64 (tooltips), overlay 640–1023 px · bottom tab bar + Nav sheet < 640 px |
| `StaticTable`, `Table` (+ `TableHeader`, `Column`, `TableBody`, `Row`, `Cell`) | C37 | native table or interactive grid · sorting, selection, compact · numbers right · `toolbar` and `footer` in one frame · `ColumnsMenu` (show/hide, locked columns) |
| `BulkActionBar` | C37 | appears with ≥ 1 selected · desktop: floating inverse bar with Toast buttons · mobile: full-width bar, ghost lg, safe area · max 3 actions + „…“ menu · count announced · Esc / × clears, focus returns · Table and List view |
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
- Storybook checks every story with axe (panel “Accessibility”). Strict: `a11y.test: 'error'`, so every violation fails `npm test`.
- Every interactive component has an “Interaction test” story (`play` function: keyboard, focus, pointer). They run in the Interactions panel, in the Testing widget at the bottom of the sidebar and with `npm test` (Storybook Vitest addon, headless Chromium, every story in Light and Dark).
- CI: GitHub Actions runs `npm test` on every pull request and push to `main` (`.github/workflows/storybook-tests.yml`).
- Motion follows iOS: spring tokens from Figma (`--medo-motion-spring-*`), interruptible transitions; with reduced motion only cross-fades.
- Focus is always visible (`:focus-visible`), with a fallback for Windows high contrast mode.

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

- All app components of the Figma file are in `@medo/ui`. Marketing components (Carousel, Video Player, Shapes, Hero, Text + Media) are out of scope.
- Code examples per framework: one Storybook per framework (React, Vue, Angular), combined with **Storybook Composition** into one site.
- Publishing the packages (npm or a private registry) with versioning (e.g. Changesets).
- Automatic token export in CI.

## Tech

Style Dictionary 5 · DTCG token format · Tailwind CSS 4 · React 19 · Storybook 10 (Vite) · Node 24 LTS (≥ 22)
