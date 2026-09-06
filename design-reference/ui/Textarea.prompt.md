# Textarea

Mehrzeiliges Eingabefeld auf demselben Gerüst wie `TextInput` und `Select` — Label, Feldrahmen,
Hilfetext, Fehler- und Erfolgsmeldung kommen aus `Field`.

Nimm die Textarea, wenn die Antwort **mehrere Sätze** sein darf: Befund, Notiz, Begründung,
Kommentar. Passt die Antwort in eine Zeile, gehört dorthin ein `TextInput`.

## Eine Größe, und der Anwender zieht selbst

Die Textarea hat **keine Größenstufen.** Anders als `TextInput` und `Select` gibt es kein
`sm`/`md`/`lg` — die Schrift ist immer `text-base` 16px.

Die **Anfangshöhe** kommt von `rows`, Standard sind 3 Zeilen. Setze so viele Zeilen, wie die
erwartete Antwort ungefähr braucht: Ein Feld, das drei Sätze erwartet, aber eine Zeile hoch ist,
sieht aus, als wäre eine Zeile genug.

Danach **zieht der Anwender selbst** — feste Systemregel: **immer in der Höhe, nie in der Breite.**
Die Breite gehört dem Layout; würde sie ziehbar, bräche die Maske. Das ist keine Einstellung und
lässt sich nicht abschalten.

## Zeichenzähler

`showCounter` zeigt „24/100" am unteren Rand und braucht `maxLength` — ohne bleibt er aus.
Setze ihn, wenn die Grenze für den Anwender wichtig ist. Ein Zähler ohne echte Grenze
verunsichert nur.

## Meldungen

`hint` erklärt, `error` benennt einen Fehler, `success` bestätigt. Es erscheint immer nur eine;
`error` verdrängt `success`, `success` verdrängt `hint`.

Eine Fehlermeldung nennt **Ursache und nächsten Schritt**, nicht nur den Zustand:
„Bitte einen Befund eintragen" statt „Pflichtfeld".

## Nicht tun

- Die Textarea für einzeilige Antworten nehmen.
- Eine Größe erwarten — es gibt nur eine.
- Das Ziehen abschalten oder in die Breite zulassen wollen.
- Den Zähler ohne `maxLength` erwarten.
- `hint` und `error` gleichzeitig erwarten — es erscheint nur eines.
- Auf den Innenabstand des Feldes über `className` zugreifen; `className` liegt auf der Hülle,
  nicht auf dem Eingabeelement.

## Beispiel

```jsx
<Textarea label="Befund" rows={5} hint="Wird in den Bericht übernommen" />

<Textarea
  label="Begründung"
  required
  maxLength={500}
  showCounter
  error="Bitte einen Befund eintragen"
/>

<Textarea label="Notiz" rows={2} fullWidth />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Field.jsx`, dann `ui/Textarea.jsx`.
Tokens aus `styles.css`.
