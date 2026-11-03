---
'@med-o/ui': minor
---

Full labels and fixed spacing:

- Side navigation and Menu: long labels wrap instead of being cut – the whole name stays readable.
- `Tag`: a label cut at 200 px shows in full in a tooltip on hover and keyboard focus (a tap focuses the tag); Esc hides it.
- `Cell`: new `wrap={false}` (class `medo-table__cell--nowrap` for StaticTable) keeps IDs, dates and codes on one line; the table scrolls instead.
- `Alert`: several paragraphs or a list in the description are always 8 px apart – before it was the browser's 1 em, or nothing under a CSS reset.
- `Container`: fills the width up to its size also as a grid or flex item (inside a Stack it shrank to its content).
- `SkipLink`: stays hidden until focused also inside a transformed parent (page transitions), where it peeked out before.
