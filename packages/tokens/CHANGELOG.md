# @med-o/design-tokens

## 0.14.0

_Released 2026-11-11_

No changes in this release.

## 0.13.1

_Released 2026-11-11_

No changes in this release.

## 0.13.0

_Released 2026-11-10_

No changes in this release.

## 0.12.0

_Released 2026-11-10_

No changes in this release.

## 0.11.0

_Released 2026-11-10_

### Minor Changes

- 68e203d: New: `css/base.css` sets up the page for apps without Tailwind.

  - Removes the browser margins and sizes every box with its padding and border (`border-box`).
  - Gives `body` the canvas color, the primary text color and the text style body/md, in Light and Dark.
  - Sits in the cascade layer `base`, so component styles, Tailwind utilities and your own CSS always win.
  - Import it after `tokens.css`: `@import "@med-o/design-tokens/css/base.css";`

### Patch Changes

- 171a142: Fixed: both packages include their `CHANGELOG.md`.

  What changed in each version now ships with the code you install, in `node_modules/@med-o/ui/CHANGELOG.md` and `node_modules/@med-o/design-tokens/CHANGELOG.md`.

## 0.10.0

_Released 2026-11-09_

### Minor Changes

- b2bbbb4: New: code/* tokens color the syntax in `CodeBlock`.

  - `code/keyword`, `code/string`, `code/function`, `code/constant`, `code/comment` and `code/punctuation`, each for Light and Dark.
  - Every color reaches at least 4.5 : 1 on surface/subtle, surface/default and surface/brand-muted. The token build checks these pairs.

## 0.9.0

_Released 2026-11-08_

No changes in this release.

## 0.8.1

_Released 2026-11-08_

No changes in this release.

## 0.8.0

_Released 2026-11-07_

### Minor Changes

- ef97ec8: New: width tokens `size/width/3xs` to `size/width/6xl` (80 to 720 px).

  - For what has a width of its own: floating layers, limits that cut long text and app regions. Components in the page take the width of their container.
  - CSS `--medo-size-width-*`, JS and Figma variables; in Tailwind `max-w-(--medo-size-width-xl)`.
  - Size tokens carry their Figma description.

## 0.7.2

_Released 2026-11-07_

No changes in this release.

## 0.7.1

_Released 2026-11-07_

No changes in this release.

## 0.7.0

_Released 2026-11-03_

No changes in this release.

## 0.6.0

_Released 2026-11-01_

### Patch Changes

- 3653bdb: Improved: the contrast check of the token build also covers higher contrast (`prefers-contrast: more`).

  - Every allowed text / background pair is checked in that mode too.
  - `docs/contrast.json` gets the values per mode (`light-more`, `dark-more`) and `higherContrast` – the lowest contrast of secondary text and borders on content surfaces.

## 0.5.1

_Released 2026-11-01_

No changes in this release.

## 0.5.0

_Released 2026-11-01_

### Minor Changes

- 2151054: New: fixed text / background pairs, checked in every build.

  - `@med-o/design-tokens/docs/contrast.json` lists every allowed pair with its contrast in Light and Dark; the build fails below 4.5 : 1.
  - The descriptions of `text/primary`, `text/secondary` and `border/strong` name the surfaces they are made for instead of “all surfaces”.

- 2151054: New: token `font/size/2xs` (11 px), used by `label/xs`.

  For short metadata only.

## 0.4.2

_Released 2026-11-01_

### Patch Changes

- 49f8981: Improved: the package README on npm covers the spacing rules and layout components.

  Also supported browsers, versions and where to find the changelog.

## 0.4.1

_Released 2026-10-31_

## 0.4.0

_Released 2026-10-31_

### Minor Changes

- d1ca3a6: New: six spacing rules for the space between elements.

  - `inline`, `content`, `fields`, `items`, `group`, `section` – as tokens `--medo-layout-gap-*` that follow the layout mode (mobile · tablet · desktop).
  - As Tailwind utilities (`gap-items`, `space-y-fields`, `py-section` …) and as classes (`medo-gap-items`).
  - `ButtonGroup` uses the rule `inline` (same value as before).

## 0.3.0

_Released 2026-10-30_

## 0.2.0

_Released 2026-10-28_

### Minor Changes

- be1add2: Improved: the overline text style is no longer uppercase.

  Sentence case with normal tracking (`.medo-text-overline`, `--medo-typography-overline`); navigation section titles follow. Capitals are harder to read – write the text in the case you want to show.

- 23fbda6: Improved: higher contrast for “Increase contrast” in the system settings (`prefers-contrast: more`).

  - `text/secondary` becomes neutral 700 (Light) or 300 (Dark): at least 9.4 : 1 on every surface.
  - `border/default` becomes `border/strong`: at least 4.3 : 1.
  - Works with `data-theme` on any element.
