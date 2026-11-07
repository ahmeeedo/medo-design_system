---
'@med-o/design-tokens': minor
---

New: width tokens `size/width/3xs` to `size/width/6xl` (80 to 720 px).

- For what has a width of its own: floating layers, limits that cut long text and app regions. Components in the page take the width of their container.
- CSS `--medo-size-width-*`, JS and Figma variables; in Tailwind `max-w-(--medo-size-width-xl)`.
- Size tokens carry their Figma description.
