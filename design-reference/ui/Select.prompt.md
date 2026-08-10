# Select

Auswahl aus einer bekannten, geschlossenen Liste.

## Wann nicht

Bei zwei bis drei kurzen, gleichrangigen Optionen ist `RadioGroup` besser — alles ist sofort
sichtbar, ohne Klick. Bei mehr als etwa fünfzehn Einträgen oder wenn der Nutzer suchen können soll,
ist `Search` oder ein Kombinationsfeld richtig. Für Aktionen statt Werte: `Menu`.

## Zwei Betriebsarten

**Standard** ist eine eigene Liste. Das Aufklappmenü folgt damit dem medo-Stil: Panel mit
Radius `lg`, Rahmen `border-subtle`, `shadow-lg`, aktive Zeile in stone-100, gewählter Eintrag in
primary-100 mit Häkchen. Ein natives `<select>` lässt sein Menü nicht gestalten — darum diese
Variante als Standard.

**`native`** schaltet auf das Betriebssystem-Auswahlrad um. Richtig für sehr lange Listen und für
Formulare, die ohne JavaScript funktionieren müssen. Das Menü ist dann Systemsache und sieht auf
jedem Gerät anders aus.

## Mehrfachauswahl

`multiple` macht `value` zu einem Array. Im Feld stehen die Gewählten als Chips (teal-50, Rahmen
teal-200, Kreuz je Chip). Das Feld bleibt immer einzeilig: es werden so viele Chips gezeigt, wie in
eine Zeile passen, der Rest steht als neutraler „+N"-Zähler am Zeilenende (Titel = Namen der
verborgenen Werte). `maxChips` setzt bei Bedarf eine feste Obergrenze. Bei vielen oder langen Werten
ist `multipleDisplay="count"` ruhiger — dann steht dort nur „4 ausgewählt".

Die Liste bleibt beim Wählen **offen**, jeder Eintrag trägt sein Häkchen. Geschlossen wird mit Esc,
Klick außerhalb oder Tab. Sind es mehr als etwa acht Werte gleichzeitig, ist eine Liste mit
Checkboxen (`ContainedList mode="multiple"`) übersichtlicher als ein Feld voller Chips.

## Tastatur

Die gestaltete Variante ist vollständig bedienbar: Pfeile bewegen, `Home`/`End` springen,
`Enter`/`Leertaste` wählen, `Esc` schließt, `Tab` verlässt das Feld. Ein einzelner Buchstabe springt
zum ersten passenden Eintrag. Das Panel klappt nach oben, wenn unten kein Platz ist. Die Rollen
`combobox` und `listbox` samt `aria-activedescendant` sind gesetzt.

## Optionen

`options` nimmt ein Array. Gruppen entstehen über verschachtelte `options` und erscheinen als
Mono-Überschrift in Versalien. Jede Option kann ein `icon` tragen (Material Symbols Rounded) und
`disabled` sein. Wenn `name` gesetzt ist, wird ein verstecktes Feld mitgeschrieben, damit ein
normales Formular den Wert abschickt.

`onChange` bekommt `{ target: { value, name } }` — bewusst wie ein natives Ereignis, damit der
Aufrufer beide Varianten gleich behandeln kann.

`defaultOpen` startet mit offenem Panel. Das ist ausschließlich für Dokumentationskarten und Tests
gedacht, damit das Aufklappmenü in einer statischen Vorschau sichtbar ist — in einer echten
Oberfläche gehört es nicht gesetzt.

## Vorauswahl

`placeholder` ist die leere Vorauswahl („Bitte wählen"). Setze eine echte Vorauswahl, wenn eine
Option die sichere Voreinstellung ist — sonst keine, und dann `required`.

## Nicht tun

- Ein `Select` mit zwei Optionen, wo Radios hingehören.
- Aktionen in die Liste legen — das ist ein `Menu`.
- `native` als Standard verwenden, nur weil es weniger Code ist.
- Die Liste als Suchfeld missbrauchen.

## Beispiel

```jsx
<Select label="Schwerpunkt" required icon="category" options={[
  { value: "kranken", label: "Krankenversicherung", icon: "health_and_safety" },
  { value: "leben",   label: "Lebensversicherung",  icon: "favorite" },
]} />

<Select label="Bereich" options={[
  { label: "Privat",     options: [{ value: "kranken", label: "Krankenversicherung" }] },
  { label: "Gewerblich", options: [{ value: "betrieb", label: "Betriebshaftpflicht" }] },
]} />

<Select label="Land" native options={laender} />
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Field.jsx`, dann `ui/Select.jsx`.
Tokens aus `styles.css`.
