---
'@med-o/ui': minor
---

New: `CodeBlock` and `CodeBlockTabs` show code to read and copy.

- Optional title (file name or language) as `figcaption`, or tabs for variants such as npm, pnpm and yarn.
- Copy button with a visible label. “Copied” is announced; if the browser blocks the clipboard, the message says how to copy by hand.
- Line numbers and highlighted lines are CSS – they are not copied and not read.
- Long lines scroll. The code area then becomes a focusable, named region.
- Syntax colors: `highlight(code, language)` from the new entry `@med-o/ui/highlight`. It uses Shiki (optional peer dependency) and runs at build time or in a server component, so no highlighting code reaches the browser.

**Breaking:** new built-in texts `codeBlock.copy`, `codeBlock.copied`, `codeBlock.copyFailed` and `codeBlock.label`.
Update: if you pass your own language to `MessagesProvider`, add them.
