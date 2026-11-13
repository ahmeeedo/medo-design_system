---
'@med-o/ui': minor
---

New: a label beside the Select, a Popover that fits its content, and a Drawer without a visible header.

- `Select` takes `labelPosition="start"`: the label sits in a 64 px column next to the field, for compact settings such as a theme select. Helper and error text stay below the field. The layout class `medo-field--label-start` works on the other fields later too.
- `Popover` takes `size="fit"`: as wide as its content, with the padding of the other sizes, at most 400 px – for a short list of links.
- `Drawer` takes `hideHeader`: the content starts at the top, as in a navigation drawer. The title stays the dialog's name; Esc, a tap on the scrim and a swipe close it. Keep the header when the drawer holds a form.
