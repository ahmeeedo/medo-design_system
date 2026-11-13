---
'@med-o/design-tokens': minor
'@med-o/ui': minor
---

New: text color classes and `medo-prose` for long text.

- `@med-o/design-tokens`: one class per `text/*` color token in `css/typography.css`, such as `medo-text-secondary` or `medo-text-brand`. Combine it with a text style: `class="medo-text-body-sm medo-text-secondary"`. Hover and pressed tones get no class.
- `@med-o/ui`: `medo-prose` styles long text from plain HTML or MDX – docs pages, legal texts, help articles. Headings, paragraphs and lists get their text styles and the spacing rules; plain lists, links and inline code look like List, Link and Code. Elements with a class keep their own look.
