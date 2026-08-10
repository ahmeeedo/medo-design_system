# Radio

Einfachauswahl: genau eine Option aus einer überschaubaren Menge.

## Wann

Bei zwei bis etwa fünf gleichrangigen Optionen, die alle sichtbar sein sollen. Werden es mehr, nimm
`Select`. Geht es um „null bis viele", nimm `Checkbox`. Geht es um einen Schalter, der sofort wirkt,
nimm `Toggle`.

## Gruppe

`RadioGroup` ist der Normalfall — sie erzeugt den gemeinsamen `name` selbst, wenn keiner gesetzt ist,
und nimmt die Optionen als Array. Eine `legend` ist Pflicht, sonst fehlt der Bezug für
Screenreader. Senkrecht ist der Normalfall; waagerecht nur bei zwei bis drei kurzen Labels.

Einzelne `Radio`-Elemente ohne Gruppe brauchen einen manuell gesetzten, gemeinsamen `name` — sonst
schließen sie sich nicht gegenseitig aus.

## Vorauswahl

Treffe eine Vorauswahl, wenn eine Option die sichere Voreinstellung ist. Gibt es keine neutrale
Voreinstellung, lass alles leer und setze `required` — eine falsche Vorauswahl ist schlechter als
keine, weil sie unbemerkt übernommen wird.

## Card-Radio

`variant="card"` rendert die Optionen als Auswahlkarten: Titel links, Radio-Punkt rechts, Erklärung
darunter (`hint`). Die gewählte Karte bekommt teal-Rahmen und teal-50-Fläche. Für wenige, gewichtige
Alternativen, die eine Beschreibung brauchen — Tarife, Versandarten, Sichtbarkeitsstufen. Die ganze
Karte ist Klickfläche.

Drei bis vier Karten sind das Maximum; darüber wird die Zeile zu voll und die Listenform ist besser.

## Maße

Kreis 18px (`sm`) oder 20px (`md`), Punkt 9px bzw. 10px, Rahmen 1px. Im Ruhezustand
`input-border`, gewählt `action`, im Hover eine Stufe dunkler. Gesperrt und gewählt zeigt einen
stone-400-Punkt in einem stone-300-Kreis — nicht die Aktionsfarbe.

## Nicht tun

- Ohne `legend` gruppieren.
- Radios ohne gemeinsamen `name` einzeln verstreuen.
- Eine Vorauswahl setzen, wo es keine sichere Voreinstellung gibt.
- Ein einzelnes Radio verwenden, das man nicht wieder abwählen kann — dafür `Checkbox`.
- Mehr als etwa fünf Optionen auflisten.

## Beispiel

```jsx
<RadioGroup legend="Sichtbarkeit des Profils" defaultValue="netzwerk" options={[
  { value: "alle",     label: "Für alle Spezialisten", hint: "Auch ohne Verbindung" },
  { value: "netzwerk", label: "Nur mein Netzwerk" },
  { value: "aus",      label: "Nicht sichtbar", disabled: true },
]} />

<RadioGroup legend="Größe" direction="horizontal" name="groesse" options={groessen} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, dann `ui/Radio.jsx`. Tokens aus `styles.css`.
