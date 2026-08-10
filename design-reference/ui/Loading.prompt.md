# Loading · Skeleton

Zeigt, dass etwas läuft. Der Teilring-Spinner ist die **einzige Dauerbewegung** im System.

## Welche Form wann

**Skeleton**, wenn die Form des Inhalts schon bekannt ist — Listen, Karten, Tabellen. Er zeigt, wo
was erscheint, und die Seite springt beim Eintreffen nicht.

**Spinner** (`Loading`), wenn die Form unbekannt ist oder nur ein kleiner Bereich wartet.
`variant="overlay"` legt ihn über den bereits sichtbaren Bereich (der Vorfahre braucht
`position: relative`) — der alte Inhalt bleibt sichtbar und wird nicht ersetzt. `fullpage` nur beim
ersten Laden der Anwendung.

Für eine Wartezeit **in** einer Schaltfläche oder neben einem Feld: `InlineLoading`. Für einen
Vorgang mit bekanntem Fortschritt: `ProgressBar`.

## Regeln

Unter etwa 300ms zeigt man nichts — ein aufblitzender Spinner wirkt wie ein Fehler. Länger als
etwa zehn Sekunden braucht es einen Text, der sagt, was geschieht („Profile werden geprüft …").

Ein Ladezustand pro Bereich. Skeleton und Spinner nie gleichzeitig für denselben Inhalt. Der
Skeleton ahmt die Anzahl der erwarteten Zeilen nach, nicht mehr — er ist kein Platzhalterteppich.

## Barrierefreiheit

`Loading` ist `role="status"` mit `aria-busy` und trägt ohne Text ein `aria-label`. Skeletons sind
`aria-hidden` — der Bereich selbst sollte `aria-busy="true"` tragen, damit Screenreader nicht
Bruchstücke vorlesen.

## Nicht tun

- Spinner für Vorgänge mit bekanntem Fortschritt.
- Ganze Seite überdecken, wenn nur ein Teil lädt.
- Skeletons mit mehr Zeilen, als danach erscheinen.
- Bewegte Ladeanimationen mit Effekt — es gibt nur diesen Spinner und das Shimmer.

## Beispiel

```jsx
<Loading size="sm" />
<Loading label="Profile werden geprüft …" />

<div style={{ position: "relative" }}>
  <Tabelle />
  {laedt && <Loading variant="overlay" />}
</div>

<Skeleton variant="card" />
<Skeleton variant="table" rows={5} />
<Skeleton lines={3} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, dann `ui/Loading.jsx`. Kein Icon nötig. Tokens aus `styles.css`.
