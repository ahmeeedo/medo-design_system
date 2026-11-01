# @med-o/ui

Accessible React components of the med.o Design System. Behaviour comes from [React Aria Components](https://react-spectrum.adobe.com/react-aria/) (keyboard, focus, screen readers, touch), the look from plain CSS on top of [`@med-o/design-tokens`](https://www.npmjs.com/package/@med-o/design-tokens). Target: WCAG 2.2 AA, Light and Dark.

Documentation, playground and all components: **[design.med-o.de](https://design.med-o.de)**

## Install

```bash
npm install @med-o/ui @med-o/design-tokens
```

Requires React 19.

## Use

Import the styles once, for example in your app entry:

```tsx
import '@med-o/design-tokens/css';
import '@med-o/ui/styles.css';
```

Then use the components:

```tsx
import { Button, TextField } from '@med-o/ui';

<TextField label="Email" type="email" isRequired />
<Button onPress={save}>Save</Button>
```

React Aria naming: `onPress` instead of `onClick`, `isDisabled` instead of `disabled`, `isInvalid`, `isRequired`, `isReadOnly`.

The package is ESM only and marked `"use client"`, so it works in the Next.js App Router as a client component.

## Layout

`Container`, `Stack` and `Grid` apply the spacing rules of `@med-o/design-tokens` – no spacing value is chosen by hand:

```tsx
import { Card, Container, Grid, Stack } from '@med-o/ui';

<Container as="main">
  <Stack gap="section">
    <Stack as="section">
      <h2>Projects</h2>
      <Grid>
        <Card title="Roadmap 2027">Shared with 4 people.</Card>
        <Card title="Q4 budget">Shared with 2 people.</Card>
      </Grid>
    </Stack>
  </Stack>
</Container>
```

`Container` sets the content width and the page margin, `Stack` the space between blocks (`content`, or any rule with `gap`), `Grid` as many columns as fit with the gap `items`.

## Support and versions

| Chrome, Edge | Safari (macOS, iOS) | Firefox | Samsung Internet |
| --- | --- | --- | --- |
| 117 | 17.5 | 129 | 24 |

Older browsers still work, without a few enhancements. Requires React 19; ESM only. Accessibility target WCAG 2.2 AA – please report a violation as a GitHub issue.

While the package is 0.x, a patch only fixes bugs and a minor may contain breaking changes – each marked **Breaking:** in the changelog, with how to update. `@med-o/ui` and `@med-o/design-tokens` are always released together with the same version.

[What's new](https://design.med-o.de/?path=/docs/what-s-new--docs) · [Versioning & support](https://design.med-o.de/?path=/docs/guides-versioning-support--docs)

## License

MIT
