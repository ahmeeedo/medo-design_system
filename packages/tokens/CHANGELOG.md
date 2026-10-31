# @med-o/design-tokens

## 0.4.0

### Minor Changes

- d1ca3a6: Spacing rules and layout components. Six rules for the space between elements – `inline`, `content`, `fields`, `items`, `group`, `section` – as tokens `--medo-layout-gap-*` that follow the layout mode (mobile · tablet · desktop), as Tailwind utilities (`gap-items`, `space-y-fields`, `py-section` …) and as classes (`medo-gap-items`). New components `Stack` (vertical `content`, horizontal `inline`), `Grid` (as many columns as fit, fixed columns or the 4 · 8 · 12 layout grid, gap `items`), `GridItem` and `Container` (content width plus page margin). `ButtonGroup` uses the rule `inline` (same value as before).

## 0.3.0

## 0.2.0

### Minor Changes

- be1add2: The overline text style is no longer uppercase: sentence case with normal tracking (`.medo-text-overline`, `--medo-typography-overline`). Navigation section titles follow. Capitals are harder to read; write the text in the case you want to show.
- 23fbda6: Higher contrast for “Increase contrast” in the system settings (`prefers-contrast: more`): `text/secondary` becomes neutral 700 (Light) or 300 (Dark), at least 9.4 : 1 on every surface; `border/default` becomes `border/strong`, at least 4.3 : 1. Works with `data-theme` on any element.
