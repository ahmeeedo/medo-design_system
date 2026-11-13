---
'@med-o/ui': minor
---

New: a status badge for nav items and a filter field for long navigation trees.

- `NavItem` takes `badge`: a Badge (size sm) after the label in the sidebar and the sheet, for example the status of a page that is not Stable. It is part of the link's name ("Slider, Beta") and hidden in the rail and the header.
- `NavList` and `SideNav` take `filter`: a field above the tree ("Filter this menu"). Typing hides items that do not match – case and accents do not count –, opens groups with a match and shows a whole group when its own label matches. When nothing matches, a status says "No pages match". Esc or × clears the field.
- `SearchField` takes `icon` for another icon than the magnifier, such as the funnel of a filter.
- New messages `navigation.filter` and `navigation.noMatch` (en, de).
