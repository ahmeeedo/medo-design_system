---
'@med-o/ui': minor
---

Dialog: `primaryAction.onAction` can reject with `FieldErrors`. While the dialog is open, the messages show at the fields and the focus goes to the first. If it was closed while saving, the error Toast offers “Open again” instead of Retry: the dialog opens with the messages at the fields (keep the values in your app – controlled fields). New `primaryAction.blocking`: the dialog cannot be closed while the action runs (Cancel and × disabled, Esc and the scrim do nothing) – for results people must see before they go on.

**Breaking:** new built-in text `dialog.reopen`. If you pass your own language to `MessagesProvider`, add it.
