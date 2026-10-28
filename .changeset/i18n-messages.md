---
"@med-o/ui": minor
---

Built-in texts in English and German. Close buttons, screen-reader names, announcements and validation messages follow the language of React Aria (`I18nProvider`, else the browser) – the same source as dates and numbers. **Behaviour change:** without an `I18nProvider`, users with a German browser now see German texts; pin the language with `<I18nProvider locale="en-US">` if your app is English only. Props like `closeLabel` or `texts` still win. New: `MessagesProvider` for own texts or other languages, `useMessages`, `enMessages`, `deMessages`, type `Messages`. `formatShortcut(keys, control)` takes the name of the Control key (“Strg” in German). English fixes: “Show 1 more level”, “1 character left”. The exported `default…Texts` stay English.
