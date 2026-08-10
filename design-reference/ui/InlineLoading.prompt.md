# InlineLoading

Wartezustand **im Textfluss**: drei pulsierende Punkte, danach Häkchen oder Kreuz. Er ersetzt keine
Fläche, er begleitet eine Zeile.

## Wann

In einer Schaltfläche während des Absendens, neben einem Feld, das geprüft wird, am Ende einer Zeile,
die gespeichert wird. Für ganze Bereiche ist es `Loading` (Spinner oder Skeleton), für bekannten
Fortschritt `ProgressBar`.

## Zustände

`loading` → `success` oder `error`. Der Erfolgszustand bleibt kurz stehen (etwa zwei Sekunden) und
verschwindet dann; ein Fehler bleibt, bis die Person etwas tut, und nennt im Label die Ursache. Wo
der Vorgang noch nicht begonnen hat, steht `inactive`.

Die Farben kommen aus den Statusrollen: laufend primary-600, Erfolg green-600, Fehler red-600. In
einer **gefüllten** Schaltfläche muss `inherit` gesetzt werden — sonst stünde teal auf teal und die
Punkte wären unsichtbar. Mit `inherit` übernehmen Punkte und Text die Schriftfarbe der Schaltfläche.

## Label

Beschreibt den Vorgang, nicht den Zustand: „Wird gespeichert …", danach „Gespeichert". Kein
„Erfolg!", kein Ausrufezeichen. In einer Schaltfläche bleibt das ursprüngliche Label besser stehen
und die Punkte treten daneben — so ändert die Schaltfläche ihre Breite nicht.

## Barrierefreiheit

`role="status"` mit `aria-live="polite"` und `aria-busy` im Ladezustand; die Punkte sind
`aria-hidden`. Screenreader lesen also nur den Text, nicht die Animation.

## Nicht tun

- Für Ladezeiten ganzer Bereiche verwenden.
- Erfolgszustand dauerhaft stehen lassen.
- Fehler ohne Ursache und ohne nächsten Schritt.
- Mehrere InlineLoadings gleichzeitig in derselben Zeile.

## Beispiel

```jsx
<InlineLoading label="Wird gespeichert …" />
<InlineLoading status="success" label="Gespeichert" />
<InlineLoading status="error" label="Nicht gespeichert — Verbindung prüfen" />

<Button variant="primary" disabled>
  Anfrage senden <InlineLoading size="sm" inherit />
</Button>
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/InlineLoading.jsx`. Tokens aus
`styles.css`.
