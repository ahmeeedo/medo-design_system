---
'@med-o/ui': minor
---

Fields never show an empty error: without an error message an invalid field keeps its helper text instead of an icon alone, and a warning in development names the missing `errorMessage`. `Checkbox` gets `errorMessage` for a single checkbox, e.g. “Accept the terms to continue.” (in a `CheckboxGroup` the group has the message).
