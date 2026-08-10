# Icon

Rendert ein Material Symbols Rounded Glyph — die einzige zulässige Icon-Quelle im medo System; handgezeichnete SVG-Icons gibt es nicht.

```jsx
<Icon name="search" size={18} />
```

- `name` ist der Ligaturname (`search`, `arrow_forward`, `more_vert`, `delete`, `check`).
- Größen: **18** neben `text-sm`, **20** neben `text-base`, **24** für alleinstehende Schaltflächen.
- Icons erben die Textfarbe. Eigene Farbe nur über `--medo-icon`, `--medo-icon-muted` oder eine Statusfarbe.
- Dekorative Icons stehen flach im Text (`aria-hidden`, ist gesetzt). Bedienbare Icons in Eingabefeldern bekommen eine Schaltflächen-Optik (ruhend stone-100, Hover stone-200) und ein `aria-label` am umgebenden Button.
- Die Icon-Schrift kommt über `styles.css` vom Google-Fonts-CDN.
