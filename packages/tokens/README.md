# @medo/design-tokens

Design tokens of the med.o Design System as CSS variables, text style classes, a Tailwind CSS v4 theme and JavaScript values. Works with any framework and plain HTML.

Documentation and live examples: **[design.med-o.de](https://design.med-o.de)**

## Install

```bash
npm install @medo/design-tokens
```

## Use

```css
@import "@medo/design-tokens/css";               /* variables --medo-*, Light + Dark */
@import "@medo/design-tokens/css/typography.css"; /* optional: .medo-text-* classes */

.card {
  background: var(--medo-color-surface-raised);
  color: var(--medo-color-text-primary);
  padding: var(--medo-space-6);
  border-radius: var(--medo-radius-lg);
}
```

Tailwind CSS v4:

```css
@import "tailwindcss";
@import "@medo/design-tokens/css";
@import "@medo/design-tokens/tailwind";
```

JavaScript (resolved values):

```js
import { tokens } from '@medo/design-tokens/js';
```

Light and Dark follow the operating system. Force a theme with `data-theme="light"` or `data-theme="dark"` on `<html>` or any element.

| Export | Contents |
| --- | --- |
| `@medo/design-tokens/css` | CSS variables, Light + Dark, responsive layout tokens |
| `@medo/design-tokens/css/typography.css` | Text style classes `.medo-text-*` |
| `@medo/design-tokens/tailwind` | Tailwind v4 theme on top of the variables |
| `@medo/design-tokens/js` | Resolved values and TypeScript types |
| `@medo/design-tokens/src/*` | Source tokens in the DTCG format |

## License

MIT
