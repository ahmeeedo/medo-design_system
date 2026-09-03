# Abgleich: Übergabedokument Farbe und Tokens gegen das Design-Projekt

**Stand:** 3. September 2026
**Grundlage:** `docs/uebergabe-farbe-und-tokens.md` (68 Einzelanweisungen in 10 Dateien)
**Geprüftes Projekt:** `medo Design System`, Projekt-ID `9bff25e1-b01d-4339-ac16-a6e8fc26cdd3`

---

## 1. Ergebnis in einem Satz

**Keine einzige der 68 Anweisungen ist im Design-Projekt angekommen.** Das Projekt steht Byte für Byte im Zustand vor der Übergabe. Es ist auch nichts Ungefragtes hinzugekommen.

| | Zahl |
|---|---|
| Anweisungen im Dokument | 68 |
| **genau umgesetzt** | **0** |
| **abgewichen (nicht ausgeführt)** | **68** |
| **ungefragt hinzugekommen** | **0** |
| Dateien mit Änderung | 0 von 10 |
| Mitzuführende Seiten mit Änderung | 0 von 13 |

Das ist keine fehlerhafte Anwendung, sondern eine **ausgebliebene**. Die Unterscheidung ist wichtig: es gibt keine halb umgesetzte Änderung, keinen verdorbenen Zwischenzustand und keinen Bedarf, aus der Sicherung zurückzuspielen. Das Design-Projekt ist unversehrt.

---

## 2. Wie geprüft wurde

Alle zehn Zieldateien wurden **einzeln aus dem Design-Projekt gezogen** und gegen das Dokument gelesen — nicht stichprobenweise, nicht über Größenvergleiche.

Zwei Dateien wurden darüber hinaus **byteweise** gegen ihren vorherigen Stand geprüft, mit `sha256` und `cmp`:

| Datei | gezogen | Git-Spiegel | Sicherung aus Task 1.1 |
|---|---|---|---|
| `tokens/semantic-colors.css` | `f73985d4…` | `f73985d4…` | `f73985d4…` |
| `ui/Toggle.jsx` | `ab2f1420…` | `ab2f1420…` | `ab2f1420…` |

Drei voneinander unabhängige Zeugen, identische Prüfsummen. Die Fehlerklasse aus Task 1.1 — Escape-Sequenzen und Entities, die als das Zeichen ankommen, das sie bezeichnen — kann damit für diese beiden Dateien ausgeschlossen werden; bei byteweiser Gleichheit gibt es keinen Übertragungsfehler.

Ein **Strukturvergleich** über `list_files` gegen den Spiegel ergab: keine Datei hinzugefügt, keine entfernt, keine umbenannt. Die Zahlen je Ordner stimmen (Komponenten 34, Richtlinien 41, Tokens 8, Schriften 7, `ui/` 139). Der Spiegel führt wie bekannt `_ds_bundle.js` und `thumbnail.html` nicht mit; das ist der bekannte Stand und keine Abweichung.

Ein weiteres, unabhängiges Anzeichen: der Zeitstempel des Projekts steht auf **9. August 2026**. Das Übergabedokument wurde am **29. August 2026** geschrieben. Am Projekt ist seit zwanzig Tagen vor Abfassung des Dokuments nicht geschrieben worden.

---

## 3. Die Prüfung Punkt für Punkt

### 3.1 Fall A — Deckkraft der Fokusringe von 35 % auf 75 %

| Verlangt | Tatsächlich | Befund |
|---|---|---|
| `semantic-colors.css` Z. 46: `#00726559` → `#007265bf` | `#00726559` | nicht ausgeführt |
| `semantic-colors.css` Z. 47: `#ab091359` → `#ab0913bf` | `#ab091359` | nicht ausgeführt |
| `tokens.css` Z. 334: `#00726559` → `#007265bf` | `#00726559` | nicht ausgeführt |
| `tokens.json` Z. 367: `"#00726559"` → `"#007265bf"` | `"#00726559"` | nicht ausgeführt |
| `CLAUDE.md`: „at the same 35% alpha" → „75% alpha" | steht auf `35% alpha` (Z. 72) | nicht ausgeführt |

Der Regeltext in `CLAUDE.md` führt die Deckkraft an **zwei** Stellen; beide stehen unverändert. Neben Zeile 72 auch Zeile 37: `focus-ring=primary-600 (rendered as 3px ring at ~35% alpha, hex+59)`. Das Dokument benennt in §2.3 nur Zeile 72 — **Zeile 37 ist im Dokument nicht erfasst.** Sie ist bei der Wiederholung mitzuführen, sonst widerspricht sich `CLAUDE.md` nach der Anwendung selbst.

### 3.2 Fall B — Akzentfarbe von der Füllfläche trennen

Die fünf neuen Token sind in **keiner** der vier Token-Dateien vorhanden. Suchtreffer für `accent` in `tokens/semantic-colors.css`: null.

| Verlangt | Tatsächlich | Befund |
|---|---|---|
| 5 neue Token (`success/warning/error/info-accent`, `accent-neutral`) | fehlen in allen vier Token-Dateien | nicht ausgeführt |
| `warning-solid-hover`: `amber-700` → `amber-500` | `amber-700` | nicht ausgeführt |
| `warning-solid-active`: `amber-800` → `amber-400` | `amber-800` | nicht ausgeführt |
| `tokens.json`: `"#c25e00"` → `"#f1924a"` | `"#c25e00"` | nicht ausgeführt |
| `tokens.json`: `"#a04800"` → `"#ffae74"` | `"#a04800"` | nicht ausgeführt |
| `Notification.jsx` Z. 87–91: fünf `accent`-Werte | alle fünf auf `-solid-hover` bzw. `--medo-color-stone-700` | nicht ausgeführt |
| `Modal.jsx` Z. 56–58: `-solid` → `-accent` | alle drei auf `-solid` | nicht ausgeführt |

### 3.3 Fall C1 — Textlink im hellen Theme

| Verlangt | Tatsächlich | Befund |
|---|---|---|
| `semantic-colors.css` Z. 17: `teal-600` → `teal-700` | `teal-600` | nicht ausgeführt |
| `tokens.css` Z. 305: dieselbe Änderung | `teal-600` | nicht ausgeführt |
| `tokens.json` Z. 338: `"#007265"` → `"#005e53"` | `"#007265"` | nicht ausgeführt |

`--medo-action` und `--medo-input-border-focus` stehen unverändert auf `teal-600`. Das ist so gewollt und hier nur als eingehaltene Nicht-Änderung vermerkt.

### 3.4 Fall C2 — betrifft das Design-Projekt nicht

Wie im Dokument (§4.2) beschrieben: **kein Arbeitsschritt oben.** Bestätigt — das Projekt kennt kein `light-dark()` und keinen dunklen Zweig. Das ist **keine Abweichung**, sondern der erwartete Zustand.

### 3.5 Fall D — Palettenstufe stone-500

| Verlangt | Tatsächlich | Befund |
|---|---|---|
| `brand-colors.css` Z. 192: `#94908c` → `#928e8a` | `#94908c` | nicht ausgeführt |
| `tokens.css` Z. 195: dieselbe Änderung | `#94908c` | nicht ausgeführt |
| `tokens.json`, sechs Stellen auf `#928e8a` | alle sechs auf `#94908c` | nicht ausgeführt |

Die sechs Stellen in `tokens.json` wurden einzeln nachgesehen und stehen alle unverändert: `color.brand.stone."500"`, `color.alias.neutral-alt."500"`, `color.semantic."text-disabled"`, `."icon-disabled"`, `."border-strong"`, `."action-text-disabled"`.

**Der Ausnahme-Eintrag in `CLAUDE.md` (§4.4) fehlt.** Hinter dem Absatz `### Color generation` folgt unmittelbar `### Key semantic tokens`; zwischen beiden steht nichts. Der Satz `Exception: stone-500 is #928e8a …` ist nicht vorhanden.

Das ist hier ohne Folge, weil auch der Farbwert selbst nicht geändert wurde — Wert und Ausnahme fehlen gemeinsam, das Projekt ist in sich schlüssig. **Bei der Wiederholung bleibt der Eintrag aber der kritische Punkt:** kommt der Wert ohne ihn, erzeugt der nächste Generatorlauf `#94908c` zurück und die Korrektur ist stillschweigend weg.

### 3.6 Die vier Rückläufer aus der Portierung

| Rückläufer | Verlangt | Tatsächlich | Befund |
|---|---|---|---|
| §5.2 Slider-Teilstriche | 2 neue Token, `Slider.jsx` Z. 252/253 | Token fehlen; beide Zeilen tragen `rgba(255,255,255,0.75)` und `var(--medo-color-stone-400)` | nicht ausgeführt |
| §5.3 Toggle-Symbol | `icon-on-light`, `Toggle.jsx` Z. 117 | Token fehlt; Z. 117 `var(--medo-color-stone-600)` | nicht ausgeführt |
| §5.4 Neutraler Akzent | `Notification.jsx` Z. 91 | `accent: "--medo-color-stone-700"` | nicht ausgeführt |
| §5.5 Wortmarke | 4× `currentColor`, 1× `var(--medo-logo-dot, …)`, Token `logo-dot` | 4× `fill="#24221e"`, 1× `fill="#007265"`; Token fehlt | nicht ausgeführt |

### 3.7 Der abgesetzte Befund aus §6

`--medo-focus-ring-danger` fehlt weiterhin in **beiden** flachen Exporten. In `tokens.css` folgt auf `--medo-focus-ring` direkt `--medo-state-hover`; in `tokens.json` auf `"focus-ring"` direkt `"state-hover"`.

Der Befund aus §6 besteht also unverändert. Da er ausdrücklich kein Beschluss war, ist sein Fehlen **keine Abweichung von einer Anweisung**, sondern ein weiterhin offener Punkt zur Entscheidung des Inhabers.

### 3.8 Die 13 mitzuführenden Seiten (§8)

Nicht einzeln geprüft — und das mit Absicht. Die Seiten führen Werte nach, die in den Token-Dateien nicht geändert wurden. Sie sind damit zwangsläufig ebenfalls unverändert und **korrekt**: eine Seite, die `text-link · teal-600` beschriftet, ist richtig, solange das Token auf `teal-600` steht. Ein Prüfen hätte nichts hinzugefügt.

Der Strukturvergleich bestätigt, dass keine dieser Seiten hinzugefügt, entfernt oder umbenannt wurde.

---

## 4. Festgehalten: der Zustand von `ui/Toggle.jsx`

Für die nachfolgende Abgleichsaufgabe, die dieselbe Datei an drei weiteren Stellen anfasst.

```
Datei      : ui/Toggle.jsx
sha256     : ab2f1420c9aadc634d928edc175fa1d1cc4625f0a653ae5ef399cbac25062387
Groesse    : 6461 Bytes
Zeilenende : LF
Zeilen     : 190
```

**Geänderte Stellen: keine.** Die vom Dokument in §5.3 vorgesehene Zeile 117 lautet unverändert:

```js
  const iconColor = on ? "var(--medo-action)" : "var(--medo-color-stone-600)";
```

Diese Prüfsumme ist der Bezugspunkt. Trägt die Datei nach der Vertragsanwendung **weder** diese Prüfsumme **noch** die Änderung aus §5.3, ist die Farbänderung entweder nie angekommen oder wieder verloren gegangen.

---

## 5. Was daraus folgt

**Die Sicherung wird nicht gebraucht.** Zurückspielen setzt einen verdorbenen Zustand voraus; der liegt nicht vor. Das Design-Projekt ist unversehrt und in genau dem Zustand, den `docs/uebergabe-farbe-und-tokens.md` als Ausgangslage beschreibt. Das Dokument ist unverändert anwendbar — Zeilennummern eingeschlossen, die alle noch stimmen (geprüft an Z. 17, 46, 47, 65, 66, 117, 192, 195, 305, 334, 338, 352, 353, 367, 385, 386).

**Zwei Nachträge für die Wiederholung:**

1. **`CLAUDE.md` Zeile 37** trägt die 35-%-Angabe ein zweites Mal (`hex+59`). Das Dokument erfasst sie nicht. Sie ist mitzuführen.
2. **Der Ausnahme-Eintrag für `stone-500`** ist der einzige Punkt, dessen Auslassung stillschweigend wirkt. Er gehört bei der Wiederholung ausdrücklich abgehakt.

**Für die beiden weiteren Übergabedokumente**, die nach demselben Verfahren angewandt werden: das Verfahren hat hier **nicht** an der Genauigkeit der Anweisungen gescheitert, sondern daran, dass die Anwendung das Projekt gar nicht erreicht hat. Eine Rückmeldung der anwendenden Seite über das, was sie tatsächlich geschrieben hat, würde diesen Fall künftig sofort sichtbar machen — und ein Blick auf den Zeitstempel des Projekts genügt als Sekundenprüfung, bevor eine Abgleichsarbeit überhaupt beginnt.

---

## 6. Warum auch die Arbeit im Repository nicht vorgezogen werden kann

Die Aufgabe hätte nach dem Abgleich vier Dinge im Repository nachgezogen. Alle vier hängen an der ausgebliebenen Anwendung — auch die, die auf den ersten Blick unabhängig aussehen.

**Die neun neuen Token** brauchen ihren hellen Wert aus dem Spiegel. Dort stehen sie nicht. Sie aus dem Dokument abzuschreiben, würde die festgelegte Richtung umkehren: der Spiegel folgt der Quelle, nicht dem Entwurf.

**Die acht Token-Dateien unter `src/styles/medo/`** sind ein Spiegel des neu gezogenen Stands. Der ist unverändert, also gibt es nichts nachzuziehen.

**Das Begründungstor für das helle Theme** ist der Punkt, der am ehesten unabhängig wirkt — die Mechanik im Werkzeug ließe sich ausweiten, ohne das Design-Projekt anzufassen. Nachgerechnet am heutigen Code liegt der Fall aber anders. Es bestehen **14 helle Unterschreitungen**:

| Gruppe | Zahl | Wird beseitigt durch |
|---|---|---|
| Fokusring (4) und Gefahren-Fokusring (4) | 8 | Fall A |
| Textlink auf gedrückter Fläche und auf Textmarkierung | 2 | Fall C1 |
| Warn-Beschriftung überfahren und gedrückt | 2 | Fall B |
| Kräftige Rahmenlinie auf Kartenfläche | 1 | Fall D |
| **Feldkante im Ruhezustand** | **1** | **bleibt — gelockte Absicht** |

Nach der Anwendung bleibt **eine** Unterschreitung übrig, und für die gibt es einen Grund. Heute verlangte das Tor **vierzehn** Begründungen — dreizehn davon für Unterschreitungen, die der Inhaber beseitigen wollte. Eine Begründung schreiben heißt, eine Unterschreitung für vertretbar zu erklären. Für diese dreizehn wäre das die Umkehrung der getroffenen Entscheidung, und die Einträge müssten unmittelbar nach der Anwendung wieder gelöscht werden.

Das Tor wird deshalb ausgeweitet, **nachdem** die Anwendung vorliegt — dann trägt es genau einen Eintrag, und die Zusicherung „nie eine stille Unterschreitung" ist ab dem ersten Tag wahr, statt mit dreizehn Einträgen zu beginnen, die sie aushöhlen.

**Fall C2** (Textlink dunkel) existiert im Design-Projekt nicht und wäre allein umsetzbar. Er ist aber mit dem Begründungstor verzahnt: seine Umsetzung entfernt die dunkle Unterschreitung `medo-text-link|medo-state-pressed` und macht damit den Eintrag in `APPROVED_SHORTFALLS` und in `scripts/contrast/shortfalls.mjs` hinfällig. Ihn getrennt zu machen, hieße den Kontrastbericht zweimal umzubauen. Er gehört in denselben Durchgang.

**Zwischenstand:** Am Repository wurde nichts geändert. `design-reference/` ist unverändert, weil die Neuspiegelung nichts Neues ergeben hat. Der einzige neue Inhalt auf dem Branch ist dieser Bericht. Ein Neustart nach der Anwendung setzt ohne Zusatzwissen an: Bericht lesen, Dokument erneut anwenden lassen, Abgleich wiederholen, dann Abschnitte 4 bis 7 der Aufgabe abarbeiten.
