# @med-o/ui

## 0.7.0

_Released 2026-11-03_

### Minor Changes

- 89039dd: New: `Form` and `FieldErrors` – forms with the error rules of the system.

  - `onSave` runs only when every field is valid and keeps the form pending while it saves.
  - Reject it with `FieldErrors` and the server's messages show at their fields: `new FieldErrors({ email: 'Already registered. Sign in instead.' })`.
  - A problem of the whole form (`formError`, or the second argument of `FieldErrors`) shows as an Alert above the fields and takes the focus.
  - Any other failure shows “Could not save” – the input always stays.
  - On submit with errors the focus goes to the first invalid field; screen readers hear how many fields need attention.
  - Messages passed as `validationErrors` (e.g. from a server action) are treated the same way.

  **Breaking:** new built-in texts `form.errorCount` and `form.saveFailed`.
  Update: if you pass your own language to `MessagesProvider`, add them – TypeScript names the missing texts.

- 1cef34e: New: `Stepper` and `Step` show where someone is in a task of several steps (checkout, sign-up).

  - Done steps are links back (`href` or `onPress`); the current step has `aria-current="step"`; upcoming steps cannot be reached yet.
  - Optional `description` per step.
  - Below 640 px (`layout="auto"`): “Step 2 of 4”, the current step and one bar segment per step.

  **Breaking:** new built-in texts `stepper.label`, `stepper.count` and `stepper.completed`.
  Update: if you pass your own language to `MessagesProvider`, add them – TypeScript names the missing texts.

- 1b1c95b: New: `useMediaQuery` and `MOBILE_QUERY` (below 640 px) – the same switch the components use.

  For app layouts that change with the components, e.g. a side navigation that becomes a bottom tab bar.

- 9d5c08f: Improved: `Dialog`, `AlertDialog` and `Popover` have a clear contract for a main action that returns a promise.

  - The dialog can be closed while it saves – without “Discard changes?”; the saving goes on.
  - New `primaryAction.backgroundToast: { success, error }`: when the result arrives after the dialog was closed, a Toast reports it. The error Toast stays and offers Retry, which runs `onAction` again.

- 89039dd: Improved: `Dialog` shows the server's messages at its fields, and can block closing while it saves.

  - `primaryAction.onAction` can reject with `FieldErrors`. While the dialog is open, the messages show at the fields and the focus goes to the first.
  - Closed while saving: the error Toast offers “Open again” instead of Retry. The dialog opens with the messages at the fields – keep the values in your app (controlled fields).
  - New `primaryAction.blocking`: the dialog cannot be closed while the action runs (Cancel and × disabled, Esc and the scrim do nothing) – for results people must see before they go on.

  **Breaking:** new built-in text `dialog.reopen`.
  Update: if you pass your own language to `MessagesProvider`, add it.

- c2d7774: Improved: `NavItem` and `MenuItem` wrap long labels instead of cutting them.

  Side navigation and Menu: the whole name stays readable.

- c2d7774: Improved: `Tag` shows a label cut at 200 px in full in a tooltip.

  On hover and keyboard focus; a tap focuses the tag; Esc hides it.

- c2d7774: Improved: `Cell` keeps IDs, dates and codes on one line with `wrap={false}`.

  The table scrolls instead. For `StaticTable` use the class `medo-table__cell--nowrap`.

- 9d5c08f: Fixed: `Dialog` results that arrive late no longer close a dialog that was opened again in the meantime.

- 9d5c08f: Fixed: `Dialog` no longer leaves an unhandled error in the console when the promise rejects while it is open.

  The dialog stays open, as before.

- 89039dd: Fixed: `TextField` shows a message from `validate` or the server instead of its general `errorMessage`.

  Before, “Enter a valid email address” hid “This email address is already registered”.

- c2d7774: Fixed: `Alert` keeps several paragraphs or a list in the description 8 px apart.

  Before it was the browser's 1 em, or nothing under a CSS reset.

- c2d7774: Fixed: `Container` fills the width up to its size also as a grid or flex item.

  Inside a `Stack` it shrank to its content.

- c2d7774: Fixed: `SkipLink` stays hidden until focused, also inside a transformed parent.

  With page transitions it peeked out before.

### Patch Changes

- 89039dd: Fixed: `Toast` messages wrap instead of being cut.

- 89039dd: Fixed: `Alert`, `TextField` and `Stepper` break long words instead of widening the page at 320 px.

  Field labels, help texts and error messages break German compounds and email addresses.

- 89039dd: Fixed: hidden texts in a `StaticTable` cell (`medo-visually-hidden`) no longer make the page scroll sideways.

- 1b1c95b: Fixed: `Dialog` keeps what was typed when the window crosses 640 px.

  Rotating a phone or resizing a window switches between the centered and the fullscreen dialog. Before, the form inside was rebuilt and lost the input.

- 1b1c95b: Fixed: `Combobox` below 640 px (Bottom Sheet) behaves like the popover in a form.

  - `isRequired` is checked on submit: message, focus on the field.
  - A form reset restores the default value.

- 1b1c95b: Fixed: `Upload` names its German retry button “Hochladen von … wiederholen”.

  The name contains the visible “Wiederholen” (WCAG 2.5.3).

- @med-o/design-tokens@0.7.0

## 0.6.0

_Released 2026-11-01_

### Minor Changes

- 3653bdb: Improved: `Combobox` and `Select` say “Loading…” and “read only” in the app's language.

  Both come from the built-in texts now: German “Wird geladen…” and “schreibgeschützt”. Also in the Bottom Sheet on mobile.

  **Breaking:** new built-in text `common.readOnly`.
  Update: if you pass your own language to `MessagesProvider`, add it, e.g. `readOnly: 'lecture seule'` – TypeScript names the missing text.

### Patch Changes

- Updated dependencies [3653bdb]
  - @med-o/design-tokens@0.6.0

## 0.5.1

_Released 2026-11-01_

### Patch Changes

- 725776a: Fixed: `EmbedConsent` hands the focus to the loaded iframe in Firefox too.

  After “Load”, keyboard users land in the content instead of at the top of the page – like in the other browsers.

- @med-o/design-tokens@0.5.1

## 0.5.0

_Released 2026-11-01_

### Minor Changes

- 2151054: Improved: `TextField` and the other fields never show an empty error.

  - Without an error message an invalid field keeps its helper text instead of an icon alone.
  - In development a warning names the missing `errorMessage`.

- 2151054: New: `Checkbox` gets `errorMessage` for a single checkbox.

  E.g. “Accept the terms to continue.” In a `CheckboxGroup` the group has the message.

### Patch Changes

- Updated dependencies [2151054]
  - @med-o/design-tokens@0.5.0

## 0.4.2

_Released 2026-11-01_

### Patch Changes

- 49f8981: Improved: the package README on npm covers the spacing rules and layout components.

  Also supported browsers, versions and where to find the changelog.

- Updated dependencies [49f8981]
  - @med-o/design-tokens@0.4.2

## 0.4.1

_Released 2026-10-31_

### Patch Changes

- 3db301f: Fixed: `ListView` cards follow the spacing rule `items`.

  With `variant="cards"`: 16 · 24 · 24 px apart (before 12 px).

- 3db301f: Fixed: the buttons of `EmbedConsent` are `inline` apart.

  8 px (before 16 px horizontal).

- @med-o/design-tokens@0.4.1

## 0.4.0

_Released 2026-10-31_

### Minor Changes

- d1ca3a6: New: six spacing rules for the space between elements.

  - `inline`, `content`, `fields`, `items`, `group`, `section` – as tokens `--medo-layout-gap-*` that follow the layout mode (mobile · tablet · desktop).
  - As Tailwind utilities (`gap-items`, `space-y-fields`, `py-section` …) and as classes (`medo-gap-items`).
  - `ButtonGroup` uses the rule `inline` (same value as before).

- d1ca3a6: New: layout components `Stack`, `Grid`, `GridItem` and `Container`.

  - `Stack`: vertical with the rule `content`, horizontal with `inline`.
  - `Grid`: as many columns as fit, fixed columns or the 4 · 8 · 12 layout grid; gap `items`.
  - `Container`: content width plus page margin.

### Patch Changes

- Updated dependencies [d1ca3a6]
  - @med-o/design-tokens@0.4.0

## 0.3.0

_Released 2026-10-30_

### Minor Changes

- e4a8577: Improved: a wide `StaticTable` can be scrolled with the keyboard.

  When the table is wider than its container, the container becomes a focusable region named by the caption (or “Table”). Keyboard users scroll it with the arrow keys; it shows the focus ring.

  **Breaking:** new built-in text `table.scrollRegion`.
  Update: if you pass your own language to `MessagesProvider`, add it.

### Patch Changes

- 5f6b6e9: Fixed: `BulkActionBar` fits a 375 px screen with 3 or more actions.

  On mobile it shows 2 actions; with more, the first stays and “…” holds the rest.

- @med-o/design-tokens@0.3.0

## 0.2.0

_Released 2026-10-28_

### Minor Changes

- f15fff2: New: built-in texts in English and German.

  - Close buttons, screen-reader names, announcements and validation messages follow the language of React Aria (`I18nProvider`, else the browser) – the same source as dates and numbers.
  - Props like `closeLabel` or `texts` still win.
  - New: `MessagesProvider` for own texts or other languages, `useMessages`, `enMessages`, `deMessages`, type `Messages`.
  - `formatShortcut(keys, control)` takes the name of the Control key (“Strg” in German).
  - English fixes: “Show 1 more level”, “1 character left”. The exported `default…Texts` stay English.

  **Breaking:** without an `I18nProvider`, users with a German browser now see German texts.
  Update: if your app is English only, pin the language with `<I18nProvider locale="en-US">`.

- 893e4d2: Improved: component styles sit in the cascade layer `components`.

  - Layer order `theme, base, components, utilities`, as in Tailwind v4.
  - Your own CSS without a layer now always wins over the component styles, whatever its specificity; with Tailwind the utilities win too.
  - If you overrode component styles with a higher specificity or `!important`, you can simplify those rules.
  - New export `@med-o/ui/styles.min.css`: all component CSS in one minified file for pages without a bundler.

- be1add2: Improved: the overline text style is no longer uppercase.

  Sentence case with normal tracking (`.medo-text-overline`, `--medo-typography-overline`); navigation section titles follow. Capitals are harder to read – write the text in the case you want to show.

- 1299ff7: Improved: `TextField` works without a visible `label`.

  Then set `aria-label` – only where the context names the field (a table row, a filter bar), like `Select` and `NumberField`.

### Patch Changes

- Updated dependencies [be1add2]
- Updated dependencies [23fbda6]
  - @med-o/design-tokens@0.2.0
