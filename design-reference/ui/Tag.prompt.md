# Tag

Kennzeichnet, kategorisiert oder filtert. Immer vollrund — das ist eine feste Systemregel und
unterscheidet Tags auf einen Blick von Schaltflächen.

## Drei Typen

**Anzeigend** ist der Normalfall: ein `<span>`, nicht bedienbar, trägt Status oder Kategorie.
**Entfernbar** entsteht durch `onRemove` — für gewählte Filter, die der Nutzer einzeln wegnehmen
kann. **Auswählbar** entsteht durch `selectable` und rendert eine Schaltfläche mit `aria-pressed`
— für Filterleisten, in denen Tags an- und abgeschaltet werden.

Ein Tag ist kein Button. Löst das Element eine Aktion aus, die über „gewählt / nicht gewählt"
hinausgeht, gehört dorthin ein `Button`.

## Farbe

Sechs Rollen: neutral, primary, success, warning, error, info. Eine Farbe steht im ganzen Produkt
für **dieselbe** Bedeutung — grün nicht einmal für „aktiv" und einmal für „bezahlt". Neutral ist die
richtige Wahl, wenn ein Tag nur benennt und nichts bewertet.

`soft` (Fläche 50) ist der Standard und funktioniert auch in Mengen. `solid` (Volltonfarbe 600) ist
laut und gehört sparsam eingesetzt — höchstens ein oder zwei pro Ansicht.

Die Bedeutung darf nie allein an der Farbe hängen. Der Text trägt sie; `dot` und `icon` helfen beim
Überfliegen, ersetzen aber keine Beschriftung.

## Text

Ein bis zwei Wörter. Längere Texte werden abgeschnitten, weil ein Tag nicht umbricht — wenn der Text
nicht kurz zu fassen ist, ist es kein Tag.

## Maße

22px (`sm`) oder 28px (`md`), Radius immer `full`. `sm` gehört in Tabellenzeilen und dichte Listen,
`md` überall sonst. Auf Touch-Geräten brauchen entfernbare und auswählbare Tags eine
Umgebung von mindestens 44px Höhe.

## Nicht tun

- Tags als Schaltflächen für Aktionen missbrauchen.
- Mehr als zwei bis drei Farbrollen gleichzeitig auf einer Fläche zeigen.
- Bedeutung nur über die Farbe tragen.
- Ganze Sätze in ein Tag setzen.
- Den Radius überschreiben.

## Beispiel

```jsx
<Tag color="success" dot>Aktiv</Tag>
<Tag color="neutral">Entwurf</Tag>
<Tag color="error" emphasis="solid">Abgelaufen</Tag>

<Tag color="primary" removeLabel="Design entfernen" onRemove={() => entferne("design")}>
  Design
</Tag>

<Tag selectable selected={aktiv} onClick={() => setAktiv(!aktiv)}>Technik</Tag>
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Tag.jsx`. Tokens aus `styles.css`.
