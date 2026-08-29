# Übergabe an das medo-Design-Projekt — Verträge, Beschriftungen, Präfix, Tabs

**Stand:** 29.08.2026 · **Status:** **freigegeben** am 29.08.2026
**Leser:** die KI im medo-Design-Projekt.

---

## 0 · Was dieses Dokument ist

Aus dem abgeleiteten React-Paket sind Befunde aufgelaufen, die sich dort nicht beheben lassen,
weil sie die Quelle betreffen: eine als TypeScript ungültige Vertragsdatei, Verträge, die weniger
zusagen als die Umsetzung leistet, fest verdrahtete deutsche Oberflächentexte, ein doppelt
belegter CSS-Klassenpräfix, ein wirkungsloses Zusammenspiel zweier Tabs-Varianten und eine
Fehlerklasse bei `{...rest}`, die die Barrierefreiheit still beschädigt.

**Der Inhaber hat am 29.08.2026 alle zehn Änderungen freigegeben.**

**Alles hier Beschriebene wird im Design-Projekt ausgeführt.** Das abgeleitete Paket zieht danach
nach, nicht umgekehrt.

Zehn Änderungen, in der Reihenfolge unten auszuführen. Die Reihenfolge ist nicht beliebig:
Änderung 10 setzt Änderung 5 voraus, weil beide dieselbe Datei anfassen.

| # | Änderung | Berührte Dateien |
|---|---|---|
| 1 | `TextInput`: ungültige Typdeklaration `prefix` | `ui/TextInput.d.ts` |
| 2 | `Field`: `className` / `style` in den Vertrag | `ui/Field.d.ts` |
| 3 | `CheckboxGroup`: `className` / `style` in den Vertrag | `ui/Checkbox.d.ts` |
| 4 | `RadioGroup`: `className` / `style` in den Vertrag | `ui/Radio.d.ts` |
| 5 | `Select`: Nachzug bis zur eigenen Spezifikationsseite | `ui/Select.d.ts`, `ui/Select.jsx`, `ui/Select.prompt.md` |
| 6 | CSS-Präfix `medo-cs` doppelt belegt | `ui/CodeSnippet.jsx`, `ui/ContentSwitcher.jsx`, `_ds_bundle.js` |
| 7 | `Pagination`: dreizehn fest verdrahtete Texte | `ui/Pagination.d.ts`, `ui/Pagination.jsx`, `ui/Pagination.prompt.md` |
| 8 | `ContainedList`: fest verdrahteter Text der Zeilenaktion | `ui/ContainedList.d.ts`, `ui/ContainedList.jsx`, `ui/ContainedList.prompt.md` |
| 9 | `Tabs`: `contained` + `scrollable` wirkungslos | `ui/Tabs.jsx`, `ui/Tabs.d.ts`, `ui/Tabs.prompt.md` |
| 10 | `{...rest}` verdrängt eingebaute Attribute (7 Komponenten) | `ui/TextInput.jsx`, `ui/Select.jsx`, `ui/Search.jsx`, `ui/NumberInput.jsx`, `ui/Checkbox.jsx`, `ui/Radio.jsx`, `ui/Toggle.jsx` |

**Nach allen Änderungen ist `_ds_bundle.js` neu zu bauen.** Ohne das wirkt keine der
Codeänderungen in den Vorschaukarten.

---

## 1 · `TextInput`: die ungültige Typdeklaration `prefix`

**Datei:** `ui/TextInput.d.ts` · **Stelle:** die `extends`-Zeile, heute Zeile 5–6
**Weitere Dateien:** keine. `ui/TextInput.jsx`, `ui/TextInput.prompt.md`,
`ui/TextInput.card.html` und `components/Text-input.dc.html` bleiben **unverändert** — das
Verhalten ändert sich nicht, nur die Typaussage.

### Alter Zustand

```ts
export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
```

### Neuer Zustand

```ts
/* `size` und `prefix` sind am `<input>` bereits belegt: `size` als Zahl, `prefix` als
   RDFa-Zeichenkette. Beide Namen trägt diese Komponente mit eigener Bedeutung, deshalb
   werden sie ausgeschlossen. Ohne den Ausschluss von `prefix` meldet TypeScript TS2430
   und zwingt Abnehmer zu `skipLibCheck: true`. Geprüft gegen @types/react 18 und 19. */
export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
```

Sonst bleibt die Datei Zeile für Zeile gleich. Insbesondere bleibt `prefix?: React.ReactNode`
stehen, wo es steht.

### Was danach anders ist

Nichts an der Oberfläche, nichts am Verhalten. Abnehmer können das Paket künftig mit
`skipLibCheck: false` bauen — heute ist das unmöglich.

Verloren geht ausschließlich die Möglichkeit, das RDFa-Attribut `prefix` als Zeichenkette an das
`<input>` durchzureichen. Das war ohnehin nie möglich: die Komponente destrukturiert `prefix`
selbst, der Wert hat das `<input>` nie erreicht. Der Vertrag beschreibt danach, was der Code tut.

### Nachweis

Gegenprobe am heutigen Stand, TypeScript 5.4.5, `skipLibCheck: false`, identisch in beiden
React-Fassungen:

```
TextInput.d.ts(5,18): error TS2430: Interface 'TextInputProps' incorrectly extends interface
  'Omit<InputHTMLAttributes<HTMLInputElement>, "size">'.
  Types of property 'prefix' are incompatible.
    Type 'ReactNode' is not assignable to type 'string | undefined'.
      Type 'null' is not assignable to type 'string | undefined'.
```

Mit dem neuen Zustand, samt einer Nutzungsprobe, die `prefix={<span>https://</span>}`,
`suffix=".de"`, `size="lg"` und durchgereichte `<input>`-Attribute setzt:

| Geprüft gegen | Ergebnis |
|---|---|
| TypeScript 5, `@types/react` 18.3.31, `skipLibCheck: false` | keine Fehler |
| TypeScript 5, `@types/react` 19.2.18, `skipLibCheck: false` | keine Fehler |

Zwei Gegenproben, damit ein grüner Lauf etwas belegt: `"prefix"` wieder aus dem `Omit` entfernt →
`TS2430` kehrt zurück. `size="xl"` in der Nutzungsprobe → `TS2322`. Beide Male rot.

### Warum nicht umbenennen

Ein anderer Name (`leading`, `before`) wäre eine Bruchänderung für jedes Projekt, das `prefix`
heute schon setzt. Der Ausschluss kostet nichts und bricht nichts.

---

## 2 · `Field`: `className` und `style` in den Vertrag

**Datei:** `ui/Field.d.ts` · **Stelle:** Ende von `FieldProps`
**Weitere Dateien:** keine. `ui/Field.jsx` nimmt beide Angaben **heute schon** entgegen
(Signatur, Zeile 9–20) und setzt sie auf die äußere Hülle (Zeile 134). `ui/Field.prompt.md`
erwähnt sie nicht und braucht keine Änderung.

### Alter Zustand

```ts
  fullWidth?: boolean;
  children?: React.ReactNode;
}
```

### Neuer Zustand

```ts
  fullWidth?: boolean;
  children?: React.ReactNode;
  /** Liegt auf der äußeren Hülle des Feldes. */
  className?: string;
  /** Liegt auf der äußeren Hülle des Feldes. */
  style?: React.CSSProperties;
}
```

### Was danach anders ist

Nichts an der Oberfläche. Der Vertrag sagt zu, was die Umsetzung schon kann. Wer heute
`className` an ein `Field` gibt, bekommt eine Warnung des Editors, obwohl es funktioniert.

---

## 3 · `CheckboxGroup`: `className` und `style` in den Vertrag

**Datei:** `ui/Checkbox.d.ts` · **Stelle:** Ende von `CheckboxGroupProps`
**Weitere Dateien:** keine. `ui/Checkbox.jsx` nimmt beide entgegen (Zeile 154) und setzt sie auf
das `<fieldset>`. `CheckboxProps` bleibt unverändert.

### Alter Zustand

```ts
  direction?: "vertical" | "horizontal";
  children?: React.ReactNode;
}
```

### Neuer Zustand

```ts
  direction?: "vertical" | "horizontal";
  children?: React.ReactNode;
  /** Liegt auf dem `<fieldset>` der Gruppe. */
  className?: string;
  /** Liegt auf dem `<fieldset>` der Gruppe. */
  style?: React.CSSProperties;
}
```

### Was danach anders ist

Nichts an der Oberfläche.

---

## 4 · `RadioGroup`: `className` und `style` in den Vertrag

**Datei:** `ui/Radio.d.ts` · **Stelle:** Ende von `RadioGroupProps`
**Weitere Dateien:** keine. `ui/Radio.jsx` nimmt beide entgegen (Signatur `RadioGroup`) und setzt
sie auf das `<fieldset>`. `RadioProps` bleibt unverändert.

### Alter Zustand

```ts
  options?: RadioGroupOption[];
  children?: React.ReactNode;
}
```

### Neuer Zustand

```ts
  options?: RadioGroupOption[];
  children?: React.ReactNode;
  /** Liegt auf dem `<fieldset>` der Gruppe. */
  className?: string;
  /** Liegt auf dem `<fieldset>` der Gruppe. */
  style?: React.CSSProperties;
}
```

### Was danach anders ist

Nichts an der Oberfläche.

---

## 5 · `Select`: Nachzug bis zur eigenen Spezifikationsseite

**Dies ist die umfangreichste Änderung des Dokuments. Sie ist vor Änderung 10 auszuführen**,
weil beide `ui/Select.jsx` anfassen.

**Dateien:** `ui/Select.d.ts`, `ui/Select.jsx`, `ui/Select.prompt.md`
**Unverändert:** `components/Select.dc.html` — die Spezifikationsseite ist bereits richtig; sie
ist der Anlass dieser Änderung, nicht ihr Gegenstand.

### Der Ausgangsbefund

`components/Select.dc.html` schreibt heute schon fünf Dinge vor, die `ui/Select.jsx` nicht kann:

| Was die Spezifikationsseite zeigt | Fundstelle dort | In `ui/Select.jsx` |
|---|---|---|
| Suchfeld über der Liste („Suchen …", Lupe) | Zeile 81–84 | fehlt |
| Kopfzeile bei Mehrfachauswahl: „2 ausgewählt" + „Zurücksetzen" | Zeile 106–109 | fehlt |
| Kontrollkästchen je Eintrag bei Mehrfachauswahl (20 px, radius-sm) | Zeile 113 | fehlt |
| Farbiges Kennzeichen je Eintrag (20 × 14 px, `o.flag`) | Zeile 90 | fehlt |
| Zweite Zeile je Eintrag (`o.desc`) | Zeile 93 | fehlt |

Dazu unter „Do": *„Suche ab ~10 Optionen einblenden."*

**Dass die Spezifikationsseite in einem solchen Fall den Ausschlag gibt, ist im Projekt bereits
entschieden worden.** `STATUS.md` Zeile 43 hält für `CodeSnippet` fest: *„nachgebaut nach
components/Code-snippet.dc.html (erste Fassung wich ab und wurde ersetzt)"*. Select ist derselbe
Fall.

`ui/Select.prompt.md` **widerspricht dem** an zwei Stellen. Beide sind mitzuändern (unten).

### 5a · `ui/Select.d.ts`

**Stelle 1 — `SelectOption`, nach `icon`:**

Alt
```ts
  /** Ligaturname eines Material Symbols Rounded Glyphs, links im Eintrag. */
  icon?: string;
  disabled?: boolean;
}
```

Neu
```ts
  /** Ligaturname eines Material Symbols Rounded Glyphs, links im Eintrag. */
  icon?: string;
  /** Zweite Zeile unter der Bezeichnung — erklärt den Eintrag, wiederholt ihn nicht. */
  description?: React.ReactNode;
  /** Farbiges Kennzeichen links im Eintrag, 20×14 px. Nimmt einen freien
   *  CSS-Hintergrundwert: Farbe, Verlauf oder `url(...)`. */
  flag?: string;
  disabled?: boolean;
}
```

**Stelle 2 — `SelectProps`, um `defaultOpen` herum:**

Alt
```ts
  /** Startet mit offenem Panel. Nur für Dokumentation und Tests — nicht in Produktion. */
  defaultOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

Neu
```ts
  /** Blendet ein Suchfeld über der Liste ein und filtert die Einträge. Ab etwa zehn Optionen. */
  searchable?: boolean;
  /** Platzhalter und `aria-label` des Suchfelds. Standard „Suchen …". */
  searchPlaceholder?: string;
  /** Startet mit offenem Panel. Nur für Dokumentation und Tests — nicht in Produktion. */
  defaultOpen?: boolean;
  /** `aria-label` des Kreuzes an einem Chip. Standard `Auswahl entfernen: ${label}`. */
  removeChipLabel?: (label: string) => string;
  /** Anzahl der Auswahl — in der Kopfzeile des Panels und im Feld bei
   *  `multipleDisplay="count"`. Standard `${count} ausgewählt`. */
  selectedCountLabel?: (count: number) => React.ReactNode;
  /** Schaltfläche in der Kopfzeile des Panels. Standard „Zurücksetzen". */
  resetLabel?: React.ReactNode;
  /** Text, wenn `options` leer ist. Standard „Keine Einträge". */
  emptyText?: React.ReactNode;
  /** Text, wenn der Suchbegriff nichts trifft. Standard „Keine Treffer". */
  noResultsText?: React.ReactNode;
  /** Nur bei `native`: eigene `<option>`-Elemente statt `options`. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
```

`children` steht heute in der Signatur von `ui/Select.jsx` (Zeile 45 des Signaturblocks) und wird
in der `native`-Betriebsart ausgewertet, fehlt aber im Vertrag. Deshalb hier mit.

### 5b · `ui/Select.jsx` — Signatur

Alt (Auszug)
```js
  maxChips = 0,
  defaultOpen = false,
```

Neu
```js
  maxChips = 0,
  searchable = false,
  searchPlaceholder = "Suchen …",
  defaultOpen = false,
  removeChipLabel = (label) => "Auswahl entfernen: " + label,
  selectedCountLabel = (count) => count + " ausgewählt",
  resetLabel = "Zurücksetzen",
  emptyText = "Keine Einträge",
  noResultsText = "Keine Treffer",
```

**Alle Vorgabewerte sind die heutigen deutschen Texte.** Das Paket ist in fremden Projekten
eingebunden; eine Angabe ohne Vorgabewert hinterließe dort leere Beschriftungen, ohne dass etwas
bricht.

### 5c · `ui/Select.jsx` — Zustand und Filterung

Neben `const [open, setOpen]` kommt hinzu:

```js
const [query, setQuery] = React.useState("");
const searchRef = React.useRef(null);
```

Die gefilterte Liste tritt überall dort an die Stelle von `flat`, wo heute die Einträge gerendert
und mit den Pfeiltasten durchlaufen werden — **nicht** dort, wo geprüft wird, ob die Liste
insgesamt leer ist:

```js
/* Gefilterte Liste. Eine Gruppenüberschrift bleibt nur stehen, solange unter ihr noch
   ein Eintrag übrig ist. Ohne Suchbegriff ist das die unveränderte Liste. */
const shown = React.useMemo(() => {
  const q = query.trim().toLowerCase();
  if (!q) return flat;
  const hit = (o) =>
    String(o.label).toLowerCase().includes(q) ||
    (o.description ? String(o.description).toLowerCase().includes(q) : false);
  const out = [];
  flat.forEach((o) => {
    if (o.group) out.push(o);
    else if (hit(o)) out.push(o);
  });
  return out.filter((o, i) => !o.group || (out[i + 1] && !out[i + 1].group));
}, [flat, query]);
```

Zwei Effekte gehören dazu:

```js
/* Suchfeld übernimmt den Fokus, solange das Panel offen ist; beim Schließen wird
   der Suchbegriff verworfen, damit das Panel beim nächsten Öffnen vollständig ist. */
React.useEffect(() => {
  if (!searchable) return;
  if (open) searchRef.current && searchRef.current.focus();
  else setQuery("");
}, [open, searchable]);

/* Der aktive Eintrag muss beim Tippen mitwandern, sonst zeigt er ins Leere —
   auch beim Zurücksetzen des Suchbegriffs, weil sich die Indizes dann wieder ändern. */
React.useEffect(() => {
  if (!open) return;
  setActiveIndex(shown.findIndex((o) => !o.group && !o.disabled));
}, [query]);
```

Und das Zurücksetzen der Mehrfachauswahl:

```js
const reset = () => {
  if (!isControlled) setInternal([]);
  if (onChange) onChange({ target: { value: [], name } });
};
```

### 5d · `ui/Select.jsx` — Panel

Über der Einträgeliste, innerhalb des Panels, entsteht ein Band. Es erscheint nur, wenn
`multiple` oder `searchable` gesetzt ist:

- `div.medo-select__top`
  - nur bei `multiple`: `div.medo-select__head`
    - `span.medo-select__count` mit `selectedCountLabel(chosen.length)`
    - nur wenn etwas gewählt ist: `button.medo-select__reset` mit `resetLabel`,
      `type="button"`, `onMouseDown` mit `preventDefault`, `onClick: reset`
  - nur bei `searchable`: `div.medo-select__search`
    - `Icon` `search`, `size: 18`, `color: var(--medo-icon-muted)`
    - `input.medo-select__searchctl` mit `ref: searchRef`, `type: "text"`, `value: query`,
      `placeholder: searchPlaceholder`, `"aria-label": searchPlaceholder`,
      `"aria-controls": fieldId + "-list"`, `"aria-autocomplete": "list"`,
      `"aria-activedescendant"` wie am Auslöser, `onChange` setzt `query`,
      `onKeyDown` ist derselbe Handler wie am Auslöser

Die Leerzustände unterscheiden künftig zwei Fälle:

Alt
```js
flat.length === 0
  ? React.createElement("div", { className: "medo-select__empty" }, "Keine Einträge")
  : flat.map(...)
```

Neu
```js
flat.length === 0
  ? React.createElement("div", { className: "medo-select__empty" }, emptyText)
  : shown.length === 0
    ? React.createElement("div", { className: "medo-select__empty" }, noResultsText)
    : shown.map(...)
```

Je Eintrag kommen vor dem Bezeichner hinzu:

- bei gesetztem `o.flag`: `span.medo-select__flag`, `aria-hidden`, `style: { background: o.flag }`
- bei `multiple`: `span.medo-select__check` (`+ " medo-select__check--on"` wenn gewählt),
  `aria-hidden`, darin bei Auswahl `Icon` `check`, `size: 16`,
  `color: var(--medo-action-text)`

und innerhalb von `span.medo-select__opt-label` nach `o.label`:

- bei gesetztem `o.description`: `span.medo-select__opt-desc` mit `o.description`

Das abschließende Häkchen rechts bleibt, gilt aber nur noch bei Einfachauswahl
(`!multiple && isOn(o.value)`) — bei Mehrfachauswahl trägt das Kontrollkästchen links die Aussage.

Das Kreuz am Chip bekommt sein `aria-label` aus der neuen Angabe:

Alt
```js
"aria-label": "Auswahl entfernen: " + o.label,
```

Neu
```js
"aria-label": removeChipLabel(o.label),
```

Und die Anzeige im Feld bei `multipleDisplay="count"`:

Alt
```js
React.createElement("span", { className: "medo-select__value" }, chosen.length + " ausgewählt")
```

Neu
```js
React.createElement("span", { className: "medo-select__value" }, selectedCountLabel(chosen.length))
```

### 5e · `ui/Select.jsx` — CSS

Diese Regeln kommen in `MEDO_SELECT_CSS`. **Sie sind wörtlich so zu übernehmen**, einschließlich
der `calc()`-Formen: das abgeleitete Paket liefert genau diesen Text aus, und der spätere Abgleich
vergleicht Zeichen für Zeichen.

```css
.medo-select__opt-desc{
  display: block;
  font-size: var(--medo-text-xs);
  color: var(--medo-text-muted);
  font-weight: 400;
}
/* Freier CSS-Hintergrundwert: Farbe oder Bild. */
.medo-select__flag{
  flex: none;
  width: calc(var(--medo-space-md) + var(--medo-space-2xs));
  height: calc(var(--medo-space-sm) + var(--medo-space-3xs));
  border-radius: calc(var(--medo-radius-sm) / 2);
  background-size: cover;
  background-position: center;
}

/* Kopfzeile und Suchfeld sitzen in einem gemeinsamen Band, das beim Scrollen oben
   stehen bleibt. Die negativen Ränder heben den 6px-Innenabstand des Panels auf,
   damit das Band randlos aufliegt; das Padding stellt den Abstand innen wieder her. */
.medo-select__top{
  position: sticky;
  top: 0;
  z-index: 1;
  margin: calc(var(--medo-space-xs) * -0.75) calc(var(--medo-space-xs) * -0.75) 0;
  padding: calc(var(--medo-space-xs) * 0.75);
  background: var(--medo-overlay);
}

.medo-select__head{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--medo-space-xs);
  padding: calc(var(--medo-space-xs) * 0.75) var(--medo-space-xs);
  border-bottom: var(--medo-border-thin) solid var(--medo-border-subtle);
}
.medo-select__count{ font-size: var(--medo-text-sm); color: var(--medo-text-muted); }
.medo-select__reset{
  border: none;
  background: transparent;
  padding: 0;
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-sm);
  font-weight: 600;
  color: var(--medo-action);
  cursor: pointer;
  border-radius: var(--medo-radius-sm);
}
.medo-select__reset:hover{ color: var(--medo-action-hover); }
.medo-select__reset:focus-visible{ outline: none; box-shadow: 0 0 0 3px var(--medo-focus-ring); }

/* Kontrollkästchen je Eintrag bei Mehrfachauswahl. */
.medo-select__check{
  box-sizing: border-box;
  flex: none;
  width: calc(var(--medo-space-md) + var(--medo-space-2xs));
  height: calc(var(--medo-space-md) + var(--medo-space-2xs));
  border-radius: var(--medo-radius-sm);
  background: var(--medo-input-bg);
  border: var(--medo-border-thin) solid var(--medo-input-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 120ms ease-out, border-color 120ms ease-out;
}
.medo-select__check--on{ background: var(--medo-action); border-color: var(--medo-action); }

.medo-select__search{
  display: flex;
  align-items: center;
  gap: var(--medo-space-xs);
  height: calc(var(--medo-space-xl) + var(--medo-space-3xs));
  padding: 0 calc(var(--medo-space-xs) + var(--medo-space-3xs));
  background: var(--medo-surface-container);
  border-radius: var(--medo-radius-md);
}
.medo-select__head + .medo-select__search{ margin-top: calc(var(--medo-space-xs) * 0.75); }
.medo-select__searchctl{
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--medo-font-sans);
  font-size: var(--medo-text-sm);
  color: var(--medo-input-text);
  padding: 0;
}
.medo-select__searchctl::placeholder{ color: var(--medo-input-placeholder); }
```

`.medo-select__opt`, `.medo-select__opt-label` und `.medo-select__empty` bleiben unverändert.

### 5f · `ui/Select.prompt.md`

Zwei Aussagen widersprechen der eigenen Spezifikationsseite und sind zu ändern.

**Abschnitt „Wann nicht", heute:**

> Bei mehr als etwa fünfzehn Einträgen oder wenn der Nutzer suchen können soll, ist `Search` oder
> ein Kombinationsfeld richtig.

**Neu:**

> Ab etwa zehn Einträgen gehört `searchable` gesetzt — die Suche filtert dann die Liste im Panel.
> Erst wenn nicht aus einer bekannten Liste gewählt, sondern in einem offenen Bestand gesucht
> wird, ist `Search` richtig.

**Abschnitt „Nicht tun", heute:**

> - Die Liste als Suchfeld missbrauchen.

**Neu:**

> - Die Liste als Suchfeld missbrauchen — `searchable` filtert die vorhandenen Optionen, es
>   sucht nicht in einem offenen Bestand.

**Neuer Abschnitt, hinter „Optionen":**

```markdown
## Suche

`searchable` setzt ein Suchfeld über die Liste. Es übernimmt beim Öffnen den Fokus; die Pfeiltasten
wandern weiter durch die gefilterte Liste. Gesucht wird in `label` und `description`. Eine
Gruppenüberschrift bleibt stehen, solange unter ihr noch ein Eintrag übrig ist. Beim Schließen wird
der Suchbegriff verworfen — beim nächsten Öffnen steht die Liste wieder vollständig da.

Ist `options` leer, steht dort `emptyText` („Keine Einträge"). Trifft nur der Suchbegriff nichts,
steht dort `noResultsText` („Keine Treffer") — die Unterscheidung sagt dem Nutzer, ob er seinen
Begriff ändern soll oder ob es nichts zu wählen gibt.
```

**Im Abschnitt „Optionen" ergänzen:**

> Eine Option kann eine `description` als zweite Zeile tragen und ein `flag` — ein farbiges
> Kennzeichen links im Eintrag, das einen freien CSS-Hintergrundwert nimmt (Farbe, Verlauf oder
> `url(...)`), etwa für Landesflaggen.

**Im Abschnitt „Mehrfachauswahl" ergänzen:**

> Das Panel trägt bei Mehrfachauswahl eine Kopfzeile mit der Anzahl und „Zurücksetzen", und jeder
> Eintrag ein Kontrollkästchen links statt des Häkchens rechts.

### Was danach anders ist

Sichtbar: mit `searchable` erscheint ein Suchfeld im Panel. Bei Mehrfachauswahl bekommt das Panel
eine Kopfzeile mit Anzahl und Zurücksetzen, und die Einträge Kontrollkästchen statt des Häkchens
rechts. Einträge können eine zweite Zeile und ein farbiges Kennzeichen tragen.

**Ohne `searchable` und ohne `multiple` ändert sich nichts.** Alle neuen Angaben sind optional und
haben Vorgabewerte.

---

## 6 · CSS-Präfix `medo-cs` ist doppelt belegt

**Dateien:** `ui/CodeSnippet.jsx`, `ui/ContentSwitcher.jsx`, `STATUS.md` (eine Erwähnung),
danach `_ds_bundle.js` neu bauen
**Unverändert:** `components/Code-snippet.dc.html`, `components/Content-switcher.dc.html`,
`ui/CodeSnippet.card.html`, `ui/ContentSwitcher.card.html`, `styles.css` — geprüft, keine dieser
Dateien nennt eine `medo-cs`-Klasse. Die Spezifikationsseiten sind von Hand gebaute Ansichten mit
Inline-Stilen; die Karten übergeben ausschließlich Props.

### Der Befund

Beide Komponenten belegen denselben Präfix, und beide definieren den Blockwurzelselektor `.medo-cs`
selbst:

| `.medo-cs`-Selektoren in `ui/CodeSnippet.jsx` | in `ui/ContentSwitcher.jsx` |
|---|---|
| `.medo-cs` · `.medo-cs--terminal` · `.medo-cs-inline` · `.medo-cs__bar` · `.medo-cs__body` · `.medo-cs__code` · `.medo-cs__copy` · `.medo-cs__copy--done` · `.medo-cs__dots` · `.medo-cs__gutter` · `.medo-cs__lang` · `.medo-cs__live` · `.medo-cs__more` · `.medo-cs__single` · `.medo-cs__sline` | `.medo-cs` · `.medo-cs--full` · `.medo-cs--neutral` · `.medo-cs--outline` · `.medo-cs--sm` · `.medo-cs__seg` · `.medo-cs__seg--equal` · `.medo-cs__seg--iconOnly` · `.medo-cs__tip` |

Im Design-Projekt fällt das nicht auf, weil jede Spezifikationsseite und jede Karte für sich läuft
und nur ein Stylesheet einspielt. Sobald beide Stylesheets in einem Bündel liegen — und genau das
tut `_ds_bundle.js` und jedes abgeleitete Paket —, überschreiben `.medo-cs` von `CodeSnippet` und
`.medo-cs` von `ContentSwitcher` einander. **Ohne Build-Fehler, ohne Warnung.**

### Die Erhebung ist vollständig

Über alle 35 Dateien in `ui/` erhoben. **Genau eine echte Mehrfachbelegung**, nämlich diese.

`medo-field` erscheint ebenfalls in vier Dateien (`Field`, `NumberInput`, `Search`, `TextInput`),
ist aber **keine Kollision, sondern gewollte Teilung**: `Field` ist die gemeinsame Hülle, die
übrigen drei ergänzen nur nachrangig eingeschränkte Regeln (`.medo-num .medo-field__box`,
`.medo-ti-float .medo-field__box`, `.medo-search__box--compact.medo-field__box--focus`). Keine
Datei überschreibt eine Regel einer anderen. **Hier ist nichts zu tun.**

### Die Änderung

| Datei | Alt | Neu | Vorkommen |
|---|---|---|---|
| `ui/CodeSnippet.jsx` | `medo-cs` | `medo-cds` | 39 |
| `ui/ContentSwitcher.jsx` | `medo-cs` | `medo-ctsw` | 61 |
| `STATUS.md` | `.medo-cs__body` (Zeile 43) | `.medo-cds__body` | 1 |

Jedes Vorkommen der Zeichenkette `medo-cs` ersetzen — im CSS-Text ebenso wie in den
`className`-Angaben der `React.createElement`-Aufrufe. `.medo-cs-inline` wird zu
`.medo-cds-inline`, `.medo-cs__seg--iconOnly` zu `.medo-ctsw__seg--iconOnly`, und so fort.

**Unangetastet bleiben** die Namen der CSS-Konstanten (`MEDO_CODE_CSS`, `MEDO_CS_CSS`) und die
Kennungen der `injectCss`-Aufrufe (`medo-code-snippet-css`, `medo-content-switcher-css`). Beide
sind schon heute eindeutig.

Die neuen Präfixe sind gegen alle 35 Dateien geprüft und frei.

### Was danach anders ist

Nichts an der Oberfläche, solange man beide Komponenten getrennt betrachtet. In jedem Bündel, das
beide enthält, sehen sie danach so aus, wie sie einzeln aussehen — heute überschreibt dort eine die
andere.

### Verhältnis zu den gelockten Beschlüssen

Der Beschluss lautet *„Prefix `medo`"* und betrifft die Token-Benennung. Beide neuen Präfixe
beginnen mit `medo-`. **Der Beschluss ist nicht berührt.**

---

## 7 · `Pagination`: dreizehn fest verdrahtete Texte

**Dateien:** `ui/Pagination.d.ts`, `ui/Pagination.jsx`, `ui/Pagination.prompt.md`
**Unverändert:** `components/Pagination.dc.html`, `ui/Pagination.card.html`.

### Der Befund

`ui/Pagination.jsx` trägt dreizehn deutsche Texte fest im Code — zwölf verschiedene, „Einträge pro
Seite" zweimal (sichtbar und als `aria-label`). Ein Abnehmer kann keinen davon übersetzen.
`ariaLabel` ist heute die einzige Angabe dieser Art, die es schon gibt.

| Zeile | Text heute | Neue Angabe |
|---|---|---|
| 197 | `"Seite " + p` | `pageLabel(p)` |
| 214 | `"Erste Seite"` | `firstLabel` |
| 215 | `"Vorherige Seite"` | `previousLabel` |
| 217 | `"Nächste Seite"` | `nextLabel` |
| 218 | `"Letzte Seite"` | `lastLabel` |
| 239 | `"Zurück"` | `backLabel` |
| 244–247 | `"Seite "`, `<b>{current}</b>`, `" von "`, `count` | `pageOfLabel(current, count)` |
| 257 | `"Weiter"` | `forwardLabel` |
| 274 | `"Einträge pro Seite"` (sichtbar) | `pageSizeLabel` |
| 281 | `"Einträge pro Seite"` (`aria-label`) | `pageSizeLabel` |
| 292 | `from + "–" + to + " von " + totalItems` | `rangeLabel(from, to, totalItems)` |
| 304 | `"Gehe zu"` | `jumpLabel` |
| 309 | `"Zu Seite springen"` | `jumpAriaLabel` |

### Die Regel hinter der Typwahl

**`aria-label`-Texte sind `string`, sichtbare Texte sind `React.ReactNode`.** Ein `aria-label` nimmt
nur reinen Text; ein Element darin wäre unwirksam. `pageSizeLabel` steht an beiden Stellen und ist
deshalb `string`.

Wo ein Wert eingesetzt wird, ist die Angabe eine Funktion. Ein Platzhaltermuster in einer
Zeichenkette wäre eine neue Erfindung im System und würde `<b>` in der kompakten Form verlieren.

### 7a · `ui/Pagination.d.ts`

Alt
```ts
  ariaLabel?: string;
  className?: string;
```

Neu
```ts
  ariaLabel?: string;
  /** `aria-label` je Seitenschaltfläche. Standard `Seite ${page}`. */
  pageLabel?: (page: number) => string;
  /** `aria-label` der Schaltfläche „erste Seite" (`showFirstLast`). Standard „Erste Seite". */
  firstLabel?: string;
  /** `aria-label` der Schaltfläche „vorherige Seite". Standard „Vorherige Seite". */
  previousLabel?: string;
  /** `aria-label` der Schaltfläche „nächste Seite". Standard „Nächste Seite". */
  nextLabel?: string;
  /** `aria-label` der Schaltfläche „letzte Seite" (`showFirstLast`). Standard „Letzte Seite". */
  lastLabel?: string;
  /** Sichtbare Beschriftung der Zurück-Schaltfläche (`variant="compact"`). Standard „Zurück". */
  backLabel?: React.ReactNode;
  /** Sichtbare Beschriftung der Weiter-Schaltfläche (`variant="compact"`). Standard „Weiter". */
  forwardLabel?: React.ReactNode;
  /** Seitenanzeige (`variant="compact"`). Standard `Seite <b>${page}</b> von ${pageCount}`. */
  pageOfLabel?: (page: number, pageCount: number) => React.ReactNode;
  /** Beschriftung der Auswahl „Einträge pro Seite" (`variant="bar"`). Steht sichtbar
   *  daneben und zugleich als `aria-label` am Auswahlfeld, deshalb reiner Text.
   *  Standard „Einträge pro Seite". */
  pageSizeLabel?: string;
  /** Bereichsanzeige (`variant="bar"`, braucht `totalItems`).
   *  Standard `${from}–${to} von ${totalItems}`. */
  rangeLabel?: (from: number, to: number, totalItems: number) => React.ReactNode;
  /** Sichtbare Beschriftung des Direktsprungfelds (`showJump`). Standard „Gehe zu". */
  jumpLabel?: React.ReactNode;
  /** `aria-label` des Direktsprungfelds (`showJump`). Standard „Zu Seite springen". */
  jumpAriaLabel?: string;
  className?: string;
```

### 7b · `ui/Pagination.jsx` — Signatur

Alt
```js
  ariaLabel = "Seitennummerierung",
  className,
  style,
  ...rest
```

Neu
```js
  ariaLabel = "Seitennummerierung",
  pageLabel = (page) => "Seite " + page,
  firstLabel = "Erste Seite",
  previousLabel = "Vorherige Seite",
  nextLabel = "Nächste Seite",
  lastLabel = "Letzte Seite",
  backLabel = "Zurück",
  forwardLabel = "Weiter",
  pageOfLabel = (page, pageCount) => ["Seite ", React.createElement("b", { key: "p" }, page), " von ", pageCount],
  pageSizeLabel = "Einträge pro Seite",
  rangeLabel = (from, to, totalItems) => from + "–" + to + " von " + totalItems,
  jumpLabel = "Gehe zu",
  jumpAriaLabel = "Zu Seite springen",
  className,
  style,
  ...rest
```

Der Vorgabewert von `pageOfLabel` gibt ein Array zurück und trägt deshalb ein `key` am `<b>` —
sonst warnt React über fehlende Schlüssel in einer Liste.

### 7c · `ui/Pagination.jsx` — Einsetzstellen

| Zeile | Alt | Neu |
|---|---|---|
| 197 | `"aria-label": "Seite " + p,` | `"aria-label": pageLabel(p),` |
| 214 | `iconBtn("first_page", "Erste Seite", ...)` | `iconBtn("first_page", firstLabel, ...)` |
| 215 | `iconBtn("chevron_left", "Vorherige Seite", ...)` | `iconBtn("chevron_left", previousLabel, ...)` |
| 217 | `iconBtn("chevron_right", "Nächste Seite", ...)` | `iconBtn("chevron_right", nextLabel, ...)` |
| 218 | `iconBtn("last_page", "Letzte Seite", ...)` | `iconBtn("last_page", lastLabel, ...)` |
| 239 | `"Zurück"` | `backLabel` |
| 242–248 | `React.createElement("span", { className: "medo-pag__info" }, "Seite ", React.createElement("b", null, current), " von ", count)` | `React.createElement("span", { className: "medo-pag__info" }, pageOfLabel(current, count))` |
| 257 | `"Weiter",` | `forwardLabel,` |
| 274 | `..., "Einträge pro Seite"),` | `..., pageSizeLabel),` |
| 281 | `"aria-label": "Einträge pro Seite",` | `"aria-label": pageSizeLabel,` |
| 292 | `from + "–" + to + " von " + totalItems` | `rangeLabel(from, to, totalItems)` |
| 304 | `..., "Gehe zu"),` | `..., jumpLabel),` |
| 309 | `"aria-label": "Zu Seite springen",` | `"aria-label": jumpAriaLabel,` |

**Achtung bei Zeile 214–218:** `iconBtn` nutzt sein zweites Argument heute doppelt — als
`aria-label` **und** als React-`key` (`key: label`). Das bleibt so und funktioniert weiter, weil
alle vier Werte verschieden sind. Setzt ein Abnehmer jedoch zwei gleiche Beschriftungen, kollidieren
die Schlüssel. Deshalb ist `iconBtn` um ein eigenes Schlüsselargument zu erweitern:

Alt
```js
const iconBtn = (glyphName, label, disabled, onClick) =>
  React.createElement("button", { key: label, type: "button", ... });
```

Neu
```js
const iconBtn = (glyphName, label, disabled, onClick, key) =>
  React.createElement("button", { key: key || glyphName, type: "button", ... });
```

Die vier Aufrufe bleiben unverändert — `glyphName` ist je Aufruf verschieden und trägt den
Schlüssel damit von selbst.

### 7d · `ui/Pagination.prompt.md`

Neuer Abschnitt hinter „Barrierefreiheit":

```markdown
## Beschriftungen

Alle Texte der Komponente sind einstellbar und stehen vorbelegt auf Deutsch: `pageLabel`,
`firstLabel`, `previousLabel`, `nextLabel`, `lastLabel`, `backLabel`, `forwardLabel`,
`pageOfLabel`, `pageSizeLabel`, `rangeLabel`, `jumpLabel`, `jumpAriaLabel`. Wer die Komponente in
einer anderen Sprache einsetzt, übergibt sie; wer nichts übergibt, bekommt die deutschen Texte.

Wo eine Zahl im Text steht, ist die Angabe eine Funktion: `pageLabel(page)`,
`pageOfLabel(page, pageCount)`, `rangeLabel(from, to, totalItems)`. Die drei `aria-label`-Angaben
nehmen nur reinen Text — ein Element darin bliebe für Vorleseprogramme stumm.
```

### Was danach anders ist

Nichts an der Oberfläche. Alle Vorgabewerte sind die heutigen Texte, Zeichen für Zeichen.

---

## 8 · `ContainedList`: fest verdrahteter Text der Zeilenaktion

**Dateien:** `ui/ContainedList.d.ts`, `ui/ContainedList.jsx`, `ui/ContainedList.prompt.md`

### Der Befund

`ui/ContainedList.jsx`, Zeile 270:

```js
"aria-label": it.actionLabel || "Weitere Aktionen",
```

Je Zeile lässt sich `actionLabel` schon setzen — das ist das Muster, dem die übrigen Änderungen
dieses Dokuments folgen. **Der Rückfallwert ist aber fest deutsch.** Wer eine Liste mit zwanzig
Zeilen in einer anderen Sprache zeigt, müsste zwanzigmal dieselbe Beschriftung wiederholen.

### 8a · `ui/ContainedList.d.ts`

Alt
```ts
  /** Text, wenn die Liste leer ist. */
  emptyText?: React.ReactNode;
  ariaLabel?: string;
```

Neu
```ts
  /** Text, wenn die Liste leer ist. */
  emptyText?: React.ReactNode;
  /** `aria-label` der Zeilenaktion, wenn die Zeile selbst keines mitbringt.
   *  Standard „Weitere Aktionen". */
  actionLabel?: string;
  ariaLabel?: string;
```

`ContainedListItem.actionLabel` bleibt unverändert. Die Zeile schlägt die Komponente.

### 8b · `ui/ContainedList.jsx`

Signatur, alt
```js
  emptyText,
  ariaLabel,
```

Signatur, neu
```js
  emptyText,
  actionLabel = "Weitere Aktionen",
  ariaLabel,
```

Zeile 270, alt
```js
"aria-label": it.actionLabel || "Weitere Aktionen",
```

Zeile 270, neu
```js
"aria-label": it.actionLabel || actionLabel,
```

### 8c · `ui/ContainedList.prompt.md`

Im Abschnitt „Zeile" ergänzen:

> Trägt eine Zeile eine Aktion, braucht sie eine Beschriftung — ein Icon allein sagt einem
> Vorleseprogramm nichts. `actionLabel` an der Zeile beschreibt die einzelne Aktion („Termin
> absagen"); `actionLabel` an der Liste setzt den gemeinsamen Rückfallwert für alle Zeilen, die
> keinen eigenen tragen. Vorbelegt ist „Weitere Aktionen".

### Was danach anders ist

Nichts an der Oberfläche.

### Ein angrenzender Befund, der hier ausdrücklich **nicht** mitgeändert wird

`emptyText` hat keinen Vorgabewert. Ist die Liste leer und `emptyText` nicht gesetzt, rendert
`ui/ContainedList.jsx` Zeile 317 ein leeres `div.medo-clist__empty` — sichtbar ist gar nichts.
Der Inhaber hat entschieden, das vorerst so zu lassen: ein Vorgabetext wäre eine sichtbare
Änderung dort, wo heute nichts steht. **Nicht anfassen.**

---

## 9 · `Tabs`: `contained` zusammen mit `scrollable` ist wirkungslos

**Dateien:** `ui/Tabs.jsx`, `ui/Tabs.d.ts`, `ui/Tabs.prompt.md`
**Unverändert:** `components/Tabs.dc.html` — die Überlauf-Ansicht dort (Zeile 115–117) zeigt den
Unterstrich-Stil mit `display:flex`, widerspricht also nichts.

### Der Befund, gemessen

`.medo-tabs__list--contained` setzt `display: inline-flex`. Ein solches Feld wird auf seinen
eigenen Inhalt gemessen, nicht auf den verfügbaren Platz. `overflow-x: auto` aus
`.medo-tabs__list--scroll` bekommt damit nie etwas zu rollen: Sichtfeld und Inhalt sind gleich
breit. Statt zu rollen läuft die Leiste seitlich aus dem Elternfeld, und die ganze Seite bekommt
einen waagerechten Rollbalken.

Gemessen in Chromium, acht Tabs, Elternfeld 380 px, Fenster 420 px:

| Stil | `scrollable` | `display` | Sichtfeld | Inhalt | rollt? | Seite läuft über? |
|---|---|---|---|---|---|---|
| `underline` | nein | `flex` | 380 | 805 | ja | **ja** |
| `underline` | ja | `flex` | 380 | 805 | ja | nein |
| `contained` | nein | `inline-flex` | 869 | 869 | nein | **ja** |
| `contained` | **ja** | `inline-flex` | 869 | 869 | **nein** | **ja** |

Die letzten beiden Zeilen sind identisch: **`scrollable` tut bei `contained` buchstäblich nichts.**

Derselbe Fehler steht in `ui/Tabs.jsx` (CSS-Zeilen 17–22 und 73–74, Klassenlogik Zeile 175–178).
`ui/Tabs.prompt.md` sagt heute *„Ab etwa sieben Tabs `scrollable` setzen"* ohne Einschränkung auf
einen Stil — verspricht also etwas, das die Umsetzung nur in einem von beiden hält.

### Die Entscheidung des Inhabers

**Die Leiste behält ihre Breite und rollt in einer eigenen Hülle.** Die graue Wanne umschließt
weiterhin genau die Tabs; passen alle, sieht es aus wie heute. Die Alternative — die Wanne bei
`scrollable` auf volle Breite dehnen — wurde verworfen, weil sie das Aussehen auch dort ändert, wo
alles passt.

### 9a · `ui/Tabs.jsx` — CSS

`.medo-tabs__list--scroll` **ersetzen** durch eine Hülle:

Alt
```css
.medo-tabs__list--scroll{
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.medo-tabs__list--scroll::-webkit-scrollbar{ display: none; width: 0; height: 0; }
```

Neu
```css
/* Gerollt wird die Hülle, nicht die Leiste: `contained` ist inline-flex und misst sich am
   eigenen Inhalt, hätte also nie etwas zu rollen. `max-content` hält die Leiste in ihrer
   natürlichen Breite, damit die Hülle überhaupt einen Überhang bekommt. */
.medo-tabs__scroller{
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.medo-tabs__scroller::-webkit-scrollbar{ display: none; width: 0; height: 0; }
.medo-tabs__scroller > .medo-tabs__list{ width: max-content; }
```

### 9b · `ui/Tabs.jsx` — Aufbau

Die Klasse `medo-tabs__list--scroll` entfällt aus der Klassenliste der Tabliste:

Alt
```js
className: [
  "medo-tabs__list",
  "medo-tabs__list--" + (vertical ? "vertical" : variant),
  "medo-tabs__list--" + size,
  scrollable && !vertical ? "medo-tabs__list--scroll" : null,
]
```

Neu
```js
className: [
  "medo-tabs__list",
  "medo-tabs__list--" + (vertical ? "vertical" : variant),
  "medo-tabs__list--" + size,
]
```

Stattdessen wird die fertige Tabliste in eine Hülle gelegt, wenn `scrollable` gesetzt und die
Ausrichtung waagerecht ist. Die Hülle liegt **zwischen** dem äußeren `div.medo-tabs` und der
Tabliste; das Panel bleibt außerhalb:

```js
const list = React.createElement("div", { ref: listRef, role: "tablist", ... }, tabs);
const listOrScroller =
  scrollable && !vertical
    ? React.createElement("div", { className: "medo-tabs__scroller" }, list)
    : list;
```

und `listOrScroller` tritt an die Stelle, an der heute die Tabliste unmittelbar im äußeren `div`
steht.

**Ohne `scrollable` entsteht kein zusätzliches Element** — der Aufbau bleibt dann Zeichen für
Zeichen der heutige.

### 9c · `ui/Tabs.d.ts`

Alt
```ts
  /** Waagerecht scrollbar statt Umbruch, ohne sichtbare Scrollbar. */
  scrollable?: boolean;
```

Neu
```ts
  /** Waagerecht scrollbar statt Umbruch, ohne sichtbare Scrollbar. Wirkt in beiden
   *  Stilen; bei `contained` behält die Leiste dabei ihre Breite und rollt in einer
   *  eigenen Hülle. Ohne Wirkung bei `orientation="vertical"`. */
  scrollable?: boolean;
```

### 9d · `ui/Tabs.prompt.md`

Im Abschnitt „Aufbau", hinter *„Ab etwa sieben Tabs `scrollable` setzen"*, ergänzen:

> Das gilt für beide Stile. Bei `contained` bleibt die graue Leiste dabei so breit wie ihre Tabs
> und rollt innerhalb des verfügbaren Platzes — sie dehnt sich nicht auf die volle Breite.
> `fullWidth` und `scrollable` schließen einander aus: gleich breite Tabs setzen voraus, dass alle
> gleichzeitig sichtbar sind. Ist beides gesetzt, gewinnt `scrollable`.

### Was danach anders ist

Mit `contained` **und** `scrollable`: die Leiste rollt seitlich, statt die Seite zu verbreitern.
Mit `underline` und `scrollable`: unverändert — gemessen, Sichtfeld 380, Inhalt 805, rollt, kein
Seitenüberlauf. Ohne `scrollable`: unverändert, kein zusätzliches Element im Aufbau.

Gemessen nach der Änderung, dieselben Bedingungen:

| Stil | Tabs | Sichtfeld | Inhalt | Leiste | rollt? | Seite läuft über? |
|---|---|---|---|---|---|---|
| `underline` | 8 | 380 | 805 | 805 | ja | nein |
| `underline` | 3 | 380 | 380 | 263 | nein | nein |
| `contained` | 8 | 380 | 869 | 869 | ja | nein |
| `contained` | 3 | 380 | 380 | 307 | nein | nein |

Die Zeile mit drei Tabs zeigt das Entscheidende: die Leiste bleibt 307 px schmal und umschließt
weiterhin genau die Tabs.

### Ein Hinweis für die abnehmende Seite

Im abgeleiteten Doku-Portal wird `Tabs` mit `variant="contained"` in der eigenen Kopfleiste
verwendet — dort **ohne** `scrollable`, in einer selbst gebauten rollenden Hülle. Diese Hülle
bleibt auch nach dieser Änderung nötig: sie trägt zugleich die haftende Positionierung und ist der
Bezugspunkt einer eigenen Logik, die den gewählten Tab in den sichtbaren Bereich schiebt. Diese
Logik rollt die Hülle unmittelbar und käme an die neue, komponenteneigene Hülle nicht heran.

**Für das Design-Projekt folgt daraus nichts** — es ist hier nur festgehalten, damit die
abnehmende Seite die Kopfleiste nicht versehentlich auf `scrollable` umstellt. Ohne
`scrollable` entsteht kein zusätzliches Element, die Kopfleiste bleibt also unberührt.

---

## 10 · `{...rest}` verdrängt eingebaute Attribute

**Nach Änderung 5 auszuführen**, weil `ui/Select.jsx` in beiden vorkommt.

**Dateien:** `ui/TextInput.jsx`, `ui/Select.jsx`, `ui/Search.jsx`, `ui/NumberInput.jsx`,
`ui/Checkbox.jsx`, `ui/Radio.jsx`, `ui/Toggle.jsx`
**Unverändert:** die zugehörigen `.d.ts`. Es entsteht keine neue Angabe — die betroffenen Namen
stehen bereits im Vertrag, weil alle sieben Komponenten die Attribute ihres Elements erben.

### Der Befund

In allen sieben Komponenten steht `...rest` **hinter** eingebauten Attributen. Was der Aufrufer
übergibt, ersetzt damit das Eingebaute — lautlos, ohne Fehler, ohne Warnung.

**Maßgeblich ist die Destrukturierungsliste, nicht die Stellung von `...rest`.** In derselben
Datei steht `onChange` ebenfalls vor `...rest` und funktioniert trotzdem, weil es destrukturiert
ist und den Aufrufer-Wert deshalb nie erreicht. Wer nach der Stellung sucht, findet die falschen
Fälle.

Die Folgen treffen die Barrierefreiheit:

- Übergibt ein Abnehmer ein eigenes `onFocus`, verschwindet der Fokusrahmen. Wer mit der Tastatur
  arbeitet, sieht nicht mehr, wo er ist.
- Übergibt er ein eigenes `aria-describedby`, wird die Fehlermeldung für Vorleseprogramme
  unauffindbar.
- Übergibt er ein eigenes `aria-invalid`, gilt das Feld als fehlerfrei, während die rote Meldung
  sichtbar danebensteht.
- Bei `Toggle` schaltet ein eigenes `onClick` den Schalter ganz ab.

### Die Erhebung über alle acht Feldkomponenten

Je Komponente geprüft, welche eingebauten Attribute vor `...rest` stehen und ob sie destrukturiert
sind. Herkunft je Fall bestimmt: steht dieselbe Auslassung schon im Referenzcode, gehört die
Korrektur hierher; ist sie erst beim Ableiten entstanden, gehört sie nicht in dieses Dokument.

| Komponente | Betroffen | Verdrängte Attribute | Herkunft |
|---|---|---|---|
| `TextInput` | **ja** | `aria-invalid`, `aria-describedby`, `onFocus`, `onBlur` | Referenz — `ui/TextInput.jsx` 134–139 |
| `Select` | **ja** | beide Auslöser: `aria-invalid`, `onFocus`, `onBlur`; der gestaltete zusätzlich `onClick`, `onKeyDown` | Referenz — `ui/Select.jsx` 427–431 und 527–533 |
| `Search` | **ja** | `aria-invalid`, `onKeyDown`, `onFocus`, `onBlur` | Referenz — `ui/Search.jsx` 288–294 |
| `NumberInput` | **ja** | `aria-invalid`, `onKeyDown`, `onFocus`, `onBlur` | Referenz — `ui/NumberInput.jsx` 218–227 |
| `Checkbox` | **ja** | `aria-invalid` | Referenz — `ui/Checkbox.jsx` 133–134 |
| `Radio` | **ja** | `aria-invalid` | Referenz — `ui/Radio.jsx` 161–162 |
| `Toggle` | **ja** | `onClick`, `aria-checked`, `aria-busy` | Referenz — `ui/Toggle.jsx` 181 |
| `Textarea` | **ja** | `aria-invalid`, `aria-describedby`, `onFocus`, `onBlur` | **nicht Referenz** — die Komponente existiert im Design-Projekt nicht |

**Sieben von acht stammen aus dem Referenzcode** und werden hier behoben. Die achte, `Textarea`,
hat im Design-Projekt keine Quelle; sie wird im abgeleiteten Paket korrigiert und ist **nicht
Gegenstand dieses Dokuments**. Bei allen sieben ist die Destrukturierungsliste im Design-Projekt
Zeichen für Zeichen dieselbe wie im abgeleiteten Paket — die Auslassung ist also nicht beim
Ableiten entstanden.

`onChange` ist in **keiner** der acht Komponenten betroffen: es ist überall destrukturiert. Eine
frühere Vermutung des Gegenteils wurde durch Messung widerlegt.

### Die Korrektur, dreierlei Art

**Ereignisse werden zusammengeführt, nicht ersetzt.** Der Name wird destrukturiert, der eingebaute
Handler läuft zuerst, danach der des Aufrufers:

```js
// in der Signatur, vor `...rest`
onFocus,
onBlur,

// am Element, an der Stelle des heutigen Handlers
onFocus: (e) => { setFocused(true); if (onFocus) onFocus(e); },
onBlur: (e) => { setFocused(false); if (onBlur) onBlur(e); },
```

Ebenso für `onKeyDown` (`Search`, `NumberInput`, `Select`) und `onClick` (`Toggle`, `Select`). Bei
`onKeyDown` läuft der eingebaute Handler zuerst, weil er die Pfeiltasten abfängt.

Bei `Toggle` heißt der eingebaute Handler `toggle` und nimmt heute kein Argument:

```js
onClick: (e) => { toggle(); if (onClick) onClick(e); },
```

**`aria-invalid`: der Fehlerzustand der Komponente gewinnt, sonst der Aufrufer.** Eine sichtbare
Fehlermeldung darf nicht überschrieben werden, ein eigenes `aria-invalid` ohne `error` aber schon:

```js
// in der Signatur, vor `...rest`
"aria-invalid": ariaInvalid,

// am Element
"aria-invalid": error ? "true" : ariaInvalid,
```

Bei `Checkbox` und `Radio` ist `error` ein `boolean`, sonst eine Zeichenkette — die Schreibweise
bleibt in beiden Fällen dieselbe.

**`aria-describedby`: beide Kennungen nebeneinander.** Das Attribut nimmt eine durch Leerzeichen
getrennte Liste; die Meldung der Komponente tritt neben den Hinweis des Aufrufers:

```js
// in der Signatur, vor `...rest`
"aria-describedby": ariaDescribedBy,

// am Element (heute: error || success || hint ? fieldId + "-msg" : undefined)
"aria-describedby":
  [ariaDescribedBy, error || success || hint ? fieldId + "-msg" : null]
    .filter(Boolean)
    .join(" ") || undefined,
```

Betrifft nur `TextInput` — die übrigen sechs setzen heute kein `aria-describedby`.

**Bei `Toggle`** kommen `aria-checked` und `aria-busy` hinzu. Beide beschreiben den Zustand der
Komponente und dürfen nicht überschreibbar sein; hier genügt es, `...rest` **vor** die beiden
Attribute zu ziehen, weil kein Aufrufer sie sinnvoll setzen kann. Für `onClick` reicht das nicht —
dort ist das Zusammenführen oben nötig.

### Was danach anders ist

Nichts an der Oberfläche. **Es bricht nichts:** wer heute ein eigenes `onFocus` übergibt, bekommt
danach zusätzlich den Fokusrahmen zurück, den er ohnehin erwartet hat. Wer nichts übergibt, merkt
keinen Unterschied.

---

## Was ausdrücklich unberührt bleibt

- **`components/*.dc.html`** — mit einer Ausnahme, die keine ist: `components/Select.dc.html` ist
  der Maßstab für Änderung 5 und bleibt genau deshalb, wie es ist. Keine Spezifikationsseite ist
  zu ändern. Sie sind von Hand gebaute Ansichten mit Inline-Stilen und enthalten weder
  `medo-`-Klassennamen noch Props-Tabellen.
- **`styles.css`, `tokens.css`, `tokens.json`, `tokens/`** — kein Token wird angelegt, geändert
  oder entfernt. Alle neuen CSS-Regeln benutzen ausschließlich bestehende `--medo-*`-Tokens.
- **`ui/*.card.html`** — die Karten übergeben Props und laden das Bündel; keine nennt eine
  `medo-`-Klasse.
- **`ui/Textarea.*`** — existiert im Design-Projekt nicht und wird hier nicht angelegt. Der
  Vertrag für `Textarea` ist ein eigener Vorgang.
- **`ContainedList.emptyText`** — bekommt keinen Vorgabewert (siehe Änderung 8).
- **Die Namen der CSS-Konstanten und der `injectCss`-Kennungen** in Änderung 6.
- **`onChange` in allen acht Feldkomponenten** — nicht betroffen, nicht anfassen.
- **`ContainedListItem.actionLabel`** — bleibt, wie es ist; die neue Angabe an der Liste ist nur
  der Rückfallwert.

## Gelockte Beschlüsse

Geprüft gegen die gelockten Beschlüsse. **Kein Beschluss wird berührt.** Zwei Stellen kommen ihnen
nahe und halten sie ein:

- *„Prefix `medo`"* — Änderung 6 vergibt `medo-cds` und `medo-ctsw`; beide beginnen mit `medo-`.
  Der Beschluss betrifft ohnehin die Token-Benennung, nicht Komponenten-Klassenpräfixe.
- *„Checkbox uses radius-sm 4px. Checkbox/Radio box 18px (sm) / 20px (md)"* — das neue
  Kontrollkästchen in Änderung 5 misst
  `calc(var(--medo-space-md) + var(--medo-space-2xs))` = 16 + 4 = **20 px** und trägt
  `var(--medo-radius-sm)`. Es entspricht dem Beschluss und dem, was
  `components/Select.dc.html` Zeile 113 zeigt.

Ebenfalls geprüft und nicht berührt: die Regel zur Feldrahmenstärke (`border-thin` überall), die
Regel zu Chips (`radius-full`), die Regel zum Fokusring (`primary-600`), die Icon-Regel (nur
Material Symbols Rounded; die neuen Icons sind `search` und `check`).

## Nach dem Anwenden

1. `_ds_bundle.js` neu bauen. Ohne das wirkt keine der Codeänderungen in den Karten.
2. `ui/CodeSnippet.card.html` und `ui/ContentSwitcher.card.html` im Browser öffnen — beide müssen
   aussehen wie zuvor.
3. `ui/Select.card.html` öffnen und `searchable` an einem Beispiel setzen.
4. Danach wird der Spiegel im abgeleiteten Projekt neu gezogen und gegen die Dateiliste oben
   abgeglichen.

---

## Anhang · Nachweise

### Typprüfung

Umgebung eigens eingerichtet — das abgeleitete Projekt ist ein reines JavaScript-Projekt und hat
kein TypeScript. TypeScript 5.4.5, `@types/react` 18.3.31 und 19.2.18, `strict: true`,
**`skipLibCheck: false`** — also genau die Einstellung, die der heutige Stand von `TextInput.d.ts`
unmöglich macht.

Geprüft wurde nicht nur die geänderte Datei, sondern **alle 35 Verträge zusammen**, dazu eine
Nutzungsprobe, die jede in diesem Dokument neu vorgeschlagene Angabe einmal mit dem vorgesehenen
Typ setzt.

| Lauf | Ergebnis |
|---|---|
| 35 Verträge + Nutzungsprobe, `@types/react` 18 | keine Fehler |
| 35 Verträge + Nutzungsprobe, `@types/react` 19 | keine Fehler |

Gegenproben, damit ein grüner Lauf etwas belegt — alle vier schlagen an:

| Gegenprobe | Meldung |
|---|---|
| `"prefix"` aus dem `Omit` entfernt | `TS2430` |
| `size="xl"` an `TextInput` | `TS2322` |
| `pageSizeLabel={<b>…</b>}` statt Text | `TS2322: Type 'Element' is not assignable to type 'string'` |
| `flagge` statt `flag` an einer Option | `TS2353: … 'flagge' does not exist in type 'SelectOption \| SelectOptionGroup'` |

### Kollisionen mit HTML-Attributen

Jeder in diesem Dokument angefasste oder neu vorgeschlagene Name wurde gegen die Attributmengen von
`<input>`, `<select>`, `<textarea>`, `<nav>`, `<fieldset>` und `<button>` geprüft — nicht
nachgeschlagen, sondern vom Typprüfer ausgeben lassen. Ergebnis in beiden React-Fassungen gleich:

| Name | Kollidiert mit einem HTML-Attribut | Folge |
|---|---|---|
| `prefix` | **ja, an jedem Element** (RDFa, `string`) | **TS2430** — Gegenstand von Änderung 1 |
| `size` | ja, an `<input>` und `<select>` (`number`) | schon heute ausgeschlossen |
| `className`, `style`, `children` | ja, aber typgleich | unbedenklich |
| `suffix` | **nein** | unbedenklich |
| alle zwölf neuen `Pagination`-Namen | nein | unbedenklich |
| alle sieben neuen `Select`-Namen | nein | unbedenklich |
| `actionLabel` | nein | unbedenklich |

`suffix` ist ausdrücklich geprüft worden, weil es neben `prefix` steht und der naheliegende
Verdacht wäre — es ist kein HTML-Attribut, und `suffix?: React.ReactNode` bleibt gültig.

### Doppelte Typnamen

Der Vertragsgenerator des abgeleiteten Pakets erzeugt je Vertrag ein flaches
`export type { … }`. Zwei Verträge mit demselben exportierten Typnamen brächen den Paketbau.
Über alle 35 Verträge im Neuzustand erhoben: **70 exportierte Typnamen, keine Doppelung.** Dieses
Dokument führt keinen neuen exportierten Typnamen ein — alle Änderungen sind Mitglieder
bestehender Schnittstellen.

### Browsermessung

Chromium 1208 (Playwright), Fenster 420 px, Elternfeld 380 px, acht beziehungsweise drei Tabs,
gemessen an `clientWidth`, `scrollWidth` und `documentElement.scrollWidth`. Die Tabellen stehen bei
Änderung 9. Beide Lösungswege wurden gemessen, bevor einer vorgeschlagen wurde.

### Herkunft der `{...rest}`-Fälle

Für alle acht Feldkomponenten wurde die Destrukturierungsliste im Design-Projekt gegen die im
abgeleiteten Paket gestellt. Bei den sieben Komponenten, die im Design-Projekt existieren, sind die
Listen deckungsgleich — die Auslassung stammt also aus dem Referenzcode und gehört hierher. Die
Tabelle steht bei Änderung 10.
