---
'@med-o/design-tokens': patch
---

The contrast check of the token build also covers higher contrast (`prefers-contrast: more`): every allowed text / background pair is checked in that mode too. `docs/contrast.json` gets the values per mode (`light-more`, `dark-more`) and `higherContrast` – the lowest contrast of secondary text and borders on content surfaces.
