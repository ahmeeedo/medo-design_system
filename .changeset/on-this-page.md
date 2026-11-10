---
'@med-o/ui': minor
---

New: `OnThisPage` links to the sections of a long page.

- `variant="rail"` sits next to the content and marks the section in view with `aria-current="location"`.
- `variant="disclosure"` is the same list behind a button for small screens. It closes after a jump.
- Links are plain `#id` anchors. A jump scrolls smoothly (unless reduced motion is on), moves focus to the section and updates the address.
- Status: experimental.
