# DatePicker · TimeSlots

Datum wählen — als Feld mit Kalender-Popover oder als fest stehender Kalender.

## Formen

Das **Feld** zeigt das gewählte Datum, ein Kalendersymbol links und rechts entweder das Kreuz zum
Zurücksetzen oder den Aufklapp-Pfeil. Es ist 44px hoch und mindestens 230px breit.

**`inline`** stellt den Kalender fest dar — für Bereichsauswahl mit Schnellauswahl und für
Termin-Buchungen, wo der Kalender das Hauptelement der Seite ist.

## Auswahl

Klick wählt **direkt**, es gibt kein Bestätigen. Bei `mode="range"` wählt der erste Klick den Start,
der zweite das Ende; ein weiterer Klick beginnt neu. Liegt der zweite Klick vor dem ersten, dreht
sich der Zeitraum um.

Der Kopf trägt Monat und Jahr als Schaltfläche: sie öffnet ein Monatsraster mit Jahresnavigation —
so kommt man ohne zwölf Klicks in ein anderes Jahr.

## Zustände im Raster

Heute trägt einen dünnen teal-Ring und fette Ziffer, das gewählte Datum ist gefüllt. Beim Zeitraum
sind Start und Ende gefüllt und an den Innenseiten eckig, die Tage dazwischen liegen auf #e2efed.
`min`/`max` **deaktivieren** Tage — sie werden nie ausgeblendet.

## Schnellauswahl und Zusammenfassung

`presets` setzt Chips neben den Kalender („Diese Woche", „Letzte 30 Tage"). Darunter steht bei
`range` die Zusammenfassung mit Zeitraum und Tagesanzahl, und — sobald etwas gewählt ist —
„Zurücksetzen" in Rot.

## TimeSlots

Für Termin-Buchungen: das Raster der Uhrzeiten neben dem Kalender. Belegte Zeiten sind deaktiviert
und **durchgestrichen**, nicht ausgeblendet — man soll sehen, dass es den Termin gibt.

## Nicht tun

- Gesperrte Tage oder belegte Zeiten ausblenden statt deaktivieren.
- Sonntag als Wochenbeginn oder amerikanische Reihenfolge.
- Auswahl erst nach „Übernehmen" wirksam machen.
- Kalender für ein Geburtsdatum — dort ist ein Feld schneller.

## Beispiel

```jsx
<DatePicker label="Vertragsbeginn" value={beginn} onChange={setBeginn}
            min={new Date()} required />

<DatePicker mode="range" inline value={zeitraum} onChange={setZeitraum}
  presets={[
    { label: "Diese Woche", value: () => ({ start: montag(), end: sonntag() }) },
    { label: "Letzte 30 Tage", value: () => ({ start: vorTagen(30), end: new Date() }) },
  ]} />

<TimeSlots value={uhrzeit} onChange={setUhrzeit}
  slots={["09:00", "09:30", { time: "10:00", disabled: true }, "10:30"]} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/DatePicker.jsx`. Tokens aus `styles.css`.
