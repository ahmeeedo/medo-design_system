---
'@med-o/ui': minor
---

New: `Carousel` (experimental), the code side of the Figma Carousel.

- `layout="single"` shows one slide at a time (media), `layout="row"` a row of items with the next one peeking in (cards, editorial, portrait). `variant` base or aesthetic, `itemSize` sm, md, lg, an optional title and “View all” link.
- W3C carousel pattern on native scroll snapping: Previous and Next disabled at the ends (no loop), dots up to 7 slides and a counter above, items out of view are inert, changes by the user are announced.
- `autoplay` only for heroes: at least 5 s per slide, with Pause; it pauses on hover, focus and in a hidden tab, stops on the last slide and stays off with reduced motion.
- Touch screens get no arrows: swipe; dots keep a 24 px hit area.
- New messages `carousel.*` (en, de).
- The style budget grows from 23 to 24 kB (Carousel and the content table).
