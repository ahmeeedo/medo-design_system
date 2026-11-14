---
'@med-o/ui': minor
---

Smaller bundles and server rendering: the package ships one module per component instead of one file.

- `"use client"` sits only on the modules that need the browser. `Stack`, `Grid`, `GridItem`, `Container`, `Badge` and `Code` render in React Server Components and add no JavaScript there.
- Bundlers keep less unused code: on design.med-o.de a page loads 16 kB (gzip) less JavaScript.
- Nothing changes for imports: `import { Button } from '@med-o/ui'` stays the same.
- New size checks for a server layout (`Stack`, `Container`) and a typical client set (`Button`, `Select`, `QuickSearch`).
