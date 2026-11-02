---
'@med-o/ui': minor
---

`Dialog`, `AlertDialog` and `Popover`: a clear contract for a main action that returns a promise.

- The dialog can be closed while it saves – without “Discard changes?”, the saving goes on.
- New `primaryAction.backgroundToast: { success, error }`: when the result arrives after the dialog was closed, a Toast reports it. The error Toast stays and offers Retry, which runs `onAction` again.
- Fixed: a result that arrives late no longer closes a dialog that was opened again in the meantime.
- Fixed: a rejected promise while the dialog is open no longer leaves an unhandled error in the console; the dialog stays open as before.
