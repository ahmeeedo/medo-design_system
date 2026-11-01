---
'@med-o/ui': patch
---

Forms keep their state when the window crosses 640 px (rotating a phone, resizing a window):

- `Dialog`: typed input survives the switch between the centered and the fullscreen dialog. Before, the form inside was rebuilt and lost what was typed.
- `Combobox` below 640 px (Bottom Sheet) behaves like the popover in a form: `isRequired` is checked on submit (message, focus on the field) and a form reset restores the default value.
- German built-in text: the retry button of an upload tile is named “Hochladen von … wiederholen”, so its name contains the visible “Wiederholen” (WCAG 2.5.3).
