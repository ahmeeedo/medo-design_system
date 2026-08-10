# NumberInput

Erfasst Zahlen mit Stepper. Gleiche Anatomie und dieselben Zustände wie `TextInput`, dazu
Grenzwerte, Schrittweite und Auf/Ab-Steuerung.

## Wann

Für kleine, überschaubare Wertebereiche, die häufig um eine Stufe verändert werden — Anzahl,
Prozent, Menge, Dauer. Bei sehr großen Bereichen (Jahreszahl, Betrag mit vielen Stellen) ist ein
freies Textfeld besser: den Stepper würde dort niemand benutzen. Für einen Wert innerhalb fester
Grenzen, bei dem die Größenordnung wichtiger ist als die genaue Zahl, nimm `Slider`.

## Varianten

`chevrons` (Standard) setzt beide Pfeile rechts — kompakt, gut in Formularen und Tabellen.
`plusminus` setzt Minus links und Plus rechts um den Wert. Das ist die Touch-Variante: größere
Flächen, Wert mittig. Verwende sie dort, wo mit dem Finger gezählt wird (Mengen im Warenkorb).

## Grenzen und Schritte

Setze `min` und `max`, wo es fachlich Grenzen gibt — die zugehörige Schaltfläche wird dann am
Anschlag gesperrt statt kommentarlos weiterzuzählen. Ergänze einen `hint`, der die Grenze benennt.
`step` bestimmt die Schrittweite; die Nachkommastellen werden daraus abgeleitet, `precision`
überschreibt das.

## Bedienung

Alles, was die Schaltflächen können, geht auch ohne Maus: Pfeiltasten hoch und runter ändern um eine
Schrittweite, Gedrückthalten zählt nach kurzer Verzögerung fortlaufend weiter, das Mausrad wirkt nur
bei fokussiertem Feld. Die Stepper selbst sind aus dem Tabulator-Lauf genommen (`tabIndex={-1}`),
weil das Feld sie bereits abbildet — sonst müsste man sich durch drei Stationen tabben.

## Einheiten und Breite

`prefix` und `suffix` zeigen die Einheit direkt am Feld („€", „kg", „%") statt sie ins Label zu
schreiben. Gib eine feste `width` — ein Zahlenfeld über die ganze Spalte lädt zu Falscheingaben ein.
Der Wert steht in Tabellenziffern, damit die Stellen beim Zählen nicht springen.

## Nicht tun

- Für sehr große Wertebereiche verwenden.
- Grenzwerte kommentarlos überspringen lassen.
- Die Stepper als einzige Möglichkeit anbieten, den Wert zu ändern.
- Die Einheit nur ins Label schreiben.
- Das Feld über die volle Spaltenbreite ziehen.

## Beispiel

```jsx
<NumberInput label="Anzahl Nutzer" defaultValue={15} min={15} max={25}
             width="180px" hint="Mindestabnahme 15 Nutzer" />

<NumberInput label="Menge" variant="plusminus" defaultValue={3} min={1} width="170px" />

<NumberInput label="Anteil" defaultValue={50} suffix="%" step={5} min={0} max={100} width="170px" />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Field.jsx`, dann `ui/NumberInput.jsx`.
Tokens aus `styles.css`.
