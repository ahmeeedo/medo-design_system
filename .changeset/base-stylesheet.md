---
'@med-o/design-tokens': minor
---

New: `css/base.css` sets up the page for apps without Tailwind.

- Removes the browser margins and sizes every box with its padding and border (`border-box`).
- Gives `body` the canvas color, the primary text color and the text style body/md, in Light and Dark.
- Sits in the cascade layer `base`, so component styles, Tailwind utilities and your own CSS always win.
- Import it after `tokens.css`: `@import "@med-o/design-tokens/css/base.css";`
