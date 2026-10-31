---
"@med-o/design-tokens": minor
"@med-o/ui": minor
---

Spacing rules and layout components. Six rules for the space between elements – `inline`, `content`, `fields`, `items`, `group`, `section` – as tokens `--medo-layout-gap-*` that follow the layout mode (mobile · tablet · desktop), as Tailwind utilities (`gap-items`, `space-y-fields`, `py-section` …) and as classes (`medo-gap-items`). New components `Stack` (vertical `content`, horizontal `inline`), `Grid` (as many columns as fit, fixed columns or the 4 · 8 · 12 layout grid, gap `items`), `GridItem` and `Container` (content width plus page margin). `ButtonGroup` uses the rule `inline` (same value as before).
