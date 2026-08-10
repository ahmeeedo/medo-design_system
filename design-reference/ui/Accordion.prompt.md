# Accordion

Faltet Abschnitte auf und zu. Es spart Fläche für Inhalte, die **nicht alle gleichzeitig** gebraucht
werden — es ist kein Mittel, um eine überfüllte Seite zu ordnen.

## Wann

Für Nebeninhalte, die man einzeln nachliest: Fragen und Antworten, Detailblöcke eines Formulars,
optionale Angaben. Nicht für Inhalte, die man vergleichen muss (dann alles offen zeigen), nicht für
Navigation (dafür `ContainedList` oder `Tabs`), nicht für Schritte einer Abfolge (dafür
`ProgressIndicator`).

Was die Person zum Arbeiten braucht, steht offen. Ein Accordion, in dem man alles aufklappen muss,
war die falsche Wahl.

## Verhalten

Standard ist `multiple`: mehrere Abschnitte dürfen offen sein — Aufklappen schließt nichts, was die
Person gerade liest. `multiple={false}` nur, wenn die Abschnitte einander ausschließen. Mit
`showToggleAll` erscheint „Alle aufklappen / Alle zuklappen"; bei langen Listen sinnvoll, bei drei
Abschnitten überflüssig.

Der Inhalt wächst über `grid-template-rows: 0fr → 1fr` in 180ms — keine feste Höhe, kein Sprung. Ein
`defaultValue` hält den ersten Abschnitt offen, wenn dort der wahrscheinlichste Inhalt steht.

## Kopfzeile

Titel als Aussage, keine Frage außer bei echten FAQ. `subtitle` erklärt, `meta` zählt („3 Angaben").
Das Zeichen rechts ist Plus/Minus — der drehende Chevron (`marker="chevron"`) ist die Alternative,
wenn Plus/Minus im Umfeld mit anderen Bedeutungen belegt ist. Beides nie gemischt auf einer Seite.

## Barrierefreiheit

Kopfzeile ist ein `<button aria-expanded aria-controls>`, der Inhalt eine `role="region"` mit
`aria-labelledby`. Pfeiltasten wechseln zwischen Kopfzeilen, Home und End springen an die Ränder,
Enter und Leertaste schalten. Der Inhalt bleibt im DOM — Suchen im Browser findet ihn auch
zugeklappt.

## Nicht tun

- Pflichtangaben oder Fehlermeldungen zuklappen.
- Ein Accordion in ein Accordion legen.
- Nur ein einzelner Abschnitt — das ist ein Absatz mit Überschrift.
- Den Titel als Handlung formulieren („Details anzeigen").

## Beispiel

```jsx
<Accordion showToggleAll defaultValue={["zulassung"]}
  items={[
    { value: "zulassung", icon: "verified", title: "Zulassung und Register",
      subtitle: "IHK-Registrierung, Vermittlernummer", content: <p>…</p> },
    { value: "haftung", icon: "gavel", title: "Berufshaftpflicht",
      meta: "2 Angaben", content: <p>…</p> },
    { value: "archiv", title: "Archivierte Nachweise", disabled: true, content: null },
  ]} />

<Accordion variant="separated" multiple={false} marker="chevron"
  items={fragen} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Accordion.jsx`. Tokens aus `styles.css`.
