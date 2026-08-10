# Tooltip

Kurze Erklärung bei Hover oder Fokus. Rein informativ und **nicht interaktiv**.

## Wann

Für Schaltflächen, die nur ein Icon tragen, und für Begriffe, die eine Zeile Erklärung brauchen.
Sobald etwas im Inhalt anklickbar wäre — ein Link, eine Schaltfläche, ein Formularfeld — ist es
ein `Popover`, kein Tooltip: der Tooltip nimmt keine Maus an und verschwindet, sobald man ihn
ansteuert.

## Was hineingehört

Ein Hinweis, kein Absatz. Mit `title` entsteht die zweizeilige Variante für die Fälle, in denen ein
Stichwort und ein Satz zusammengehören. Was die Person zum Arbeiten **braucht**, gehört sichtbar auf
die Seite — nie ausschließlich in einen Tooltip: auf Touch-Geräten gibt es kein Hover.

## Verhalten

Bei Maus öffnet er nach etwa 400ms, damit er beim Überfahren nicht aufblitzt. Bei Tastaturfokus
öffnet er **sofort**, weil dort keine Beiläufigkeit im Spiel ist. Geschlossen wird immer sofort.
Reicht der Platz auf der gewünschten Seite nicht, kippt er auf die Gegenseite; der Pfeil bleibt auf
die Mitte des Auslösers ausgerichtet, auch wenn der Tooltip am Rand verschoben wird.

Er wird an `<body>` gehängt, damit kein Container mit `overflow: hidden` ihn abschneidet.

## Auslöser

Genau ein Kind, das eine `ref` annehmen kann und fokussierbar ist. Ein `<span>` als Auslöser braucht
`tabIndex={0}`, sonst ist der Tooltip für Tastaturnutzer unerreichbar. Ein Icon-Button mit
`aria-label` behält sein Label — der Tooltip ist die sichtbare Ergänzung, nicht der Ersatz.

## Nicht tun

- Links oder Schaltflächen in den Tooltip legen.
- Wichtige Informationen nur dort zeigen.
- Auf Touch-Geräten als einzige Erklärungsquelle.
- Einen Auslöser ohne Fokusmöglichkeit verwenden.
- Den Tooltip als Ersatz für ein `aria-label` benutzen.

## Beispiel

```jsx
<Tooltip content="In die Zwischenablage kopieren">
  <Button variant="ghost" iconOnly icon="content_copy" aria-label="Kopieren" />
</Tooltip>

<Tooltip placement="bottom" title="Tastenkürzel"
         content="Öffnet die Suche von überall — auch aus Untermenüs.">
  <Button variant="ghost" iconOnly icon="search" aria-label="Suche" />
</Tooltip>

<Tooltip content="Nach § 19 UStG wird keine Umsatzsteuer ausgewiesen.">
  <span tabIndex={0}><Icon name="help" size={18} /></span>
</Tooltip>
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Tooltip.jsx`. Braucht `ReactDOM` für den
Portal-Einhang. Tokens aus `styles.css`.
