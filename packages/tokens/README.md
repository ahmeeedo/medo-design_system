# @med-o/design-tokens

Design tokens of the med.o Design System as CSS variables, text style classes, a Tailwind CSS v4 theme and JavaScript values. Works with any framework and plain HTML.

Documentation and live examples: **[design.med-o.de](https://design.med-o.de)**

## Install

```bash
npm install @med-o/design-tokens
```

## Use

```css
@import "@med-o/design-tokens/css/tokens.css";    /* variables --medo-*, Light + Dark */
@import "@med-o/design-tokens/css/typography.css"; /* optional: .medo-text-* classes */
@import "@med-o/design-tokens/css/base.css";       /* optional: page reset and body styles, without Tailwind */

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
@import "@med-o/design-tokens/css/tokens.css";
@import "@med-o/design-tokens/tailwind/theme.css";
```

JavaScript (resolved values):

```js
import { tokens } from '@med-o/design-tokens/js';
```

Light and Dark follow the operating system. Force a theme with `data-theme="light"` or `data-theme="dark"` on `<html>` or any element.

| Export | Contents |
| --- | --- |
| `@med-o/design-tokens/css/tokens.css` | CSS variables, Light + Dark, responsive layout tokens (short form: `/css`) |
| `@med-o/design-tokens/css/typography.css` | Text style classes `.medo-text-*` |
| `@med-o/design-tokens/css/base.css` | Page base for apps without Tailwind: no browser margins, `border-box`, page colors and text style on `body` |
| `@med-o/design-tokens/tailwind/theme.css` | Tailwind v4 theme on top of the variables (short form: `/tailwind`) |
| `@med-o/design-tokens/js` | Resolved values and TypeScript types |
| `@med-o/design-tokens/src/*` | Source tokens in the DTCG format |

## Spacing rules

The space between elements comes from one of six rules, never from a free number. The values follow the layout mode (px):

| Rule | Use for | Mobile · Tablet · Desktop |
| --- | --- | --- |
| `inline` | side by side in one group: buttons, tags, filters | 8 |
| `content` | inside one block: heading, text, actions | 16 |
| `fields` | form fields below each other | 16 · 24 · 24 |
| `items` | cards and tiles in a grid or list (= gutter) | 16 · 24 · 24 |
| `group` | groups inside a section: sub-sections, fieldsets | 32 · 40 · 48 |
| `section` | sections of a page | 48 · 64 · 96 |

Use them as CSS variables (`--medo-layout-gap-items`), as classes (`medo-gap-items`) or in Tailwind (`gap-items`, `space-y-fields`, `py-section`). With [`@med-o/ui`](https://www.npmjs.com/package/@med-o/ui) the layout components `Stack`, `Grid` and `Container` apply them for you.

## Versions

While the package is 0.x, a patch only fixes bugs and a minor may contain breaking changes – each marked **Breaking:** in the changelog, with how to update. `@med-o/design-tokens` and `@med-o/ui` are always released together with the same version.

[What's new](https://design.med-o.de/?path=/docs/what-s-new--docs) · [Versioning & support](https://design.med-o.de/?path=/docs/guides-versioning-support--docs)

## License

MIT
