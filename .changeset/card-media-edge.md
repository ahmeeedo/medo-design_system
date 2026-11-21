---
'@med-o/ui': patch
---

Fixed: an `Image` in a `Card`'s media keeps no radius of its own. The card rounds the outer corners, and the edge towards the content stays square, whatever the image's `radius` prop says – before, the default radius/md rounded the image's bottom corners above the title.
