---
'@med-o/ui': minor
---

New `Form` and `FieldErrors`: React Aria Form with the error rules of the system. `onSave` runs only when every field is valid and keeps the form pending while it saves. Reject it with `FieldErrors` and the server's messages show at their fields (`new FieldErrors({ email: 'Already registered. Sign in instead.' })`); a problem of the whole form (`formError`, or the second argument of `FieldErrors`) shows as an Alert above the fields and takes the focus. Any other failure shows “Could not save” – the input always stays. On submit with errors the focus goes to the first invalid field and screen readers hear how many fields need attention. Messages passed as `validationErrors` (e.g. from a server action) are treated the same way.

Fields: a message from `validate` or the server now wins over the general `errorMessage` of the field – before, “Enter a valid email address” hid “This email address is already registered”.

**Breaking:** new built-in texts `form.errorCount` and `form.saveFailed`. If you pass your own language to `MessagesProvider`, add them – TypeScript names the missing texts.
