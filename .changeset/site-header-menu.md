---
'@med-o/ui': minor
---

Improved: the fullscreen menu of `SiteHeader` closes when you choose a link, and takes free pinned actions and its own icon.

- **Fixed:** choosing a page, a link in `menuContent` or an action closes the menu. With a client-side router (Next.js) it stayed open after the page changed.
- `menuActions` pins free content at the bottom of the menu, after the actions of a list: a theme select, a feedback button.
- `menuIcon` sets the icon of the menu button below 768 px. Default: the menu (hamburger) icon.
