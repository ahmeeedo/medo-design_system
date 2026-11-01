# @med-o/design-tokens

## 0.6.0

### Patch Changes

- 3653bdb: The contrast check of the token build also covers higher contrast (`prefers-contrast: more`): every allowed text / background pair is checked in that mode too. `docs/contrast.json` gets the values per mode (`light-more`, `dark-more`) and `higherContrast` – the lowest contrast of secondary text and borders on content surfaces.

## 0.5.1

No changes in this release.

## 0.5.0

### Minor Changes

- 2151054: Which text goes on which background is now fixed and checked: `@med-o/design-tokens/docs/contrast.json` lists every allowed text / background pair with its contrast in Light and Dark, and the build fails below 4.5 : 1. The descriptions of `text/primary`, `text/secondary` and `border/strong` now name the surfaces they are made for instead of “all surfaces”. New token `font/size/2xs` (11 px), used by `label/xs` – for short metadata only.

## 0.4.2

### Patch Changes

- 49f8981: Package READMEs on npm: spacing rules and layout components, supported browsers, versions and where to find the changelog.

## 0.4.1

## 0.4.0

### Minor Changes

- d1ca3a6: Spacing rules and layout components. Six rules for the space between elements – `inline`, `content`, `fields`, `items`, `group`, `section` – as tokens `--medo-layout-gap-*` that follow the layout mode (mobile · tablet · desktop), as Tailwind utilities (`gap-items`, `space-y-fields`, `py-section` …) and as classes (`medo-gap-items`). New components `Stack` (vertical `content`, horizontal `inline`), `Grid` (as many columns as fit, fixed columns or the 4 · 8 · 12 layout grid, gap `items`), `GridItem` and `Container` (content width plus page margin). `ButtonGroup` uses the rule `inline` (same value as before).

## 0.3.0

## 0.2.0

### Minor Changes

- be1add2: The overline text style is no longer uppercase: sentence case with normal tracking (`.medo-text-overline`, `--medo-typography-overline`). Navigation section titles follow. Capitals are harder to read; write the text in the case you want to show.
- 23fbda6: Higher contrast for “Increase contrast” in the system settings (`prefers-contrast: more`): `text/secondary` becomes neutral 700 (Light) or 300 (Dark), at least 9.4 : 1 on every surface; `border/default` becomes `border/strong`, at least 4.3 : 1. Works with `data-theme` on any element.
