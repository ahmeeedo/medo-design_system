# MenuButtons

Schaltflächen, die ein Menü öffnen: **MenuButton**, **SplitButton**, **IconMenuButton**. Alle drei
sind 40px hoch — eine Größe, keine sm-Variante.

## Welche wann

**MenuButton** — es gibt keine offensichtliche Hauptaktion, nur eine Auswahl („Neu anlegen" mit
Vertrag / Termin / Notiz). Ein Klick öffnet, nichts passiert ohne Auswahl.

**SplitButton** — es gibt eine Hauptaktion, die die meisten wollen, und Varianten daneben:
„Speichern" links, „Speichern und schließen" im Menü. Die linke Hälfte führt sofort aus, die rechte
öffnet nur. Beide Hälften sind eine Fläche mit einer Fuge, nie zwei getrennte Schaltflächen.

**IconMenuButton** — für Toolbars und Kartenköpfe, wenn kein Platz für Text ist. Braucht immer
`ariaLabel`; ein Kebab in einer Liste ohne Rahmen ist dagegen ein `Dropdown` mit
`trigger="kebab"`.

## Regeln

Pro Fläche gibt es **eine** primäre Schaltfläche. Steht daneben schon ein primärer Button, ist der
MenuButton `neutral`. Das Label trägt ein Verb im Infinitiv, das Gewicht bleibt 400 wie bei allen
Buttons im System.

Menüs, die am rechten Rand hängen, mit `align="end"` ausrichten — beim SplitButton ist das der
Standard, weil der Auslöser rechts sitzt.

## Verhalten

Klick oder Pfeil nach unten öffnet, der Chevron dreht sich, der erste Eintrag bekommt den Fokus.
Esc und Klick außerhalb schließen und geben den Fokus zurück. Es ist immer nur ein Menü offen. Die
Einträge sind dieselben wie im `Dropdown` (`divider`, `heading`, `danger`, Untermenü, Häkchen).

## Nicht tun

- Die Hauptaktion des SplitButton auch noch ins Menü schreiben.
- Zwei primäre MenuButtons nebeneinander.
- Icon-Menü ohne `ariaLabel`.
- Den SplitButton für unverwandte Aktionen benutzen — dann ist es ein MenuButton.

## Beispiel

```jsx
<MenuButton label="Neu anlegen" icon="add" items={[
  { value: "vertrag", icon: "description", label: "Vertrag" },
  { value: "termin", icon: "event", label: "Termin" },
  { value: "notiz", icon: "edit_note", label: "Notiz" },
]} onSelect={anlegen} />

<SplitButton label="Speichern" onClick={speichern} items={[
  { value: "schliessen", label: "Speichern und schließen" },
  { value: "kopie", label: "Als Kopie speichern" },
]} onSelect={speichernAls} />

<IconMenuButton ariaLabel="Ansicht" icon="tune" items={ansichtsOptionen} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Dropdown.jsx` (liefert `MenuList`), dann
`ui/MenuButtons.jsx`. Tokens aus `styles.css`.
