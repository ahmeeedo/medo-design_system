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

## License

MIT
