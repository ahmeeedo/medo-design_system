# @med-o/ui

## 0.6.0

### Minor Changes

- 3653bdb: `Combobox` (Bottom Sheet on mobile) and `Select`: “Loading…” and the hidden “read only” come from the built-in texts now, so they follow the language – German “Wird geladen…” and “schreibgeschützt”.

  **Breaking:** new built-in text `common.readOnly`. If you pass your own language to `MessagesProvider`, add it, e.g. `readOnly: 'lecture seule'` – TypeScript names the missing text.

### Patch Changes

- Updated dependencies [3653bdb]
  - @med-o/design-tokens@0.6.0

## 0.5.1

### Patch Changes

- 725776a: `EmbedConsent`: in Firefox the loaded iframe now takes the focus after “Load”, like in the other browsers – keyboard users land in the content instead of at the top of the page.
- @med-o/design-tokens@0.5.1

## 0.5.0

### Minor Changes

- 2151054: Fields never show an empty error: without an error message an invalid field keeps its helper text instead of an icon alone, and a warning in development names the missing `errorMessage`. `Checkbox` gets `errorMessage` for a single checkbox, e.g. “Accept the terms to continue.” (in a `CheckboxGroup` the group has the message).

### Patch Changes

- Updated dependencies [2151054]
  - @med-o/design-tokens@0.5.0

## 0.4.2

### Patch Changes

- 49f8981: Package READMEs on npm: spacing rules and layout components, supported browsers, versions and where to find the changelog.
- Updated dependencies [49f8981]
  - @med-o/design-tokens@0.4.2

## 0.4.1

### Patch Changes

- 3db301f: Spacing rules in components: cards in a `ListView` (`variant="cards"`) are now `items` apart (16 · 24 · 24 px, before 12 px); the buttons of `EmbedConsent` are `inline` apart (8 px, before 16 px horizontal).
  - @med-o/design-tokens@0.4.1

## 0.4.0

### Minor Changes

- d1ca3a6: Spacing rules and layout components. Six rules for the space between elements – `inline`, `content`, `fields`, `items`, `group`, `section` – as tokens `--medo-layout-gap-*` that follow the layout mode (mobile · tablet · desktop), as Tailwind utilities (`gap-items`, `space-y-fields`, `py-section` …) and as classes (`medo-gap-items`). New components `Stack` (vertical `content`, horizontal `inline`), `Grid` (as many columns as fit, fixed columns or the 4 · 8 · 12 layout grid, gap `items`), `GridItem` and `Container` (content width plus page margin). `ButtonGroup` uses the rule `inline` (same value as before).

### Patch Changes

- Updated dependencies [d1ca3a6]
  - @med-o/design-tokens@0.4.0

## 0.3.0

### Minor Changes

- e4a8577: `StaticTable`: when the table is wider than its container, the container becomes a focusable region named by the caption (or “Table”), so keyboard users can scroll it with the arrow keys. It shows the focus ring. New text `table.scrollRegion` in `Messages`: own message sets for other languages need it.

### Patch Changes

- 5f6b6e9: `BulkActionBar` on mobile shows 2 actions; with more, the first stays and “…” holds the rest. Before, 3 actions made the bar wider than a 375 px screen.
  - @med-o/design-tokens@0.3.0

## 0.2.0

### Minor Changes

- 893e4d2: Component styles sit in the cascade layer `components` (layer order `theme, base, components, utilities`, as in Tailwind v4). Your own CSS without a layer now always wins over the component styles, whatever its specificity; with Tailwind the utilities win too. If you overrode component styles with a higher specificity or `!important`, you can simplify those rules. New export `@med-o/ui/styles.min.css`: all component CSS in one minified file for pages without a bundler.
- f15fff2: Built-in texts in English and German. Close buttons, screen-reader names, announcements and validation messages follow the language of React Aria (`I18nProvider`, else the browser) – the same source as dates and numbers. **Behaviour change:** without an `I18nProvider`, users with a German browser now see German texts; pin the language with `<I18nProvider locale="en-US">` if your app is English only. Props like `closeLabel` or `texts` still win. New: `MessagesProvider` for own texts or other languages, `useMessages`, `enMessages`, `deMessages`, type `Messages`. `formatShortcut(keys, control)` takes the name of the Control key (“Strg” in German). English fixes: “Show 1 more level”, “1 character left”. The exported `default…Texts` stay English.
- be1add2: The overline text style is no longer uppercase: sentence case with normal tracking (`.medo-text-overline`, `--medo-typography-overline`). Navigation section titles follow. Capitals are harder to read; write the text in the case you want to show.
- 1299ff7: TextField: `label` is optional. Without it set `aria-label` – only where the context names the field (a table row, a filter bar), like Select and NumberField.

### Patch Changes

- Updated dependencies [be1add2]
- Updated dependencies [23fbda6]
  - @med-o/design-tokens@0.2.0
