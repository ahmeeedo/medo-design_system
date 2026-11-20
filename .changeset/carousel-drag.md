---
'@med-o/ui': minor
---

- `Carousel`: a mouse drags the row. Snapping settles the position on release, and a drag does not open the card under it. Controls inside (sliders, fields) keep their pointer.
- `Carousel` takes `bleed`: in a full-width area with the page margin as its padding, the row runs to the edge of the screen and the screen cuts the items; header and footer keep the page container width.
- `IconButton` takes `href`, `target`, `rel` and `newTabLabel`, like Button: a link in the icon button look, with the tooltip; a new tab is part of its name.
- `Container` takes `align="start"`: the content sits at the page margin instead of the middle, like a page next to a sidebar.
