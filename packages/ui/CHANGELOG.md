# @med-o/ui

## 0.7.0

### Minor Changes

- 9d5c08f: `Dialog`, `AlertDialog` and `Popover`: a clear contract for a main action that returns a promise.

  - The dialog can be closed while it saves – without “Discard changes?”, the saving goes on.
  - New `primaryAction.backgroundToast: { success, error }`: when the result arrives after the dialog was closed, a Toast reports it. The error Toast stays and offers Retry, which runs `onAction` again.
  - Fixed: a result that arrives late no longer closes a dialog that was opened again in the meantime.
  - Fixed: a rejected promise while the dialog is open no longer leaves an unhandled error in the console; the dialog stays open as before.

- 89039dd: Dialog: `primaryAction.onAction` can reject with `FieldErrors`. While the dialog is open, the messages show at the fields and the focus goes to the first. If it was closed while saving, the error Toast offers “Open again” instead of Retry: the dialog opens with the messages at the fields (keep the values in your app – controlled fields). New `primaryAction.blocking`: the dialog cannot be closed while the action runs (Cancel and × disabled, Esc and the scrim do nothing) – for results people must see before they go on.

  **Breaking:** new built-in text `dialog.reopen`. If you pass your own language to `MessagesProvider`, add it.

- 89039dd: New `Form` and `FieldErrors`: React Aria Form with the error rules of the system. `onSave` runs only when every field is valid and keeps the form pending while it saves. Reject it with `FieldErrors` and the server's messages show at their fields (`new FieldErrors({ email: 'Already registered. Sign in instead.' })`); a problem of the whole form (`formError`, or the second argument of `FieldErrors`) shows as an Alert above the fields and takes the focus. Any other failure shows “Could not save” – the input always stays. On submit with errors the focus goes to the first invalid field and screen readers hear how many fields need attention. Messages passed as `validationErrors` (e.g. from a server action) are treated the same way.

  Fields: a message from `validate` or the server now wins over the general `errorMessage` of the field – before, “Enter a valid email address” hid “This email address is already registered”.

  **Breaking:** new built-in texts `form.errorCount` and `form.saveFailed`. If you pass your own language to `MessagesProvider`, add them – TypeScript names the missing texts.

- c2d7774: Full labels and fixed spacing:

  - Side navigation and Menu: long labels wrap instead of being cut – the whole name stays readable.
  - `Tag`: a label cut at 200 px shows in full in a tooltip on hover and keyboard focus (a tap focuses the tag); Esc hides it.
  - `Cell`: new `wrap={false}` (class `medo-table__cell--nowrap` for StaticTable) keeps IDs, dates and codes on one line; the table scrolls instead.
  - `Alert`: several paragraphs or a list in the description are always 8 px apart – before it was the browser's 1 em, or nothing under a CSS reset.
  - `Container`: fills the width up to its size also as a grid or flex item (inside a Stack it shrank to its content).
  - `SkipLink`: stays hidden until focused also inside a transformed parent (page transitions), where it peeked out before.

- 1cef34e: New `Stepper` and `Step`: where someone is in a task of several steps (checkout, sign-up). Done steps are links back (`href` or `onPress`), the current step has `aria-current="step"`, upcoming steps cannot be reached yet. Optional `description` per step. Below 640 px (`layout="auto"`): “Step 2 of 4”, the current step and one bar segment per step.

  **Breaking:** new built-in texts `stepper.label`, `stepper.count` and `stepper.completed`. If you pass your own language to `MessagesProvider`, add them – TypeScript names the missing texts.

- 1b1c95b: New exports `useMediaQuery` and `MOBILE_QUERY` (below 640 px): the same switch the components use, for app layouts that change with them – e.g. a side navigation that becomes a bottom tab bar.

### Patch Changes

- 89039dd: Long content: a Toast message wraps instead of being cut. Alert, field labels, help texts, error messages and the Stepper break long words and addresses (German compounds, email addresses) instead of widening the page at 320 px. Hidden texts in a table cell (`medo-visually-hidden`) no longer make the page scroll sideways.
- 1b1c95b: Forms keep their state when the window crosses 640 px (rotating a phone, resizing a window):

  - `Dialog`: typed input survives the switch between the centered and the fullscreen dialog. Before, the form inside was rebuilt and lost what was typed.
  - `Combobox` below 640 px (Bottom Sheet) behaves like the popover in a form: `isRequired` is checked on submit (message, focus on the field) and a form reset restores the default value.
  - German built-in text: the retry button of an upload tile is named “Hochladen von … wiederholen”, so its name contains the visible “Wiederholen” (WCAG 2.5.3).

- @med-o/design-tokens@0.7.0

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
