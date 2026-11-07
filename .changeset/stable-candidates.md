---
'@med-o/ui': patch
---

Improved: `TextField` follows the state contract – other frameworks and static previews set `data-hovered` and `data-focused` on `medo-input`.

- `aria-invalid="true"` on the control shows the invalid border too, like `data-invalid`.
- `Button`, `Checkbox` and `TextField` describe every prop in the docs.
- The focus outline in high contrast mode (`forced-colors`) uses the spacing token `space/0-5` as offset instead of a fixed 2 px – same look.
