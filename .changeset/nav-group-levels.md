---
'@med-o/ui': minor
---

New: `NavGroup` takes a second level in the sidebar and the sheet.

- A `NavGroup` inside a `NavGroup` indents one more step, like Components › Actions › Button.
- Both levels open by themselves when they hold the current page; a closed group shows “current”.
- Never deeper: a third level, or a nested group in the header, logs a warning in development. Header and rail stay one level.
