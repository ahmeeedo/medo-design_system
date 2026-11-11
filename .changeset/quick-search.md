---
'@med-o/ui': minor
---

New: `QuickSearchTrigger`, a loading state for `QuickSearch`, and Esc always closes it.

- `QuickSearchTrigger` is a button in the Input look that opens Quick search: search icon, placeholder and the shortcut hint (⌘ K on Apple, Ctrl K elsewhere). The shortcut is on the button as `aria-keyshortcuts`. Status: experimental.
- `QuickSearch` takes `isLoading` and `loadingLabel`. A loading row shows below the list, earlier results stay, and the result region is `aria-busy`. “No results” never shows while it loads.
- Esc closes `QuickSearch` at once, also with text in the field, as the footer hint says. The × in the field clears the text.
- `ListBoxMessage` takes `loading` and shows the Spinner before the text. `Combobox` uses it for its loading row.
