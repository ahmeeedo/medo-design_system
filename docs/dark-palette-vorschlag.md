# Dunkle Palette — Entscheidungsvorlage

> **Status: Vorschlag.** Nichts davon ist umgesetzt. Diese Vorlage ändert keine Theme-Datei und kein
> Stylesheet; `src/styles/medo/` und `design-reference/` sind unberührt. Erst Ihre Freigabe macht die
> Werte verbindlich.

Der Dark Mode wird allein über die Semantic-Ebene getragen. Brand- und Alias-Ebene bleiben in beiden
Themes identisch — jeder dunkle Wert unten zeigt entweder auf eine **vorhandene Brand-Stufe** oder ist
einer der neun Sonderfälle mit Transparenz beziehungsweise Schatten, die einzeln begründet sind.

## 1. Was zu entscheiden ist

Drei Dinge, in dieser Reihenfolge:

1. **Die Flächenleiter** (Abschnitt 3) — sie bestimmt den Grundcharakter. Wenn die stimmt, folgt der Rest.
2. **Die neun Sonderfälle** (Abschnitt 7) — dort liegen die einzigen Werte außerhalb der Brand-Skalen.
3. **Die drei Abwägungen** (Abschnitt 9) — dort gibt es je eine vertretbare Gegenposition.

Die Tabellen dazwischen sind Beleg, nicht Lesestoff. Ein ⚠ markiert eine Kombination unter ihrer
WCAG-2.2-Schwelle; jede davon ist in Abschnitt 8 einzeln begründet.

Schwellen: Fließtext 4,50:1, Bedienelemente und Icons 3,00:1.
Zeilen ohne Schwelle sind informativ — deaktivierte Zustände und reine Flächenabsetzungen kennt
WCAG nicht als Anforderung.

## 2. Prüfung des Werkzeugs

Die Zahlen in dieser Vorlage stammen aus einem eigens gebauten Werkzeug (`scripts/contrast/`, keine
neue Abhängigkeit). Bevor es auf die dunkle Palette angesetzt wurde, musste es die **helle** korrekt
bewerten. Geprüft wurden die Fixpunkte der WCAG-Formel, die in `design-reference/CLAUDE.md`
festgehaltenen Herleitungen der fünf Transparenz-Literale, und eine dort dokumentierte, überprüfbare
Aussage über die helle Palette: dass Weiß auf Amber zu schwach ist und `warning-on-solid` deshalb
stone-1000 trägt. Ein Werkzeug, das dieses Urteil nicht reproduziert, taugt für die dunkle Palette nicht.

| Prüfung | Ergebnis |
|---|---|
| Schwarz auf Weiß ergibt 21:1 | 21.00 |
| Eine Farbe gegen sich selbst ergibt 1:1 | 1.00 |
| Der Kontrast ist symmetrisch | 15.88:1 in beiden Richtungen |
| Deckkraft 100 % und 0 % liefern die Randfälle | ff → Vordergrund, 00 → Hintergrund |
| Kurzschreibweise und rgba() werden gelesen | #fff und rgba() korrekt |
| Die Leuchtdichte steigt entlang der stone-Skala monoton | 0.0077 … 0.9295 |
| --medo-text-muted ist stone-1000 @68 % | #24221ead = stone-1000 @ 67.8 % |
| --medo-icon-muted ist stone-1000 @55 % | #24221e8c = stone-1000 @ 54.9 % |
| --medo-focus-ring ist primary-600 @35 % | #00726559 = teal-600 @ 34.9 % |
| --medo-focus-ring-danger ist error-600 @35 % | #ab091359 = red-600 @ 34.9 % |
| --medo-scrim ist stone-1100 @50 % | rgba(23,21,19,0.5) = stone-1100 @ 50 % |
| Weiß auf warning-solid verfehlt AA — der Grund für die Sonderregel | 3.21:1 — unter 4,5 |
| warning-on-solid löst die Sonderregel ein | 4.95:1 — über 4,5 |
| Fließtext erreicht AA auf allen Grundflächen | 13.43:1 … 15.88:1 |
| Statustext erreicht AA auf der eigenen Statusfläche | 11.17:1 … 15.23:1 |
| Beschriftung auf gefüllten Statusflächen erreicht AA | 4.95:1 … 7.55:1 |
| Der Textlink erreicht AA auf der Grundfläche | 5.84:1 |

Gegenprobe: mit verfälschtem Luminanz-Koeffizienten und mit vertauschter Kompositionsrichtung schlägt
der Lauf jeweils fehl. Die Prüfung kann also rot werden.

## 3. Die Flächenleiter

Im hellen Theme ist die Grundfläche das Hellste, was es gibt, und alles Weitere staffelt sich darunter.
Diese Anordnung lässt sich nicht spiegeln, ohne sie zu durchdenken: im Dunkeln trägt **Helligkeit die
Höhe**, und darunter braucht es Platz für vertiefte Flächen.

| Rolle | Hell | Dunkel | Richtung |
|---|---|---|---|
| `surface-sunken` | stone-100 | **stone-1100** | tiefer als die Grundfläche |
| `surface` | white | **stone-1000** | Grundfläche |
| `surface-container`, `overlay` | stone-50 / white | **stone-900** | Karten, Menüs, Dialoge |
| `surface-container-high`, `surface-hover` | stone-100 | **stone-800** | zweite Höhe, Überfahren |
| `state-pressed` | stone-200 | **stone-700** | Druckzustand |

Zwei Abweichungen von der reinen Spiegelung stecken darin, beide unvermeidlich:

- `surface-sunken` liegt hell auf derselben Stufe wie `surface-container-high`. Im Dunkeln muss eine
  vertiefte Fläche **unter** die Grundfläche, sonst wirkt sie erhoben. Deshalb stone-1100.
- `overlay` ist hell mit `surface` identisch — ein weißes Menü auf weißer Seite, getrennt allein durch
  den Schatten. Auf dunklem Grund trägt kein Schatten mehr (Abschnitt 7). Das Menü muss selbst heller
  sein, sonst ist es nicht da.

## 4. Alle 77 Token der Semantic-Ebene

Vollständig und in der Reihenfolge der Quelldatei. Die Spalte „Gemessen gegen" nennt den Partner, auf
den sich die beiden Kontrastspalten beziehen — bei Flächen also der Text darauf, bei Text die Fläche
darunter.

| Token | Hell | Dunkel | Stufe dunkel | Kontrast hell | Kontrast dunkel | Gemessen gegen | Anmerkung |
|---|---|---|---|---|---|---|---|
| `--medo-surface` | `#ffffff` | `#24221e` | `stone-1000` | 15,88:1 | 14,81:1 | `--medo-text` | Grundfläche. Bewusst nicht die dunkelste Stufe, damit darunter Platz für vertiefte Flächen bleibt. |
| `--medo-surface-container` | `#f7f7f6` | `#312d28` | `stone-900` | 14,81:1 | 12,75:1 | `--medo-text` | Karten liegen eine Stufe über der Grundfläche — im Dunkeln trägt Helligkeit die Höhe. |
| `--medo-surface-container-high` | `#ececeb` | `#3f3933` | `stone-800` | 13,43:1 | 10,62:1 | `--medo-text` | Zweite Höhenstufe. |
| `--medo-surface-sunken` | `#ececeb` | `#171513` | `stone-1100` | 13,43:1 | 16,99:1 | `--medo-text` | ABWEICHUNG: hell liegt sunken auf derselben Stufe wie container-high. Im Dunkeln muss eine vertiefte Fläche unter die Grundfläche, sonst wirkt sie erhoben. |
| `--medo-surface-hover` | `#ececeb` | `#3f3933` | `stone-800` | 13,43:1 | 10,62:1 | `--medo-text` | Gleiche Stufe wie container-high — dieselbe Gleichsetzung wie im hellen Theme. |
| `--medo-surface-selected` | `#e2efed` | `#003b34` | `teal-900` | 13,46:1 | 11,69:1 | `--medo-text` | Ausgewählte Zeile: teal-Tiefton statt teal-Hellton. |
| `--medo-overlay` | `#ffffff` | `#312d28` | `stone-900` | 15,88:1 | 12,75:1 | `--medo-text` | ABWEICHUNG: hell ist overlay mit surface identisch, die Trennung kommt vom Schatten. Auf dunklem Grund trägt kein Schatten — das Menü muss selbst heller sein. |
| `--medo-text` | `#24221e` | `#f7f7f6` | `stone-50` | 15,88:1 | 14,81:1 | `--medo-surface` | Nicht reines Weiß: das reduziert das Ausblühen der Schrift auf dunklem Grund. |
| `--medo-text-muted` | `#24221ead` | `#f7f7f6ad` | — | 5,48:1 | 7,53:1 | `--medo-surface` | stone-50 bei 68 % — dieselbe Deckkraft wie hell, gespiegelte Grundfarbe. |
| `--medo-text-subtle` | `#3f3933` | `#c6c4c2` | `stone-300` | 11,39:1 | 9,13:1 | `--medo-surface` | Eine Spur unter der Textfarbe, so wie hell stone-800 eine Spur über stone-1000 liegt. |
| `--medo-text-on-primary` | `#ffffff` | `#171513` | `stone-1100` | 5,84:1 | 5,93:1 | `--medo-action` | Kehrt sich um: die Primärfläche wird hell, ihre Beschriftung dunkel. |
| `--medo-text-disabled` | `#94908c` | `#94908c` | `stone-500` | 3,17:1 | 5,01:1 | `--medo-surface` | stone-500 bleibt in beiden Themes stehen — die Mitte der Skala trägt auf hellem wie auf dunklem Grund. Entscheidend ist die Dämpfung gegenüber dem Fließtext, nicht die absolute Zahl. |
| `--medo-text-link` | `#007265` | `#8bb8b1` | `teal-400` | 5,84:1 | 7,25:1 | `--medo-surface` | teal-600 verschwindet auf dunklem Grund; die 400er-Stufe hält Farbton und Lesbarkeit. |
| `--medo-text-link-hover` | `#004b42` | `#adccc8` | `teal-300` | 10,07:1 | 9,26:1 | `--medo-surface` | Hover geht im Dunkeln heller, nicht dunkler. |
| `--medo-icon` | `#312d28` | `#ececeb` | `stone-100` | 13,67:1 | 13,43:1 | `--medo-surface` | Wie hell: eine Stufe neben der Textfarbe. |
| `--medo-icon-muted` | `#24221e8c` | `#f7f7f68c` | — | 3,65:1 | 5,43:1 | `--medo-surface` | stone-50 bei 55 % — dieselbe Deckkraft wie hell, gespiegelte Grundfarbe. |
| `--medo-icon-on-primary` | `#ffffff` | `#171513` | `stone-1100` | 5,84:1 | 5,93:1 | `--medo-action` | Folgt text-on-primary. |
| `--medo-icon-disabled` | `#94908c` | `#94908c` | `stone-500` | 3,17:1 | 5,01:1 | `--medo-surface` | Folgt text-disabled. |
| `--medo-border` | `#c6c4c2` | `#4f4840` | `stone-700` | 1,74:1 | 1,76:1 | `--medo-surface` | Trifft die Zurückhaltung, die stone-300 auf Weiß hat — siehe die beiden Kontrastspalten. |
| `--medo-border-strong` | `#94908c` | `#94908c` | `stone-500` | 3,17:1 | 5,01:1 | `--medo-surface` | stone-500 trägt auf beiden Gründen. Im Dunkeln deutlicher als hell, wo die Kante knapp unter 3:1 bleibt. |
| `--medo-border-subtle` | `#dbdad8` | `#3f3933` | `stone-800` | 1,40:1 | 1,39:1 | `--medo-surface` | Trifft die Zurückhaltung von stone-200 auf Weiß nahezu exakt. |
| `--medo-border-disabled` | `#dbdad8` | `#3f3933` | `stone-800` | 1,40:1 | 1,39:1 | `--medo-surface` | Folgt border-subtle, wie hell. |
| `--medo-input-bg` | `#ffffff` | `#171513` | `stone-1100` | 15,88:1 | 16,99:1 | `--medo-input-text` | Das Feld sitzt am äußeren Ende der Flächenleiter — hell am hellen Ende, dunkel am dunklen. |
| `--medo-input-bg-disabled` | `#ececeb` | `#312d28` | `stone-900` | 13,43:1 | 12,75:1 | `--medo-input-text` | Das gesperrte Feld verliert die Vertiefung und liegt flach. |
| `--medo-input-text` | `#24221e` | `#f7f7f6` | `stone-50` | 15,88:1 | 16,99:1 | `--medo-input-bg` | Folgt text. |
| `--medo-input-placeholder` | `#615951` | `#b0adaa` | `stone-400` | 6,87:1 | 8,16:1 | `--medo-input-bg` | Trifft die Helligkeitsrelation, die stone-600 auf Weiß hat. |
| `--medo-input-border` | `#b0adaa` | `#615951` | `stone-600` | 2,23:1 | 2,65:1 | `--medo-input-bg` | Bewusst zurückhaltend — spiegelt die im hellen Theme gelockte Entscheidung für stone-400. |
| `--medo-input-border-hover` | `#615951` | `#b0adaa` | `stone-400` | 6,87:1 | 8,16:1 | `--medo-input-bg` | Trifft die Relation von stone-600 auf Weiß. |
| `--medo-input-border-focus` | `#007265` | `#8bb8b1` | `teal-400` | 5,84:1 | 8,32:1 | `--medo-input-bg` | Dünne Linien liegen eine Stufe heller als Füllflächen, die auf teal-500 sitzen. |
| `--medo-input-border-error` | `#ab0913` | `#d39e98` | `red-400` | 7,55:1 | 7,90:1 | `--medo-input-bg` | Dieselbe Regel wie border-focus, auf der Fehlerskala. |
| `--medo-input-border-disabled` | `#dbdad8` | `#3f3933` | `stone-800` | 1,40:1 | 1,60:1 | `--medo-input-bg` | Folgt border-disabled. |
| `--medo-action` | `#007265` | `#619e96` | `teal-500` | 5,84:1 | 5,17:1 | `--medo-surface` | teal-600 verfehlt auf dunklem Grund die 3:1-Grenze für Bedienflächen — siehe Abwägung 1. |
| `--medo-action-hover` | `#005e53` | `#8bb8b1` | `teal-400` | 7,70:1 | 7,25:1 | `--medo-surface` | Hover heller statt dunkler. |
| `--medo-action-active` | `#004b42` | `#adccc8` | `teal-300` | 10,07:1 | 9,26:1 | `--medo-surface` | Aktiv noch eine Stufe heller. |
| `--medo-action-disabled` | `#dbdad8` | `#3f3933` | `stone-800` | 1,40:1 | 1,39:1 | `--medo-surface` | Spiegelt stone-200 auf Weiß. |
| `--medo-action-text` | `#ffffff` | `#171513` | `stone-1100` | 5,84:1 | 5,93:1 | `--medo-action` | Folgt text-on-primary. |
| `--medo-action-text-disabled` | `#94908c` | `#94908c` | `stone-500` | 2,27:1 | 3,59:1 | `--medo-action-disabled` | Folgt text-disabled. |
| `--medo-action-neutral` | `#ececeb` | `#3f3933` | `stone-800` | 13,43:1 | 10,62:1 | `--medo-action-neutral-text` | Gleiche Stufe wie surface-hover — dieselbe Gleichsetzung wie hell. |
| `--medo-action-neutral-hover` | `#dbdad8` | `#4f4840` | `stone-700` | 11,37:1 | 8,40:1 | `--medo-action-neutral-text` | Eine Stufe heller. |
| `--medo-action-neutral-active` | `#c6c4c2` | `#615951` | `stone-600` | 9,13:1 | 6,41:1 | `--medo-action-neutral-text` | Zwei Stufen heller. |
| `--medo-action-neutral-text` | `#24221e` | `#f7f7f6` | `stone-50` | 13,43:1 | 10,62:1 | `--medo-action-neutral` | Folgt text. |
| `--medo-focus-ring` | `#00726559` | `#adccc88c` | — | 1,71:1 | 3,80:1 | `--medo-surface` | teal-300 bei 55 %. Die einzige Stelle, an der die Deckkraft steigt — siehe Sonderfall 3. |
| `--medo-focus-ring-danger` | `#ab091359` | `#e1bab58c` | — | 2,00:1 | 3,72:1 | `--medo-surface` | red-300 bei 55 %, gleiche Herleitung wie focus-ring. |
| `--medo-state-hover` | `#ececeb` | `#3f3933` | `stone-800` | 13,43:1 | 10,62:1 | `--medo-text` | Folgt surface-hover. |
| `--medo-state-pressed` | `#dbdad8` | `#4f4840` | `stone-700` | 11,37:1 | 8,40:1 | `--medo-text` | Eine Stufe über hover, wie hell stone-200 über stone-100. |
| `--medo-state-selected` | `#e2efed` | `#003b34` | `teal-900` | 13,46:1 | 11,69:1 | `--medo-text` | Folgt surface-selected. |
| `--medo-selection` | `#cadfdc` | `#004b42` | `teal-800` | 11,42:1 | 9,40:1 | `--medo-text` | Textmarkierung eine Stufe kräftiger als state-selected, wie hell teal-200 über teal-100. |
| `--medo-divider` | `#dbdad8` | `#3f3933` | `stone-800` | 1,40:1 | 1,39:1 | `--medo-surface` | Folgt border-subtle, wie hell. |
| `--medo-scrim` | `rgba(23,21,19,0.5)` | `rgba(0,0,0,0.5)` | — | 3,45:1 | 1,31:1 | `--medo-overlay` | Deckkraft bleibt bei 50 %, nur die Grundfarbe wechselt auf Schwarz — siehe Sonderfall 5. |
| `--medo-success-surface` | `#f3f9f4` | `#002c0b` | `green-1000` | 14,41:1 | 9,02:1 | `--medo-success-text` | Meldungsfläche auf der tiefsten Tonstufe der eigenen Skala. |
| `--medo-success-text` | `#002c0b` | `#b2cdb7` | `green-300` | 14,41:1 | 9,02:1 | `--medo-success-surface` | Heller Ton der eigenen Skala — behält den Farbton als Bedeutungsträger, statt ins Weiße zu gehen. |
| `--medo-success-border` | `#b2cdb7` | `#005f02` | `green-700` | 1,71:1 | 1,99:1 | `--medo-surface` | Spiegelt die Zurückhaltung der 300er-Kante im hellen Theme. |
| `--medo-success-solid` | `#007317` | `#6d9f77` | `green-500` | 6,06:1 | 5,20:1 | `--medo-surface` | Wie action: die 600er-Stufe verfehlt auf dunklem Grund die 3:1-Grenze. |
| `--medo-success-solid-hover` | `#005f02` | `#93b89a` | `green-400` | 7,96:1 | 7,23:1 | `--medo-surface` | Hover heller statt dunkler. |
| `--medo-success-solid-active` | `#004c04` | `#b2cdb7` | `green-300` | 10,32:1 | 9,31:1 | `--medo-surface` | Aktiv noch eine Stufe heller. |
| `--medo-success-on-solid` | `#ffffff` | `#171513` | `stone-1100` | 6,06:1 | 5,96:1 | `--medo-success-solid` | Alle vier Füllfarben tragen im Dunkeln dunkle Schrift — die helle Sonderregel für Warnung entfällt damit. |
| `--medo-warning-surface` | `#fff5ec` | `#5b2800` | `amber-1000` | 11,17:1 | 7,84:1 | `--medo-warning-text` | Meldungsfläche auf der tiefsten Tonstufe der eigenen Skala. |
| `--medo-warning-text` | `#5b2800` | `#ffc59a` | `amber-300` | 11,17:1 | 7,84:1 | `--medo-warning-surface` | Heller Ton der eigenen Skala — behält den Farbton als Bedeutungsträger, statt ins Weiße zu gehen. |
| `--medo-warning-border` | `#ffc59a` | `#c25e00` | `amber-700` | 1,53:1 | 3,70:1 | `--medo-surface` | Spiegelt die Zurückhaltung der 300er-Kante im hellen Theme. |
| `--medo-warning-solid` | `#dc7411` | `#f1924a` | `amber-500` | 3,21:1 | 6,77:1 | `--medo-surface` | Wie action: die 600er-Stufe verfehlt auf dunklem Grund die 3:1-Grenze. |
| `--medo-warning-solid-hover` | `#c25e00` | `#ffae74` | `amber-400` | 4,29:1 | 8,74:1 | `--medo-surface` | Hover heller statt dunkler. |
| `--medo-warning-solid-active` | `#a04800` | `#ffc59a` | `amber-300` | 6,14:1 | 10,36:1 | `--medo-surface` | Aktiv noch eine Stufe heller. |
| `--medo-warning-on-solid` | `#24221e` | `#171513` | `stone-1100` | 4,95:1 | 7,76:1 | `--medo-warning-solid` | Alle vier Füllfarben tragen im Dunkeln dunkle Schrift — die helle Sonderregel für Warnung entfällt damit. |
| `--medo-error-surface` | `#fdf5f4` | `#420b09` | `red-1000` | 15,23:1 | 9,27:1 | `--medo-error-text` | Meldungsfläche auf der tiefsten Tonstufe der eigenen Skala. |
| `--medo-error-text` | `#420b09` | `#e1bab5` | `red-300` | 15,23:1 | 9,27:1 | `--medo-error-surface` | Heller Ton der eigenen Skala — behält den Farbton als Bedeutungsträger, statt ins Weiße zu gehen. |
| `--medo-error-border` | `#e1bab5` | `#920000` | `red-700` | 1,77:1 | 1,68:1 | `--medo-surface` | Spiegelt die Zurückhaltung der 300er-Kante im hellen Theme. |
| `--medo-error-solid` | `#ab0913` | `#bf7d75` | `red-500` | 7,55:1 | 4,84:1 | `--medo-surface` | Wie action: die 600er-Stufe verfehlt auf dunklem Grund die 3:1-Grenze. |
| `--medo-error-solid-hover` | `#920000` | `#d39e98` | `red-400` | 9,45:1 | 6,89:1 | `--medo-surface` | Hover heller statt dunkler. |
| `--medo-error-solid-active` | `#750002` | `#e1bab5` | `red-300` | 11,95:1 | 8,99:1 | `--medo-surface` | Aktiv noch eine Stufe heller. |
| `--medo-error-on-solid` | `#ffffff` | `#171513` | `stone-1100` | 7,55:1 | 5,56:1 | `--medo-error-solid` | Alle vier Füllfarben tragen im Dunkeln dunkle Schrift — die helle Sonderregel für Warnung entfällt damit. |
| `--medo-info-surface` | `#f2f8fd` | `#002248` | `blue-1000` | 14,84:1 | 9,20:1 | `--medo-info-text` | Meldungsfläche auf der tiefsten Tonstufe der eigenen Skala. |
| `--medo-info-text` | `#002248` | `#afc8e1` | `blue-300` | 14,84:1 | 9,20:1 | `--medo-info-surface` | Heller Ton der eigenen Skala — behält den Farbton als Bedeutungsträger, statt ins Weiße zu gehen. |
| `--medo-info-border` | `#afc8e1` | `#0045a3` | `blue-700` | 1,73:1 | 1,80:1 | `--medo-surface` | Spiegelt die Zurückhaltung der 300er-Kante im hellen Theme. |
| `--medo-info-solid` | `#0059be` | `#6895c3` | `blue-500` | 6,62:1 | 5,05:1 | `--medo-surface` | Wie action: die 600er-Stufe verfehlt auf dunklem Grund die 3:1-Grenze. |
| `--medo-info-solid-hover` | `#0045a3` | `#8fb1d5` | `blue-400` | 8,82:1 | 7,12:1 | `--medo-surface` | Hover heller statt dunkler. |
| `--medo-info-solid-active` | `#003783` | `#afc8e1` | `blue-300` | 11,20:1 | 9,20:1 | `--medo-surface` | Aktiv noch eine Stufe heller. |
| `--medo-info-on-solid` | `#ffffff` | `#171513` | `stone-1100` | 6,62:1 | 5,79:1 | `--medo-info-solid` | Alle vier Füllfarben tragen im Dunkeln dunkle Schrift — die helle Sonderregel für Warnung entfällt damit. |

## 5. Text und Icon auf Fläche

Jede Kombination aus Text- beziehungsweise Icon-Token und allgemeiner Fläche, durchgerechnet. Die
Tabelle wird erzeugt, nicht gepflegt — es kann keine Zeile fehlen.

**Dunkler Vorschlag:**

| Vordergrund \ Fläche | surface | surface-container | surface-container-high | surface-sunken | surface-hover | surface-selected | overlay | state-hover | state-pressed | state-selected | selection |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `--medo-text` | 14,81 | 12,75 | 10,62 | 16,99 | 10,62 | 11,69 | 12,75 | 10,62 | 8,40 | 11,69 | 9,40 |
| `--medo-text-muted` | 7,53 | 6,75 | 5,87 | 8,24 | 5,87 | 6,22 | 6,75 | 5,87 | 4,89 | 6,22 | 5,23 |
| `--medo-text-subtle` | 9,13 | 7,86 | 6,55 | 10,47 | 6,55 | 7,21 | 7,86 | 6,55 | 5,18 | 7,21 | 5,79 |
| `--medo-text-link` | 7,25 | 6,24 | 5,20 | 8,32 | 5,20 | 5,72 | 6,24 | 5,20 | 4,11 ⚠ | 5,72 | 4,60 |
| `--medo-text-link-hover` | 9,26 | 7,97 | 6,64 | 10,62 | 6,64 | 7,31 | 7,97 | 6,64 | 5,25 | 7,31 | 5,87 |
| `--medo-icon` | 13,43 | 11,56 | 9,63 | 15,41 | 9,63 | 10,60 | 11,56 | 9,63 | 7,61 | 10,60 | 8,52 |
| `--medo-icon-muted` | 5,43 | 4,98 | 4,44 | 5,79 | 4,44 | 4,61 | 4,98 | 4,44 | 3,81 | 4,61 | 3,98 |
| `--medo-text-disabled` | 5,01 | 4,31 | 3,59 | 5,75 | 3,59 | 3,96 | 4,31 | 3,59 | 2,84 | 3,96 | 3,18 |
| `--medo-icon-disabled` | 5,01 | 4,31 | 3,59 | 5,75 | 3,59 | 3,96 | 4,31 | 3,59 | 2,84 | 3,96 | 3,18 |

**Heller Bestand zum Vergleich:**

| Vordergrund \ Fläche | surface | surface-container | surface-container-high | surface-sunken | surface-hover | surface-selected | overlay | state-hover | state-pressed | state-selected | selection |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `--medo-text` | 15,88 | 14,81 | 13,43 | 13,43 | 13,43 | 13,46 | 15,88 | 13,43 | 11,37 | 13,46 | 11,42 |
| `--medo-text-muted` | 5,48 | 5,31 | 5,08 | 5,08 | 5,08 | 5,09 | 5,48 | 5,08 | 4,69 | 5,09 | 4,71 |
| `--medo-text-subtle` | 11,39 | 10,62 | 9,63 | 9,63 | 9,63 | 9,65 | 11,39 | 9,63 | 8,15 | 9,65 | 8,19 |
| `--medo-text-link` | 5,84 | 5,45 | 4,94 | 4,94 | 4,94 | 4,95 | 5,84 | 4,94 | 4,18 ⚠ | 4,95 | 4,20 ⚠ |
| `--medo-text-link-hover` | 10,07 | 9,40 | 8,52 | 8,52 | 8,52 | 8,54 | 10,07 | 8,52 | 7,21 | 8,54 | 7,24 |
| `--medo-icon` | 13,67 | 12,75 | 11,56 | 11,56 | 11,56 | 11,59 | 13,67 | 11,56 | 9,78 | 11,59 | 9,83 |
| `--medo-icon-muted` | 3,65 | 3,58 | 3,48 | 3,48 | 3,48 | 3,48 | 3,65 | 3,48 | 3,29 | 3,48 | 3,30 |
| `--medo-text-disabled` | 3,17 | 2,96 | 2,68 | 2,68 | 2,68 | 2,69 | 3,17 | 2,68 | 2,27 | 2,69 | 2,28 |
| `--medo-icon-disabled` | 3,17 | 2,96 | 2,68 | 2,68 | 2,68 | 2,69 | 3,17 | 2,68 | 2,27 | 2,69 | 2,28 |

## 6. Kontextgebundene Paarungen

Kombinationen, bei denen die Komponente die Fläche vorgibt: Beschriftung auf gefüllten Flächen,
Feldinhalte, Statusfarben, Rahmen, Fokusring, Flächenabsetzungen.

### Primäraktion

| Vordergrund | Fläche | Schwelle | Kontrast hell | Kontrast dunkel |
|---|---|---|---|---|
| `--medo-text-on-primary` | `--medo-action` | 4,50:1 | 5,84 | 5,93 |
| `--medo-icon-on-primary` | `--medo-action` | 3,00:1 | 5,84 | 5,93 |
| `--medo-action-text` | `--medo-action` | 4,50:1 | 5,84 | 5,93 |
| `--medo-text-on-primary` | `--medo-action-hover` | 4,50:1 | 7,70 | 8,32 |
| `--medo-icon-on-primary` | `--medo-action-hover` | 3,00:1 | 7,70 | 8,32 |
| `--medo-action-text` | `--medo-action-hover` | 4,50:1 | 7,70 | 8,32 |
| `--medo-text-on-primary` | `--medo-action-active` | 4,50:1 | 10,07 | 10,62 |
| `--medo-icon-on-primary` | `--medo-action-active` | 3,00:1 | 10,07 | 10,62 |
| `--medo-action-text` | `--medo-action-active` | 4,50:1 | 10,07 | 10,62 |
| `--medo-action-text-disabled` | `--medo-action-disabled` | — (informativ) | 2,27 | 3,59 |

### Neutrale Aktion

| Vordergrund | Fläche | Schwelle | Kontrast hell | Kontrast dunkel |
|---|---|---|---|---|
| `--medo-action-neutral-text` | `--medo-action-neutral` | 4,50:1 | 13,43 | 10,62 |
| `--medo-action-neutral-text` | `--medo-action-neutral-hover` | 4,50:1 | 11,37 | 8,40 |
| `--medo-action-neutral-text` | `--medo-action-neutral-active` | 4,50:1 | 9,13 | 6,41 |

### Eingabefeld

| Vordergrund | Fläche | Schwelle | Kontrast hell | Kontrast dunkel |
|---|---|---|---|---|
| `--medo-input-text` | `--medo-input-bg` | 4,50:1 | 15,88 | 16,99 |
| `--medo-input-placeholder` | `--medo-input-bg` | 4,50:1 | 6,87 | 8,16 |
| `--medo-input-text` | `--medo-input-bg-disabled` | — (informativ) | 13,43 | 12,75 |
| `--medo-input-border` | `--medo-input-bg` | 3,00:1 | 2,23 ⚠ | 2,65 ⚠ |
| `--medo-input-border-hover` | `--medo-input-bg` | 3,00:1 | 6,87 | 8,16 |
| `--medo-input-border-focus` | `--medo-input-bg` | 3,00:1 | 5,84 | 8,32 |
| `--medo-input-border-error` | `--medo-input-bg` | 3,00:1 | 7,55 | 7,90 |
| `--medo-input-border-disabled` | `--medo-input-bg-disabled` | — (informativ) | 1,18 | 1,20 |

### Statusfarben

| Vordergrund | Fläche | Schwelle | Kontrast hell | Kontrast dunkel |
|---|---|---|---|---|
| `--medo-success-text` | `--medo-success-surface` | 4,50:1 | 14,41 | 9,02 |
| `--medo-success-text` | `--medo-surface` | 4,50:1 | 15,38 | 9,31 |
| `--medo-success-text` | `--medo-surface-container` | 4,50:1 | 14,35 | 8,01 |
| `--medo-success-on-solid` | `--medo-success-solid` | 4,50:1 | 6,06 | 5,96 |
| `--medo-success-on-solid` | `--medo-success-solid-hover` | 4,50:1 | 7,96 | 8,29 |
| `--medo-success-on-solid` | `--medo-success-solid-active` | 4,50:1 | 10,32 | 10,67 |
| `--medo-success-solid` | `--medo-surface` | 3,00:1 | 6,06 | 5,20 |
| `--medo-success-border` | `--medo-success-surface` | — (informativ) | 1,60 | 1,93 |
| `--medo-success-border` | `--medo-surface` | — (informativ) | 1,71 | 1,99 |
| `--medo-warning-text` | `--medo-warning-surface` | 4,50:1 | 11,17 | 7,84 |
| `--medo-warning-text` | `--medo-surface` | 4,50:1 | 12,01 | 10,36 |
| `--medo-warning-text` | `--medo-surface-container` | 4,50:1 | 11,20 | 8,92 |
| `--medo-warning-on-solid` | `--medo-warning-solid` | 4,50:1 | 4,95 | 7,76 |
| `--medo-warning-on-solid` | `--medo-warning-solid-hover` | 4,50:1 | 3,70 ⚠ | 10,02 |
| `--medo-warning-on-solid` | `--medo-warning-solid-active` | 4,50:1 | 2,59 ⚠ | 11,89 |
| `--medo-warning-solid` | `--medo-surface` | 3,00:1 | 3,21 | 6,77 |
| `--medo-warning-border` | `--medo-warning-surface` | — (informativ) | 1,42 | 2,80 |
| `--medo-warning-border` | `--medo-surface` | — (informativ) | 1,53 | 3,70 |
| `--medo-error-text` | `--medo-error-surface` | 4,50:1 | 15,23 | 9,27 |
| `--medo-error-text` | `--medo-surface` | 4,50:1 | 16,36 | 8,99 |
| `--medo-error-text` | `--medo-surface-container` | 4,50:1 | 15,26 | 7,74 |
| `--medo-error-on-solid` | `--medo-error-solid` | 4,50:1 | 7,55 | 5,56 |
| `--medo-error-on-solid` | `--medo-error-solid-hover` | 4,50:1 | 9,45 | 7,90 |
| `--medo-error-on-solid` | `--medo-error-solid-active` | 4,50:1 | 11,95 | 10,31 |
| `--medo-error-solid` | `--medo-surface` | 3,00:1 | 7,55 | 4,84 |
| `--medo-error-border` | `--medo-error-surface` | — (informativ) | 1,64 | 1,73 |
| `--medo-error-border` | `--medo-surface` | — (informativ) | 1,77 | 1,68 |
| `--medo-info-text` | `--medo-info-surface` | 4,50:1 | 14,84 | 9,20 |
| `--medo-info-text` | `--medo-surface` | 4,50:1 | 15,88 | 9,20 |
| `--medo-info-text` | `--medo-surface-container` | 4,50:1 | 14,81 | 7,92 |
| `--medo-info-on-solid` | `--medo-info-solid` | 4,50:1 | 6,62 | 5,79 |
| `--medo-info-on-solid` | `--medo-info-solid-hover` | 4,50:1 | 8,82 | 8,17 |
| `--medo-info-on-solid` | `--medo-info-solid-active` | 4,50:1 | 11,20 | 10,56 |
| `--medo-info-solid` | `--medo-surface` | 3,00:1 | 6,62 | 5,05 |
| `--medo-info-border` | `--medo-info-surface` | — (informativ) | 1,61 | 1,80 |
| `--medo-info-border` | `--medo-surface` | — (informativ) | 1,73 | 1,80 |

### Rahmen und Linien

| Vordergrund | Fläche | Schwelle | Kontrast hell | Kontrast dunkel |
|---|---|---|---|---|
| `--medo-border` | `--medo-surface` | — (informativ) | 1,74 | 1,76 |
| `--medo-border` | `--medo-surface-container` | — (informativ) | 1,62 | 1,52 |
| `--medo-border-strong` | `--medo-surface` | 3,00:1 | 3,17 | 5,01 |
| `--medo-border-strong` | `--medo-surface-container` | 3,00:1 | 2,96 ⚠ | 4,31 |
| `--medo-border-subtle` | `--medo-surface` | — (informativ) | 1,40 | 1,39 |
| `--medo-border-subtle` | `--medo-surface-container` | — (informativ) | 1,30 | 1,20 |
| `--medo-border-disabled` | `--medo-surface` | — (informativ) | 1,40 | 1,39 |
| `--medo-border-disabled` | `--medo-surface-container` | — (informativ) | 1,30 | 1,20 |
| `--medo-divider` | `--medo-surface` | — (informativ) | 1,40 | 1,39 |
| `--medo-divider` | `--medo-surface-container` | — (informativ) | 1,30 | 1,20 |

### Fokusring

| Vordergrund | Fläche | Schwelle | Kontrast hell | Kontrast dunkel |
|---|---|---|---|---|
| `--medo-focus-ring` | `--medo-surface` | 3,00:1 | 1,71 ⚠ | 3,80 |
| `--medo-focus-ring` | `--medo-surface-container` | 3,00:1 | 1,69 ⚠ | 3,50 |
| `--medo-focus-ring` | `--medo-surface-container-high` | 3,00:1 | 1,65 ⚠ | 3,15 |
| `--medo-focus-ring` | `--medo-overlay` | 3,00:1 | 1,71 ⚠ | 3,50 |
| `--medo-focus-ring-danger` | `--medo-surface` | 3,00:1 | 2,00 ⚠ | 3,72 |
| `--medo-focus-ring-danger` | `--medo-surface-container` | 3,00:1 | 1,97 ⚠ | 3,44 |
| `--medo-focus-ring-danger` | `--medo-surface-container-high` | 3,00:1 | 1,94 ⚠ | 3,09 |
| `--medo-focus-ring-danger` | `--medo-overlay` | 3,00:1 | 2,00 ⚠ | 3,44 |

### Flächenabsetzung

| Vordergrund | Fläche | Schwelle | Kontrast hell | Kontrast dunkel |
|---|---|---|---|---|
| `--medo-action` | `--medo-surface` | 3,00:1 | 5,84 | 5,17 |
| `--medo-action-hover` | `--medo-surface` | 3,00:1 | 7,70 | 7,25 |
| `--medo-action-active` | `--medo-surface` | 3,00:1 | 10,07 | 9,26 |
| `--medo-action-disabled` | `--medo-surface` | — (informativ) | 1,40 | 1,39 |
| `--medo-surface-container` | `--medo-surface` | — (informativ) | 1,07 | 1,16 |
| `--medo-surface-container-high` | `--medo-surface-container` | — (informativ) | 1,10 | 1,20 |
| `--medo-surface-sunken` | `--medo-surface` | — (informativ) | 1,18 | 1,15 |
| `--medo-overlay` | `--medo-surface` | — (informativ) | 1,00 | 1,16 |
| `--medo-overlay` | `--medo-scrim` | — (informativ) | 3,45 | 1,38 |
| `--medo-input-bg` | `--medo-surface-container` | — (informativ) | 1,07 | 1,33 |

## 7. Die neun Sonderfälle

Fünf Transparenz-Literale und vier Schattendefinitionen. Nur hier sind Werte außerhalb der Brand-Skalen
zulässig, und nur hier steht eine Setzung statt einer Ableitung — beim Faktor der Schatten.

### 1. --medo-text-muted

| Hell | Dunkel |
|---|---|
| `#24221ead` | `#f7f7f6ad` |

**stone-50 bei 68 % — Deckkraft unverändert, Grundfarbe gespiegelt**

Die 68 % sind im hellen Theme eine gelockte Entscheidung (stone-1000 bei 68 %). Sie bleiben unangetastet; nur die Grundfarbe wechselt von der dunkelsten auf die hellste Neutralstufe. Dass hier überhaupt mit Deckkraft statt mit einer festen Stufe gearbeitet wird, hat im Dunkeln denselben Nutzen wie im Hellen: gedämpfter Text nimmt den Farbton der Fläche an, auf der er liegt, und bleibt damit auch auf getönten Flächen wie der ausgewählten Zeile stimmig. Eine feste Stufe würde dort einen Grauschleier hinterlassen.

### 2. --medo-icon-muted

| Hell | Dunkel |
|---|---|
| `#24221e8c` | `#f7f7f68c` |

**stone-50 bei 55 % — Deckkraft unverändert, Grundfarbe gespiegelt**

Gleiche Herleitung wie bei text-muted. Die 55 % stammen aus dem hellen Beschluss (stone-1000 bei 55 %) und bleiben stehen.

### 3. --medo-focus-ring

| Hell | Dunkel |
|---|---|
| `#00726559` | `#adccc88c` |

**teal-300 bei 55 % — die einzige Stelle, an der die Deckkraft steigt**

Hier weicht der Vorschlag bewusst ab, und zwar nach oben. Der Ring des hellen Themes (primary-600 bei 35 %) erreicht gegen Weiß nur 1,71:1 und bleibt damit deutlich unter den 3:1, die WCAG 2.2 für Bedienelemente verlangt. Eine reine Spiegelung würde diese Schwäche ins dunkle Theme übernehmen: teal-300 bei 35 % käme auf 2,34:1. Mit 55 % trägt der Ring auf allen vier Trägerflächen über 3:1 — die Zahlen stehen in Abwägung 2. Die 55 % sind dabei keine neue Größe im System: es ist dieselbe Deckkraft, die icon-muted bereits verwendet (Hex-Endung 8c). Geändert werden also zwei Dinge, die Grundfarbe zwingend und die Deckkraft aus Zugänglichkeitsgründen. Wer die 35 % erhalten will, findet die Gegenrechnung in Abschnitt 9.

### 4. --medo-focus-ring-danger

| Hell | Dunkel |
|---|---|
| `#ab091359` | `#e1bab58c` |

**red-300 bei 55 % — dieselbe Regel auf der Fehlerskala**

Der gelockte Beschluss verlangt für die zerstörerische Variante denselben Ring in error-Farbe bei gleicher Deckkraft. Diese Kopplung bleibt bestehen: was für focus-ring gilt, gilt hier auf der roten Skala. Im hellen Bestand liegt dieser Ring bei 2,00:1, im Vorschlag auf allen Trägerflächen über 3:1.

### 5. --medo-scrim

| Hell | Dunkel |
|---|---|
| `rgba(23,21,19,0.5)` | `rgba(0,0,0,0.5)` |

**Schwarz bei 50 % — Deckkraft unverändert, Grundfarbe gewechselt**

stone-1100 kann eine Seite, die selbst auf stone-1000 liegt, nicht mehr abdunkeln: der Verschleierer ist kaum dunkler als das Verschleierte. Schwarz ist die einzige Farbe im Bestand, die auf dieser Fläche überhaupt noch Wirkung hat — deshalb der Wechsel der Grundfarbe. Die Deckkraft dagegen bleibt bei 50 %, und das ist hergeleitet, nicht gesetzt. Gemessen wird, wie weit der Scrim den Inhalt dahinter zurücknimmt, also der Kontrast des verschleierten Textes gegen die verschleierte Fläche. Das helle Theme lässt dort 4,93:1 stehen. Schwarz bei 50 % trifft diesen Wert mit 4,52:1 am genauesten; bei 66 % fiele er auf 2,59:1 und drückte den Hintergrund deutlich stärker weg, als es das helle Theme tut.

Was der Scrim im Dunkeln nicht mehr leisten kann, ist die Flächentrennung. Hell hebt er den Dialog auf 3,45:1 gegen die Seite ab; dunkel bleiben selbst bei voller Deckung 1,54:1, weil die Seite schon nahe am Schwarzpunkt liegt. Diese Aufgabe übernimmt im Vorschlag die Aufhellung von overlay auf stone-900. Die vollständige Kurve steht in der Tabelle unten.

**Der Scrim über die Deckkraft, beide Themes.** „Trennung" ist der Dialog gegen die verschleierte
Seite, „Hintergrund" die Lesbarkeit dessen, was hinter dem Scrim liegt.

| Deckkraft | Hell: Trennung | Hell: Hintergrund | Dunkel: Trennung | Dunkel: Hintergrund |
|---|---|---|---|---|
| 0,4 | 2,58 | 6,52 | 1,34 | 6,06 |
| 0,5 ← | 3,45 | 4,93 | 1,38 | 4,52 |
| 0,6 | 4,74 | 3,67 | 1,41 | 3,21 |
| 0,66 | 5,82 | 3,01 | 1,43 | 2,59 |
| 0,8 | 9,73 | 1,82 | 1,47 | 1,55 |
| 1 | 18,21 | 1,00 | 1,54 | 1,00 |

Die markierte Zeile ist der Bestand beziehungsweise der Vorschlag. Zum Vergleich: würde die helle Grundfarbe stone-1100 unverändert übernommen, käme der dunkle Scrim auf eine Trennung von 1,24:1 und einen Hintergrund von 4,68:1 — er täte also fast nichts.

### Warum der Schatten im Dunkeln nicht mehr die Hauptlast trägt

Ein Schatten wirkt, indem er die Fläche unter einem schwebenden Element abdunkelt. Auf Weiß ist dafür viel Raum, auf stone-1000 fast keiner — ein warmer Schatten aus rgba(31,29,26,0.06) ist dort schlicht unsichtbar. Daraus folgen zwei Entscheidungen.

**Erstens** trägt die Tiefenwirkung im dunklen Theme nicht mehr der Schatten, sondern die Flächenleiter. Jede Höhe ist eine Helligkeitsstufe: Grundfläche stone-1000, Karte und Menü stone-900, höhere Ebene stone-800. Genau deshalb weicht overlay vom hellen Theme ab, wo es mit surface identisch ist. **Zweitens** behält der Schatten trotzdem eine Aufgabe, nämlich die Naht direkt unter dem schwebenden Element zu verdunkeln, damit dessen Kante nicht mit einer gleich hellen Nachbarfläche verschmilzt.

Dafür bleibt die Geometrie der vier Stufen unverändert — Versatz, Weichzeichnung und Zweischichtigkeit sind gelockte Werte. Die Grundfarbe wechselt von warmem Braungrau auf Schwarz, und jede Deckkraft wird mit vier multipliziert. Eine Regel für alle vier Stufen, keine Einzelabstimmung: 0,06 wird 0,24, 0,04 wird 0,16, und so fort.

Zum Faktor vier gehört eine Offenlegung. Er ist die **einzige Setzung im gesamten Vorschlag** — alles andere ist entweder eine vorhandene Brand-Stufe oder aus dem hellen Bestand hergeleitet. Herleiten lässt er sich nicht, weil Gleichwertigkeit gar nicht erreichbar ist: die Messung unten zeigt, dass ein dunkler Schatten das Vier- bis Sechsfache der hellen Deckkraft bräuchte, um denselben Helligkeitssprung zu erzeugen, und dass die stärkste Schicht selbst bei voller Deckung nicht hinkommt. Solche Werte wären keine Schatten mehr, sondern schwarze Höfe. Vier ist deshalb bewusst konservativ gewählt: es hält alle vier Stufen in ihrer relativen Ordnung, macht die schwächste Schicht sichtbar und lässt die stärkste mit 0,64 klar unterhalb der Deckung. Wer die Schatten kräftiger will, hebt den Faktor — das ist eine Geschmacks- und keine Zugänglichkeitsfrage und gehört deshalb in Ihre Entscheidung.

| Deckkraft hell | Helligkeitssprung auf Weiß | Dafür nötige Deckkraft auf stone-1000 | Faktor |
|---|---|---|---|
| 0,04 | 1,08 | 0,195 | × 4,88 |
| 0,06 | 1,13 | 0,31 | × 5,17 |
| 0,07 | 1,15 | 0,385 | × 5,5 |
| 0,08 | 1,17 | 0,45 | × 5,63 |
| 0,1 | 1,22 | 0,605 | × 6,05 |
| 0,16 | 1,39 | nicht erreichbar | — |

Schwarz bei voller Deckung erreicht auf stone-1000 höchstens 1,32:1. Der stärkste helle Schatten liegt darüber — er lässt sich im Dunkeln mit keiner Deckkraft nachbilden.

### 6. `--medo-shadow-sm`

| Hell | Dunkel |
|---|---|
| `0 1px 2px rgba(31,29,26,0.06), 0 1px 3px rgba(31,29,26,0.04)` | `0 1px 2px rgba(0,0,0,0.24), 0 1px 3px rgba(0,0,0,0.16)` |

Karten in Ruhe. Trägt im Dunkeln am wenigsten — hier arbeitet fast ausschließlich die Flächenstufe.

### 7. `--medo-shadow-md`

| Hell | Dunkel |
|---|---|
| `0 2px 4px rgba(31,29,26,0.06), 0 6px 16px rgba(31,29,26,0.07)` | `0 2px 4px rgba(0,0,0,0.24), 0 6px 16px rgba(0,0,0,0.28)` |

Menüs und Auswahllisten. Der Schatten setzt die Unterkante ab, die Aufhellung auf stone-900 trägt die Höhe.

### 8. `--medo-shadow-lg`

| Hell | Dunkel |
|---|---|
| `0 4px 8px rgba(31,29,26,0.06), 0 14px 32px rgba(31,29,26,0.10)` | `0 4px 8px rgba(0,0,0,0.24), 0 14px 32px rgba(0,0,0,0.40)` |

Dialoge. Wirkt zusammen mit dem Scrim; die Trennung entsteht aus der Kombination, nicht aus dem Schatten allein.

### 9. `--medo-shadow-xl`

| Hell | Dunkel |
|---|---|
| `0 8px 18px rgba(31,29,26,0.08), 0 28px 60px rgba(31,29,26,0.16)` | `0 8px 18px rgba(0,0,0,0.32), 0 28px 60px rgba(0,0,0,0.64)` |

Höchste Ebene. Mit 0,64 in der zweiten Schicht bereits nahe an einem sichtbaren Hof — wenn eine Stufe im Abgleich zu kräftig wirkt, dann diese.

## 8. Unterschreitungen im Einzelnen

### Textlink auf gedrückter Fläche

`--medo-text-link` auf `--medo-state-pressed` — **4,11:1** bei einer Schwelle von 4,50:1. Im hellen Theme: 4,18:1 (dort ebenfalls unter der Schwelle).

Der Link liegt hier auf stone-700, der hellsten der allgemeinen Flächen. Das helle Theme hat dieselbe Eigenschaft: teal-600 auf stone-200 erreicht dort 4,18:1 und damit ebenfalls keine 4,5. Der Vorschlag übernimmt diese Eigenschaft, statt eine neue einzuführen, und liegt beim verwandten Fall — Link auf Textmarkierung — mit 4,60:1 sogar über dem hellen Bestand, der dort bei 4,20:1 liegt. Hinzu kommt, dass state-pressed der Zustand während des Mausdrucks ist und nicht der Ruhezustand einer Zeile; die Kombination steht also nur für den Moment des Klicks. Wer die Unterschreitung dennoch nicht will, hebt text-link auf teal-300 — das bringt 5,25:1 auf der gedrückten Fläche, kostet aber Farbigkeit im Ruhezustand. Die Abwägung steht in Abschnitt 9.

### Feldrahmen im Ruhezustand

`--medo-input-border` auf `--medo-input-bg` — **2,65:1** bei einer Schwelle von 3,00:1. Im hellen Theme: 2,23:1 (dort ebenfalls unter der Schwelle).

Die zurückhaltende Feldkante ist eine gelockte Entscheidung des hellen Themes: design-reference/CLAUDE.md hält zu input-border=stone-400 ausdrücklich fest „user chose light on purpose". Dort erreicht die Kante 2,23:1. Der Vorschlag spiegelt diese Absicht mit stone-600 und landet bei 2,65:1, also näher an der Grenze als das helle Theme. In beiden Themes trägt die Kante die Feldgrenze praktisch allein — die Fläche des Feldes hebt sich kaum ab (hell Weiß gegen stone-50 ergibt 1,07:1, dunkel stone-1100 gegen stone-900 ergibt 1,33:1). Im Fokus übernimmt ohnehin der Ring. Eine Anhebung auf stone-500 ergäbe 5,75:1, gäbe aber die gelockte Zurückhaltung auf; das wäre eine Änderung am hellen Beschluss und gehört damit als Änderungswunsch ins Design-Projekt, nicht in diesen Vorschlag.

## 9. Drei Abwägungen

### 1. Die Primärfläche wird hell, ihre Beschriftung dunkel

Das ist die sichtbarste Änderung am Charakter des Themes. Der Grund ist messbar: teal-600 als Füllfarbe erreicht auf stone-1000 nur 2,72:1 und verfehlt damit die 3:1, die WCAG 2.2 für die Fläche eines Bedienelements verlangt — der Knopf verschwimmt mit der Seite. Der Vorschlag setzt teal-500 (5,17:1) mit dunkler Beschriftung (5,93:1).

Die Gegenrechnung: teal-600 mit weißer Schrift ergäbe 5,84:1 für die Beschriftung — die wäre also in Ordnung, nur die Fläche nicht. Wer die Markenfarbe im dunklen Theme unverändert halten will, nimmt diese Unterschreitung in Kauf. Ich rate ab, halte die Variante aber für vertretbar, weil die Beschriftung das Element trägt.

### 2. Deckkraft des Fokusrings

Der Vorschlag hebt die Deckkraft von 35 auf 55 %. Nur so trägt der Ring auf allen vier Trägerflächen über 3:1. Bei unveränderten 35 % bliebe er darunter:

| Variante | Wert | surface | container | container-high | overlay |
|---|---|---|---|---|---|
| teal-300 @35 % (Deckkraft wie hell) | `#adccc859` | 2,34 | 2,26 | 2,12 | 2,26 |
| teal-300 @55 % (Vorschlag) | `#adccc88c` | 3,80 | 3,50 | 3,15 | 3,50 |
| red-300 @35 % (Deckkraft wie hell) | `#e1bab559` | 2,31 | 2,23 | 2,09 | 2,23 |
| red-300 @55 % (Vorschlag) | `#e1bab58c` | 3,72 | 3,44 | 3,09 | 3,44 |

### 3. Textlink auf gedrückter Fläche

teal-400 erreicht dort 4,11:1. Eine Anhebung auf teal-300 brächte 5,25:1 und räumte die letzte AA-Unterschreitung bei Text aus, macht den Link im Ruhezustand aber spürbar blasser (9,26:1 statt 7,25:1 — bei Links ist ein Zuviel an Kontrast ein Verlust an Farbigkeit). Der Vorschlag bleibt bei teal-400.

## 10. Was die Prüfung nebenbei am hellen Theme gefunden hat

Die Prüfung lief zuerst über die bestehende helle Palette. Dabei sind 14 Kombinationen aufgefallen, die schon heute unter ihrer Schwelle liegen. Das ist nicht Gegenstand dieser Aufgabe und wird hier nur festgehalten. Der dunkle Vorschlag hebt 12 davon über die Schwelle und erbt 2.

| Vordergrund | Fläche | Schwelle | Hell | Dunkel |
|---|---|---|---|---|
| `--medo-text-link` | `--medo-state-pressed` | 4,50:1 | 4,18 ⚠ | 4,11 ⚠ |
| `--medo-text-link` | `--medo-selection` | 4,50:1 | 4,20 ⚠ | 4,60 |
| `--medo-input-border` | `--medo-input-bg` | 3,00:1 | 2,23 ⚠ | 2,65 ⚠ |
| `--medo-warning-on-solid` | `--medo-warning-solid-hover` | 4,50:1 | 3,70 ⚠ | 10,02 |
| `--medo-warning-on-solid` | `--medo-warning-solid-active` | 4,50:1 | 2,59 ⚠ | 11,89 |
| `--medo-border-strong` | `--medo-surface-container` | 3,00:1 | 2,96 ⚠ | 4,31 |
| `--medo-focus-ring` | `--medo-surface` | 3,00:1 | 1,71 ⚠ | 3,80 |
| `--medo-focus-ring` | `--medo-surface-container` | 3,00:1 | 1,69 ⚠ | 3,50 |
| `--medo-focus-ring` | `--medo-surface-container-high` | 3,00:1 | 1,65 ⚠ | 3,15 |
| `--medo-focus-ring` | `--medo-overlay` | 3,00:1 | 1,71 ⚠ | 3,50 |
| `--medo-focus-ring-danger` | `--medo-surface` | 3,00:1 | 2,00 ⚠ | 3,72 |
| `--medo-focus-ring-danger` | `--medo-surface-container` | 3,00:1 | 1,97 ⚠ | 3,44 |
| `--medo-focus-ring-danger` | `--medo-surface-container-high` | 3,00:1 | 1,94 ⚠ | 3,09 |
| `--medo-focus-ring-danger` | `--medo-overlay` | 3,00:1 | 2,00 ⚠ | 3,44 |

## 11. Freigabe

Der Vorschlag gilt als angenommen, wenn Sie den drei Punkten aus Abschnitt 1 zustimmen. Teilfreigaben
sind möglich — die Flächenleiter trägt die Zuordnungen, die Sonderfälle und die Abwägungen lassen sich
unabhängig davon entscheiden. Rückmeldungen arbeite ich ein und lege erneut vor.

---

*Erzeugt von `npm run contrast`. Die Werte stammen aus `src/styles/medo/` (nur gelesen) und aus dem
Vorschlag in `scripts/contrast/dark-palette.mjs`.*
