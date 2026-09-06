# Abgleich der Anwendung — Übergabedokument Verträge

**Stand:** 05.09.2026 · Quelle: `medo Design System`, projectId `9bff25e1-b01d-4339-ac16-a6e8fc26cdd3`
**Verglichen gegen:** `.apm/design-project-backup/project/` (Sicherung vom 31.08.2026, byteweise
deckungsgleich mit dem Spiegelstand vor der Anwendung).

**Verfahren:** Jede Zieldatei einzeln über `get_file` gezogen, in `design-reference/` geschrieben und
byteweise gegen den Vorstand gediffed. Jeder Diff-Block ist einer Anweisung des Dokuments
zuzuordnen; ein unerwarteter Block wäre ein Übertragungsfehler oder eine Zutat.

## Ergebnis je Änderung

| # | Datei | Diff-Blöcke | Ergebnis |
|---|---|---|---|
| 1 | `ui/TextInput.d.ts` | 1 | genau umgesetzt, wortgleich |
| 2 | `ui/Field.d.ts` | 1 | genau umgesetzt, wortgleich |
| 3 | `ui/Checkbox.d.ts` | 1 | genau umgesetzt, wortgleich |
| 4 | `ui/Radio.d.ts` | 1 | genau umgesetzt, wortgleich |
| 5a | `ui/Select.d.ts` | 2 | genau umgesetzt, wortgleich |
| 5b–5e + 10 | `ui/Select.jsx` | 14 | genau umgesetzt, wortgleich |
| 5f | `ui/Select.prompt.md` | 5 | genau umgesetzt; zwei Zeilen laufen über die Satzbreite (rein kosmetisch) |
| 6 | `ui/CodeSnippet.jsx` | 39 Ersetzungen | byte-identisch mit der mechanisch umbenannten Sicherung |
| 6 | `ui/ContentSwitcher.jsx` | 61 Ersetzungen | byte-identisch mit der mechanisch umbenannten Sicherung |
| 6 | `STATUS.md` | 1 | Umbenennung umgesetzt; dazu ein Altbefund, siehe unten |

## Befund: `STATUS.md` — Altfehler im Spiegel, jetzt behoben

An der Stelle „Leerzeilen rendern …" trägt die **Quelle** die sechs Zeichen ` `, der
**bisherige Spiegel und die Sicherung** dagegen ein echtes geschütztes Leerzeichen (`302 240`).
Das ist die Fehlerklasse, die Task 1.1 in vier Dateien gefangen hat — hier ist sie unbemerkt
geblieben, weil die Sicherung gegen den Spiegel geprüft wurde und **beide denselben Fehler
trugen**. Der neu gezogene Stand ist richtig; die Abweichung geht nicht auf die Anwendung zurück.

**Folge für Task 2.8:** Deckungsgleichheit Sicherung ↔ Spiegel belegt nur, dass beide gleich sind,
nicht dass beide stimmen. Maßgeblich ist der Vergleich gegen die frisch gezogene Quelle.

## Grenze: `_ds_bundle.js`

Die Datei überschreitet den 256-KiB-Deckel von `get_file`, ist im Spiegel nicht vorhanden und
damit **nicht prüfbar**. Sie musste nach den Änderungen neu gebaut werden; ihr Zustand ist mit den
zugelassenen Lesemethoden nicht verifizierbar.

## Befund: das Avatar-Dokument ist bereits angewandt

Die Aufgabenstellung geht davon aus, das Avatar-Dokument (`docs/uebergabe-avatar-und-textarea.md`)
sei **noch nicht** angewandt und werde `ContainedList` später um 3 / 2 / 2 Stellen ändern.
**Es ist bereits angewandt.** Belegt an zwei unabhängigen Stellen:

1. Die drei `ContainedList`-Dateien tragen zusätzlich zu den Anweisungen 8a–8c genau die Änderungen
   1–3 des Avatar-Dokuments, wörtlich: der Regelblock `.medo-clist__avatar` ist aus
   `MEDO_CLIST_CSS` entfernt, `AvatarCmp` ist aufgelöst, die Zeile rendert
   `React.createElement(AvatarCmp, { initials: it.avatar, size: "md", color: "teal" })`, der
   `avatar`-Kommentar im Vertrag ist erweitert, die Nutzungsregel zur Farbe steht in der
   `prompt.md`, und die Ladereihenfolge nennt `ui/Avatar.jsx`.
2. **Neun Dateien existieren in der Quelle, die es weder in der Sicherung noch im bisherigen
   Spiegel gibt:** `ui/Avatar.jsx`, `.d.ts`, `.prompt.md`, `.card.html`, `ui/Textarea.jsx`,
   `.d.ts`, `.prompt.md`, `.card.html` und `components/Textarea.dc.html`.

**Das ist keine Abweichung von diesem Dokument** — alle Anweisungen 8a–8c sind zusätzlich und
genau umgesetzt. Es ist eine Abweichung von der Annahme der Aufgabenstellung.

**Folgen:**

- Die Kollisionsprüfung b) läuft ins Leere: sie sollte den Zustand *vor* der Avatar-Anwendung
  festhalten. Festgehalten wird der Zustand **nach beiden Anwendungen** (siehe Prüfsummentabelle).
  Beide Dokumente sind in diesen drei Dateien nebeneinander angekommen, keines hat das andere
  überschrieben — das ist die eigentliche Antwort auf die Kollisionsfrage.
- Das Avatar-Dokument ändert außerdem `components/Contained-list.dc.html` — eine Datei, die
  **dieses** Dokument ausdrücklich als unberührt führt. Eine Abweichung dort ist dem
  Avatar-Dokument zuzurechnen, nicht diesem.
- Der Spiegel ist nach dieser Aufgabe **um neun Dateien unvollständig**. Sie liegen außerhalb des
  hier zugewiesenen Dateisatzes und wurden nicht gezogen. Das gehört in die Avatar-/Textarea-Arbeit.

## Befund: die Spezifikationsseiten sind nicht unberührt — Ursache liegt außerhalb

Alle 33 `components/*.dc.html` wurden byteweise gegen den Spiegel geprüft. **21 weichen ab.**
Keine einzige Abweichung stammt aus diesem Dokument.

| Ursache | Umfang |
|---|---|
| Fokusring `#0e9d9159` → `#007265bf` bzw. `primary[600] + '59'` → `+ 'bf'` | 20 Seiten |
| Avatar-Kreise in der Zustandsmatrix | `Contained-list.dc.html` |
| Teilstrichfarbe `#ffffffcc` → `rgba(255,255,255,0.75)` | `Slider.dc.html` |

Alle drei sind wörtlich im **Nachtrag zum Farbe-und-Tokens-Dokument** beschrieben
(`docs/nachtrag-farbe-und-tokens.md` §3.1, §3.2, §5) bzw. im Avatar-Dokument. Zahlenprobe: der
Nachtrag nennt für Schreibweise A „17 Vorkommen in 11 Dateien" — die Zählung im bisherigen
Spiegel ergibt exakt 17 Vorkommen in 11 Dateien.

**Folge:** Der Spiegel ist auch für diese 21 Spezifikationsseiten nicht mehr aktuell. Sie liegen
außerhalb des hier zugewiesenen Dateisatzes und wurden nicht nachgezogen; das gehört in den
Farb-/Avatar-Strang.

## Umfang der Bereichsprüfung

| Bereich | geprüft | Ergebnis |
|---|---|---|
| `components/*.dc.html` | 33 von 33 | 12 identisch, 21 abweichend (Ursachen oben) |
| `components/support.js` | 1 von 1 | identisch |
| `ui/*.card.html` | 22 von 33 | alle 22 identisch; `Avatar.card.html` und `Textarea.card.html` sind neu in der Quelle |
| `styles.css` | 1 von 1 | identisch |
| `tokens/semantic-colors.css` | 1 von 8 | identisch — die Quelle der Wahrheit der Token-Ebene |
| `tokens.css`, `tokens.json`, übrige `tokens/*.css` | 0 | **nicht geprüft** |

**Nicht geprüft blieben 10 Vorschaukarten und 9 Token-Dateien.** Grund: das Monats-Ausgabenlimit
hat die parallel laufende Prüfung abgebrochen. Die Lücke ist damit benannt und nicht überspielt.
Sie betrifft die risikoärmste Gruppe: die Karten übergeben nur Props, und die Token-Ebene ist an
ihrer Quelle der Wahrheit (`tokens/semantic-colors.css`) als deckungsgleich belegt — einschließlich
der beiden Werte, die das Farb-Dokument dort geändert hat (`--medo-focus-ring: #007265bf`,
`--medo-control-mark-on-primary: rgba(255,255,255,0.75)`).

## Bezugspunkt für Task 2.8 — die drei `ContainedList`-Dateien

Festgehalten **nach** beiden Anwendungen (Verträge-Dokument und Avatar-Dokument), Stand 06.09.2026:

| Datei | sha256 | Bytes | Zeilen | Zeilenenden |
|---|---|---|---|---|
| `ui/ContainedList.jsx` | `f8facd503ed20279824cb683d747e6f72db0ba5b60218c3dc2ac55175ddd0322` | 11338 | 321 | LF |
| `ui/ContainedList.d.ts` | `af04ded1151f4807001f14c874ca02cfdc494e2dfe22e867522223483cfb40f8` | 2143 | 57 | LF |
| `ui/ContainedList.prompt.md` | `d301d9da81d2457fcad3bf7f3ff3d2be56f69e3d4840fc123b73e09f9fad88f8` | 3697 | 82 | LF |

Geänderte Zeilen gegenüber dem Stand vor beiden Anwendungen (Sicherung vom 31.08.2026):
`.jsx` +5/−14, `.d.ts` +5/−1, `.prompt.md` +13/−1.

**Aufteilung nach Urheber:** Aus dem Verträge-Dokument stammen genau drei Stellen — `actionLabel`
in der Signatur (`.jsx`), `it.actionLabel || actionLabel` an der Zeilenaktion (`.jsx`), der
`actionLabel`-Eintrag im Vertrag (`.d.ts`) und der Absatz zur Beschriftung (`.prompt.md`). Alles
Übrige geht auf das Avatar-Dokument zurück.

## Kollisionsprüfung a) — `ui/Toggle.jsx`

**Bestanden.** Der richtige Vorstand ist hier **nicht** die Sicherung vom 31.08.2026, sondern der
Spiegel auf `main` — Anwendung 1 wurde nach der Sicherung ausgeführt und von Task 2.2 gespiegelt.

| | sha256 | Bytes | Zeilen |
|---|---|---|---|
| Vorstand (Spiegel `main`) | `73f3164a505c4a16cfdfcd0a3e30394fd7c66f6eb850f8bf9b28c8396b4f22bf` | 6459 | 190 |
| neu gezogen | `ab2df00366d25818d571df4f1021a3eee981fb87bdb0ae30a243d00f72e46583` | 6639 | 193 |

Der Vorstand trägt exakt die Prüfsumme, die Task 2.2 als Bezugswert genannt hat. Der Diff zeigt
**drei Blöcke, alle aus Änderung 10** — die Zeile aus Anwendung 1 ist nicht darunter:

```
const iconColor = on ? "var(--medo-action)" : "var(--medo-icon-on-light)";
```

Sie steht unverändert, jetzt auf **Zeile 118** statt 117: Änderung 10 fügt eine Zeile (`onClick,`)
oberhalb ein, die Nummer verschiebt sich um eins. Wäre die Datei als Ganzes neu geschrieben worden,
stünde dort wieder `var(--medo-color-stone-600)` — der Wert, den die Sicherung vom 31.08. noch
trägt. Er steht nicht dort.

## Reihenfolge-Abhängigkeiten — beide haben gegriffen

**10 nach 5** (`ui/Select.jsx`): Beide Änderungen stehen nebeneinander in derselben Datei. Die
Signatur trägt `searchable`, `searchPlaceholder`, `removeChipLabel`, `selectedCountLabel`,
`resetLabel`, `emptyText`, `noResultsText` (Änderung 5) **und** `onFocus`, `onBlur`, `onClick`,
`onKeyDown: onKeyDownProp`, `"aria-invalid": ariaInvalid` (Änderung 10). Keine hat die andere
überschrieben.

**12 nach 9** (`ui/Tabs.jsx`): Änderung 9 legt den Regelblock `.medo-tabs__scroller` an; Änderung 12
ergänzt darin `scroll-padding-inline`. Beides steht in **einem** Block — 12 hat auf 9 aufgebaut,
nicht neben ihr. Ebenso beim Aufbau: die Hülle aus 9b existiert genau einmal und trägt die
geweitete Bedingung aus 12b (`!vertical && !fullWidth` statt `scrollable && !vertical`). Im Vertrag
hat der Text aus 12d den Text aus 9c ersetzt, in der `prompt.md` der Absatz aus 12e den aus 9d —
in beiden Fällen ohne Rest der jeweils früheren Fassung.

## Eine Abweichung im Wortlaut, mit gutem Grund

**Backticks in den CSS-Kommentaren der Änderungen 9, 11 und 12 sind zu deutschen
Anführungszeichen geworden** — aus `` `contained` `` wurde „contained“, aus `` `max-content` ``
wurde „max-content“, ebenso bei `scrollable`, `min-width: 0`, `white-space: nowrap`, `md` und `xl`.

**Das ist eine Korrektur, kein Fehler.** Die betroffenen Kommentare stehen innerhalb von
`MEDO_TABS_CSS`, und dieser String ist ein Template-Literal — mit Backticks begrenzt. Ein Backtick
darin hätte den String beendet und die Datei zerstört. Das Dokument hat hier eine unausführbare
Anweisung gegeben; die anwendende Seite hat das gefangen. Außerhalb des Template-Literals sind die
Backticks erhalten geblieben (`fullWidth`, `scrollIntoView` in den JS-Kommentaren der Änderungen
12b und 12c) — die Umstellung ist also genau dort erfolgt, wo sie nötig war, und nirgends sonst.

Zwei weitere rein kosmetische Abweichungen: in `ui/Select.prompt.md` laufen zwei Zeilen über die
sonst gehaltene Satzbreite, weil eingefügter Text nicht neu umbrochen wurde; in `ui/Tabs.jsx`
beginnt der Kommentarblock vor `listOrScroller` in Spalte 0 statt eingerückt. Kein Zeichen am Inhalt.

## Typprüfung — ausgeführt

TypeScript 5.9.3, `strict: true`, **`skipLibCheck: false`**, alle 35 Verträge aus `src/types/` plus
eine Nutzungsprobe, die jede neue oder geänderte Angabe des Dokuments setzt.

| Lauf | Ergebnis |
|---|---|
| `@types/react` 18.3.31 | **keine Fehler** |
| `@types/react` 19.2.18 | **keine Fehler** |

**`TS2430` ist aufgelöst.** Abnehmer brauchen `skipLibCheck: true` nicht mehr.

Vier Gegenproben, alle rot — ein grüner Lauf, der nicht rot werden kann, belegt nichts:

| Gegenprobe | Ergebnis |
|---|---|
| `"prefix"` wieder aus dem `Omit` entfernt (alter Zustand) | `TS2430` — Wortlaut identisch mit dem Dokument |
| `size="xl"` an `TextInput` | `TS2322` |
| `pageSizeLabel={<b>…</b>}` statt Zeichenkette | `TS2322: Type 'Element' is not assignable to type 'string'` |
| `flagge` statt `flag` an einer Option | `TS2353` |

Nach dem Zurücksetzen der ersten Gegenprobe lief der Kontrolllauf wieder grün.

## Verträge in `src/types/`

Acht Verträge nachgezogen (`Checkbox`, `ContainedList`, `Field`, `Pagination`, `Radio`, `Select`,
`Tabs`, `TextInput`) — genau die acht, die das Dokument anfasst. Geschrieben über ein Node-Skript,
das die LF-Quelle auf CRLF umsetzt; danach mit `file` gegengeprüft: **alle acht CRLF**.

**Danach sind alle 35 Verträge nach Normalisierung der Zeilenenden wieder inhaltsgleich mit dem
Spiegel** — nachgemessen, nicht angenommen.

## Prüfläufe

| Lauf | Ergebnis |
|---|---|
| `npm test` | 26 Dateien, **223 Tests, alle grün** |
| `npm run build` | fehlerfrei, `verify-build.mjs` bestätigt beide Übersetzungen im Bundle |
| `npm run build:lib` | fehlerfrei, 35 Verträge über 36 Module, **nur die bekannte Lücke**: `Textarea` |
