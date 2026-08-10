# Field

Die gemeinsame Hülle aller Formularfelder: Label, Rahmen, Meldung. Kein Eingabeelement.

`TextInput` und `Select` benutzen `Field` intern. Direkt brauchst du sie nur, wenn du ein eigenes
Eingabeelement in dieselbe Optik setzen willst — ein Datumsfeld, ein Betragsfeld, ein
Kombinationsfeld, eine Farbwahl.

## Was Field liefert

Label mit Pflicht- oder Optional-Markierung, den Feldrahmen samt Zuständen (Hover, Fokus, Fehler,
Erfolg, gesperrt, schreibgeschützt) und darunter höchstens eine Meldung: `error` verdrängt `success`,
`success` verdrängt `hint`. Fehler bekommen `role="alert"` und ein Icon.

## Aufbau

`Field` erwartet als Kind den Feldkasten. Setze dort die Klassen aus dem gemeinsamen Stylesheet:

```jsx
<Field label="Betrag" htmlFor="betrag" required error={fehler}>
  <div className={"medo-field__box medo-field__box--md" + (fokus ? " medo-field__box--focus" : "")}>
    <Icon name="euro" size={19} color="var(--medo-icon-muted)" />
    <input id="betrag" className="medo-field__control" inputMode="decimal" />
  </div>
</Field>
```

Verfügbare Klassen: `medo-field__box` mit `--sm`/`--md`/`--lg` und den Zustandsklassen `--focus`,
`--error`, `--success`, `--disabled`, `--readonly`; `medo-field__control` für das Eingabeelement;
`medo-field__affix` für Präfix und Suffix; `medo-field__counter` für Zähler;
`medo-field__iconbtn` für bedienbare Icons im Feld.

## Regeln

Höhen und Rahmen kommen aus den Klassen, nicht aus eigenen Werten: 36 / 40 / 48px, Rahmen immer 1px,
Innenabstand 12px, Radius `md`. Der Fokus wird durch den 3px-Ring getragen, nicht durch einen
dickeren Rahmen — so springt beim Fokussieren nichts.

## Nicht tun

- Eine eigene Meldungszeile unter das Feld bauen — dafür ist `error`/`success`/`hint` da.
- Mehrere Meldungen gleichzeitig zeigen.
- Den Feldkasten ohne `medo-field__box` selbst stylen.
- Ein `htmlFor` weglassen, wenn das Kind ein Eingabeelement mit `id` ist.

## Abhängigkeiten

Ladereihenfolge: `ui/inject.js`, `ui/Icon.jsx`, dann `ui/Field.jsx`. Tokens aus `styles.css`.
