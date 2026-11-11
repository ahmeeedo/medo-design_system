---
'@med-o/ui': minor
---

New: `SiteHeader` takes centered links, free actions and extra menu sections. `Button` and `NavItem` link to other sites.

- `SiteHeader` switches to the menu button in CSS at 768 px. Static pages no longer jump from the desktop header to the mobile one when JavaScript loads. `layout="desktop" | "mobile"` still forces one, for previews.
- `SiteHeader`: `align="center"` puts the links in the middle. `actions` takes any content as well as a list. `compactActions` stay next to the menu button below 768 px. `menuContent` adds sections to the fullscreen menu.
- `useScrolled` is exported, for your own sticky header.
- `Button` with `href` renders a link in the button look. With `target="_blank"` it adds `rel="noopener noreferrer"` and a hidden “(opens in a new tab)”.
- `NavItem` takes an `endIcon` after the label, next to `icon` before it. With `target="_blank"` it adds the same rel and hidden text.
- New message `common.newTab` (en, de). `Link` uses it too, so its hidden new-tab text is now translated.
