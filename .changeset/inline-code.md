---
'@med-o/ui': minor
---

New: `Code` and the class `medo-code` mark a short piece of code inside running text.

- The size follows the text around it (0.875em), so one class fits every text size.
- `translate="no"` keeps browser translation away from the code. `CodeBlock` sets it as well now.
- Long values break anywhere, so they never widen the page.
- Status: experimental.
