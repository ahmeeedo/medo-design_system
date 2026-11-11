---
'@med-o/ui': patch
---

Fixed: three accessibility bugs, and a note in the Listbox docs.

- `IconButton` and `ToggleButton` render `aria-keyshortcuts` again. React Aria dropped it, so screen readers never heard the shortcut.
- `Option` with a description: label and description form the name together (“Team, Everyone in the design team”). The name now holds all visible text (WCAG 2.5.3), and axe no longer reports `label-content-name-mismatch`. Typeahead and the `Select` field still use the label alone.
- `QuickSearch` with an empty field and no suggestions no longer renders an empty, nameless `role="option"`.
- Listbox and Quick search docs: give each section and option a `key` equal to its `id`, and different ids to sections that replace each other.
