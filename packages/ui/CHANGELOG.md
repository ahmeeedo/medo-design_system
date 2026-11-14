# @med-o/ui

## 0.18.0

_Released 2026-11-13_

### Minor Changes

- 96a276d: New: `@med-o/ui/manifest.json`, a description of every component with a docs page, for documentation sites and tools.

  - Per component: status, Storybook id, Figma link, props with type, default and description, the Playground controls, and the usage, accessibility and styling notes of its docs page.
  - The descriptions are the ones Storybook shows: JSDoc first, then the shared texts for React Aria props.
  - `Popover`: `cancelLabel` has a description.

### Patch Changes

- @med-o/design-tokens@0.18.0

## 0.17.0

_Released 2026-11-13_

### Minor Changes

- 76e67c4: New: a label beside the Select, a Popover that fits its content, and a Drawer without a visible header.

  - `Select` takes `labelPosition="start"`: the label sits in a 64 px column next to the field, for compact settings such as a theme select. Helper and error text stay below the field. The layout class `medo-field--label-start` works on the other fields later too.
  - `Popover` takes `size="fit"`: as wide as its content, with the padding of the other sizes, at most 400 px – for a short list of links.
  - `Drawer` takes `hideHeader`: the content starts at the top, as in a navigation drawer. The title stays the dialog's name; Esc, a tap on the scrim and a swipe close it. Keep the header when the drawer holds a form.

- c8693cd: New: a status badge for nav items and a filter field for long navigation trees.

  - `NavItem` takes `badge`: a Badge (size sm) after the label in the sidebar and the sheet, for example the status of a page that is not Stable. It is part of the link's name ("Slider, Beta") and hidden in the rail and the header.
  - `NavList` and `SideNav` take `filter`: a field above the tree ("Filter this menu"). Typing hides items that do not match – case and accents do not count –, opens groups with a match and shows a whole group when its own label matches. When nothing matches, a status says "No pages match". Esc or × clears the field.
  - `SearchField` takes `icon` for another icon than the magnifier, such as the funnel of a filter.
  - New messages `navigation.filter` and `navigation.noMatch` (en, de).

- 949bb49: New: text color classes and `medo-prose` for long text.

  - `@med-o/design-tokens`: one class per `text/*` color token in `css/typography.css`, such as `medo-text-secondary` or `medo-text-brand`. Combine it with a text style: `class="medo-text-body-sm medo-text-secondary"`. Hover and pressed tones get no class.
  - `@med-o/ui`: `medo-prose` styles long text from plain HTML or MDX – docs pages, legal texts, help articles. Headings, paragraphs and lists get their text styles and the spacing rules; plain lists, links and inline code look like List, Link and Code. Elements with a class keep their own look.

### Patch Changes

- Updated dependencies [949bb49]
  - @med-o/design-tokens@0.17.0

## 0.16.0

_Released 2026-11-13_

### Minor Changes

- add2867: Improved: the fullscreen menu of `SiteHeader` closes when you choose a link, and takes free pinned actions and its own icon.

  - **Fixed:** choosing a page, a link in `menuContent` or an action closes the menu. With a client-side router (Next.js) it stayed open after the page changed.
  - `menuActions` pins free content at the bottom of the menu, after the actions of a list: a theme select, a feedback button.
  - `menuIcon` sets the icon of the menu button below 768 px. Default: the menu (hamburger) icon.

### Patch Changes

- @med-o/design-tokens@0.16.0

## 0.15.0

_Released 2026-11-11_

### Minor Changes

- 4f0c310: New: `QuickSearchTrigger`, a loading state for `QuickSearch`, and Esc always closes it.

  - `QuickSearchTrigger` is a button in the Input look that opens Quick search: search icon, placeholder and the shortcut hint (⌘ K on Apple, Ctrl K elsewhere). The shortcut is on the button as `aria-keyshortcuts`. Status: experimental.
  - `QuickSearch` takes `isLoading` and `loadingLabel`. A loading row shows below the list, earlier results stay, and the result region is `aria-busy`. “No results” never shows while it loads.
  - Esc closes `QuickSearch` at once, also with text in the field, as the footer hint says. The × in the field clears the text.
  - `ListBoxMessage` takes `loading` and shows the Spinner before the text. `Combobox` uses it for its loading row.

### Patch Changes

- @med-o/design-tokens@0.15.0

## 0.14.0

_Released 2026-11-11_

### Minor Changes

- f5cd685: New: `SiteHeader` takes centered links, free actions and extra menu sections. `Button` and `NavItem` link to other sites.

  - `SiteHeader` switches to the menu button in CSS at 768 px. Static pages no longer jump from the desktop header to the mobile one when JavaScript loads. `layout="desktop" | "mobile"` still forces one, for previews.
  - `SiteHeader`: `align="center"` puts the links in the middle. `actions` takes any content as well as a list. `compactActions` stay next to the menu button below 768 px. `menuContent` adds sections to the fullscreen menu.
  - `useScrolled` is exported, for your own sticky header.
  - `Button` with `href` renders a link in the button look. With `target="_blank"` it adds `rel="noopener noreferrer"` and a hidden “(opens in a new tab)”.
  - `NavItem` takes an `endIcon` after the label, next to `icon` before it. With `target="_blank"` it adds the same rel and hidden text.
  - New message `common.newTab` (en, de). `Link` uses it too, so its hidden new-tab text is now translated.

### Patch Changes

- @med-o/design-tokens@0.14.0

## 0.13.1

_Released 2026-11-11_

### Patch Changes

- fe26504: Fixed: three accessibility bugs, and a note in the Listbox docs.

  - `IconButton` and `ToggleButton` render `aria-keyshortcuts` again. React Aria dropped it, so screen readers never heard the shortcut.
  - `Option` with a description: label and description form the name together (“Team, Everyone in the design team”). The name now holds all visible text (WCAG 2.5.3), and axe no longer reports `label-content-name-mismatch`. Typeahead and the `Select` field still use the label alone.
  - `QuickSearch` with an empty field and no suggestions no longer renders an empty, nameless `role="option"`.
  - Listbox and Quick search docs: give each section and option a `key` equal to its `id`, and different ids to sections that replace each other.

- @med-o/design-tokens@0.13.1

## 0.13.0

_Released 2026-11-10_

### Minor Changes

- e6c5e77: New: `Code` and the class `medo-code` mark a short piece of code inside running text.

  - The size follows the text around it (0.875em), so one class fits every text size.
  - `translate="no"` keeps browser translation away from the code. `CodeBlock` sets it as well now.
  - Long values break anywhere, so they never widen the page.
  - Status: experimental.

### Patch Changes

- @med-o/design-tokens@0.13.0

## 0.12.0

_Released 2026-11-10_

### Minor Changes

- 387b411: New: `NavGroup` takes a second level in the sidebar and the sheet.

  - A `NavGroup` inside a `NavGroup` indents one more step, like Components › Actions › Button.
  - Both levels open by themselves when they hold the current page; a closed group shows “current”.
  - Never deeper: a third level, or a nested group in the header, logs a warning in development. Header and rail stay one level.

- d2be8b3: New: `OnThisPage` links to the sections of a long page.

  - `variant="rail"` sits next to the content and marks the section in view with `aria-current="location"`.
  - `variant="disclosure"` is the same list behind a button for small screens. It closes after a jump.
  - Links are plain `#id` anchors. A jump scrolls smoothly (unless reduced motion is on), moves focus to the section and updates the address.
  - Status: experimental.

### Patch Changes

- @med-o/design-tokens@0.12.0

## 0.11.0

_Released 2026-11-10_

### Patch Changes

- 171a142: Fixed: both packages include their `CHANGELOG.md`.

  What changed in each version now ships with the code you install, in `node_modules/@med-o/ui/CHANGELOG.md` and `node_modules/@med-o/design-tokens/CHANGELOG.md`.

- Updated dependencies [68e203d]
- Updated dependencies [171a142]
  - @med-o/design-tokens@0.11.0

## 0.10.0

_Released 2026-11-09_

### Minor Changes

- b2bbbb4: New: `CodeBlock` and `CodeBlockTabs` show code to read and copy.

  - Optional title (file name or language) as `figcaption`, or tabs for variants such as npm, pnpm and yarn.
  - Copy button with a visible label. “Copied” is announced; if the browser blocks the clipboard, the message says how to copy by hand.
  - Line numbers and highlighted lines are CSS – they are not copied and not read.
  - Long lines scroll. The code area then becomes a focusable, named region.
  - Syntax colors: `highlight(code, language)` from the new entry `@med-o/ui/highlight`. It uses Shiki (optional peer dependency) and runs at build time or in a server component, so no highlighting code reaches the browser.

  **Breaking:** new built-in texts `codeBlock.copy`, `codeBlock.copied`, `codeBlock.copyFailed` and `codeBlock.label`.
  Update: if you pass your own language to `MessagesProvider`, add them.

### Patch Changes

- Updated dependencies [b2bbbb4]
  - @med-o/design-tokens@0.10.0

## 0.9.0

_Released 2026-11-08_

### Minor Changes

- 09348da: Improved: `TextField` with `multiline` takes only the sizes `md` and `lg`.

  A small box is too tight to write in. It already rendered as `md`; now TypeScript says so.

  **Breaking (types only):** `<TextField multiline size="sm" />` no longer compiles.
  Update: use `size="md"` – the field looks the same as before.

### Patch Changes

- @med-o/design-tokens@0.9.0

## 0.8.1

_Released 2026-11-08_

### Patch Changes

- 85616ce: Improved: every prop has a description – on the docs pages and in your editor.

  - Texts such as `cancelLabel`, `moreLabel`, `pageSizeOptions`, `density` or the `Upload` callbacks are described in the types.
  - Card and Side navigation describe their current widths (200 px media, 280 px).

- @med-o/design-tokens@0.8.1

## 0.8.0

_Released 2026-11-07_

### Minor Changes

- ef97ec8: Improved: components take the width of their container; fixed widths come from the width tokens.

  - `DateField`, `DateRangePicker`, `TimeField` and `Calendar` fill their container (before a minimum width per variant). Date presets size to their text.
  - `EmptyState` and the text of `EmbedConsent` use the full width; illustrations keep their shape with an aspect ratio.
  - `DescriptionList`: the term column takes a third.
  - Rounded to the scale: Side navigation 280 px (before 256), toasts at least 280 px (288), `Menu` at least 200 px (180), Quick search up to 560 px high (576), search thumbnails 120 px (128), horizontal `Card` media 200 px (180), `Grid` columns at least 240 px (256), `Slider` and `Pagination` number fields 80 px.

  Check: a date field or empty state inside a wide container is now as wide as it. Put it in a narrower container (`Container`, `Grid`, a form column) where it should be smaller.

### Patch Changes

- Updated dependencies [ef97ec8]
  - @med-o/design-tokens@0.8.0

## 0.7.2

_Released 2026-11-07_

### Patch Changes

- d62706f: Improved: `Button` is Stable.

  It passes the whole checklist, including the manual test with NVDA, VoiceOver and TalkBack – the results are in the Accessibility section of its page.

- @med-o/design-tokens@0.7.2

## 0.7.1

_Released 2026-11-07_

### Patch Changes

- 370e2cd: Improved: `TextField` follows the state contract – other frameworks and static previews set `data-hovered` and `data-focused` on `medo-input`.

  - `aria-invalid="true"` on the control shows the invalid border too, like `data-invalid`.
  - `Button`, `Checkbox` and `TextField` describe every prop in the docs.
  - The focus outline in high contrast mode (`forced-colors`) uses the spacing token `space/0-5` as offset instead of a fixed 2 px – same look.

- @med-o/design-tokens@0.7.1

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
