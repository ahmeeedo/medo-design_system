---
'@med-o/ui': minor
---

Improved: `TextField` with `multiline` takes only the sizes `md` and `lg`.

A small box is too tight to write in. It already rendered as `md`; now TypeScript says so.

**Breaking (types only):** `<TextField multiline size="sm" />` no longer compiles.
Update: use `size="md"` – the field looks the same as before.
