---
'@med-o/ui': minor
---

Improved: components take the width of their container; fixed widths come from the width tokens.

- `DateField`, `DateRangePicker`, `TimeField` and `Calendar` fill their container (before a minimum width per variant). Date presets size to their text.
- `EmptyState` and the text of `EmbedConsent` use the full width; illustrations keep their shape with an aspect ratio.
- `DescriptionList`: the term column takes a third.
- Rounded to the scale: Side navigation 280 px (before 256), toasts at least 280 px (288), `Menu` at least 200 px (180), Quick search up to 560 px high (576), search thumbnails 120 px (128), horizontal `Card` media 200 px (180), `Grid` columns at least 240 px (256), `Slider` and `Pagination` number fields 80 px.

Check: a date field or empty state inside a wide container is now as wide as it. Put it in a narrower container (`Container`, `Grid`, a form column) where it should be smaller.
