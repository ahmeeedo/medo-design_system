# Popover

Fläche mit **interaktivem** Inhalt, ausgelöst per Klick. Sie nimmt die Maus an und bleibt offen, bis
man sie schließt.

## Abgrenzung

`Tooltip` ist eine Zeile Erklärung bei Hover, ohne Maus-Annahme — sobald im Inhalt etwas anklickbar
ist, ist es ein Popover. Verlangt der Inhalt eine Entscheidung, bevor es weitergeht, oder ist er
länger als etwa zehn Zeilen, ist es ein `Modal`: das Popover sperrt die Seite nicht und fängt den
Fokus nicht. Eine Liste von Aktionen ist ein `Dropdown`.

## Inhalt

Ein Gedanke: eine Erklärung mit Link, ein kleines Formular mit einer Aktion, ein paar Kennzahlen.
Mit `title` bekommt der Popover eine Titelzeile mit Schließen-Kreuz — bei Formularen immer, weil man
dort einen sichtbaren Ausweg braucht.

Der Inhalt kann als Funktion übergeben werden und bekommt `{ close }`, damit die Aktion darin den
Popover selbst schließt.

## Verhalten

Klick öffnet und schließt, Esc und Klick außerhalb schließen und geben den Fokus an den Auslöser
zurück. Beim Scrollen und bei Größenänderung wird die Position neu bestimmt; reicht der Platz auf der
gewünschten Seite nicht, kippt er auf die Gegenseite. Der kleine Pfeil bleibt auf die Mitte des
Auslösers gerichtet. Es sollte immer nur einer offen sein.

Er hängt per Portal an `<body>`, damit kein Container mit `overflow: hidden` ihn abschneidet.

## Barrierefreiheit

`role="dialog"` mit `aria-label` aus dem Titel; der Auslöser trägt `aria-haspopup="dialog"` und
`aria-expanded`. Der Fokus wird **nicht** gefangen — Tab führt weiter durch die Seite, das ist
gewollt. Formulare darin brauchen also eine erreichbare Absenden-Schaltfläche.

## Nicht tun

- Hover als Auslöser benutzen.
- Wichtige Pflichtangaben nur im Popover zeigen.
- Popover aus Popover öffnen.
- Formulare ohne Titelzeile und ohne Schließen-Kreuz.
- Auf Touch-Oberflächen als einzige Erklärungsquelle.

## Beispiel

```jsx
<Popover title="Sichtbarkeit" content={({ close }) => (
  <>
    <p>Nur bestätigte Verbindungen sehen Ihr Profil.</p>
    <Button variant="ghost" onClick={close}>Verstanden</Button>
  </>
)}>
  <Button variant="ghost" iconOnly icon="help" aria-label="Hilfe zur Sichtbarkeit" />
</Popover>

<Popover placement="right" width={340} title="Filter" content={<FilterForm />}>
  <Button variant="secondary" icon="filter_list">Filter</Button>
</Popover>
```

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Popover.jsx`. Braucht `ReactDOM` für den
Portal-Einhang. Tokens aus `styles.css`.
