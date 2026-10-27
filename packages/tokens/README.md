# @med-o/design-tokens

Design tokens of the med.o Design System as CSS variables, text style classes, a Tailwind CSS v4 theme and JavaScript values. Works with any framework and plain HTML.

Documentation and live examples: **[design.med-o.de](https://design.med-o.de)**

## Install

```bash
npm install @med-o/design-tokens
```

## Use

```css
@import "@med-o/design-tokens/css";               /* variables --medo-*, Light + Dark */
@import "@med-o/design-tokens/css/typography.css"; /* optional: .medo-text-* classes */

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
@import "@med-o/design-tokens/css";
@import "@med-o/design-tokens/tailwind";
```

JavaScript (resolved values):

```js
import { tokens } from '@med-o/design-tokens/js';
```

Light and Dark follow the operating system. Force a theme with `data-theme="light"` or `data-theme="dark"` on `<html>` or any element.

| Export | Contents |
| --- | --- |
| `@med-o/design-tokens/css` | CSS variables, Light + Dark, responsive layout tokens |
| `@med-o/design-tokens/css/typography.css` | Text style classes `.medo-text-*` |
| `@med-o/design-tokens/tailwind` | Tailwind v4 theme on top of the variables |
| `@med-o/design-tokens/js` | Resolved values and TypeScript types |
| `@med-o/design-tokens/src/*` | Source tokens in the DTCG format |

## License

MIT
