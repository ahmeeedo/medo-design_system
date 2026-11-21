---
'@med-o/ui': patch
---

Fixed: `Carousel` moves smoothly. Arrows, dots and the end of a mouse drag animate the row themselves, with an ease-out of 300 to 600 ms; the browser's smooth scrolling fought the snapping on the way and jumped at the end. A drag is thrown with the speed of the last moves and lands on the item nearest to where the throw ends, at most one viewport width away. Positions are read from the row itself, so a carousel further down a page no longer lands beside its items.
