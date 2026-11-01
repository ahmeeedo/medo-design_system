---
'@med-o/ui': minor
---

`Combobox` (Bottom Sheet on mobile) and `Select`: “Loading…” and the hidden “read only” come from the built-in texts now, so they follow the language – German “Wird geladen…” and “schreibgeschützt”.

**Breaking:** new built-in text `common.readOnly`. If you pass your own language to `MessagesProvider`, add it, e.g. `readOnly: 'lecture seule'` – TypeScript names the missing text.
