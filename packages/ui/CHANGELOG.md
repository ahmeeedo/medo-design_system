# @med-o/ui

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
