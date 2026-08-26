# AA-Bestandsaufnahme beider Themes

Geprüft am 26.08.2026 gegen WCAG 2.2 Level AA, mit dem bestehenden Kontrastwerkzeug unter `scripts/contrast/`.

Dieses Dokument ist die Entscheidungsgrundlage und enthält in Abschnitt 9 die **getroffenen Entscheidungen des Inhabers**. **Geändert wurde nichts** — keine Farbe, keine Token-Datei, keine Komponente, nichts im Design-Projekt. Die Umsetzung folgt getrennt und stützt sich auf Abschnitt 9.

---

## 1. Was geprüft wurde

| | |
|---|---|
| Geprüfte Kombinationen | **184** |
| davon gegen eine Schwelle bewertet | 136 |
| davon rein informativ (Flächenabstufungen, gesperrte Elemente) | 48 |
| Semantic-Rollen ohne Prüfung | **keine** |

Die Prüfung deckt beide Themes vollständig ab. Jede der 77 Farbrollen kommt in mindestens einer Kombination vor — das Werkzeug meldet keine Lücke.

**Abgleich mit dem bestehenden Bericht.** `docs/dark-palette-vorschlag.md` wurde aus den heutigen Token neu erzeugt und kam inhaltlich identisch heraus. Die Zahlen hier stammen also aus derselben Quelle wie der bestehende Bericht und weichen nicht davon ab. Die Selbstprüfung des Werkzeugs gegen die helle Palette besteht 17 von 17 Kontrollen.

### Die Schwellen

| Gegenstand | Schwelle | Kommt hier vor als |
|---|---|---|
| Fließtext | 4,5:1 | Schaltflächen-Beschriftungen, Textlinks |
| Großer Text | 3:1 | **kommt nicht vor** — siehe unten |
| Bedienbare Elemente und grafische Objekte | 3:1 | Fokusring, Rahmenlinien, Symbole |

*Warum „großer Text" nirgends greift:* Schaltflächen tragen 12, 14 oder 16 Pixel bei normaler Strichstärke. Groß im Sinne der Richtlinie wäre ab 24 Pixel, oder ab 18,7 Pixel bei fetter Schrift. Beides wird nirgends erreicht, deshalb gilt für jede Beschriftung die volle Schwelle von 4,5:1. Das ist nachgesehen, nicht angenommen.

---

## 2. Das Ergebnis auf einen Blick

| Theme | Unterschreitungen |
|---|---|
| **Hell** | **17** — 14 aus der bestehenden Prüfmatrix, **3 neu entdeckt** |
| **Dunkel** | **2** — beide vom hellen Theme geerbt |

Das helle Theme ist der eigentliche Anlass. Das dunkle Theme hebt zwölf der vierzehn bekannten Fälle bereits über die Schwelle und erbt nur zwei; die drei neu entdeckten Fälle treten im Dunkeln gar nicht auf.

Die Befunde fallen in vier Gruppen:

| Gruppe | Fälle | Kern |
|---|---|---|
| **A — Fokusring** | 8 (hell) | Der Ring ist zu blass, um die Schwelle zu erreichen |
| **B — Warnung** | 5 (hell) | Amber liegt in einer Helligkeit, die weder helle noch dunkle Schrift trägt |
| **C — Textlink** | 2 (hell) + 1 (dunkel) | Der Link verfehlt die Schwelle auf zwei kräftigeren Flächen |
| **D — Kräftige Rahmenlinie** | 1 (hell) | Verfehlt die Schwelle um 0,04 |

**Zur Reichweite der späteren Umsetzung — die wichtigste Aussage dieses Berichts:** Bis auf einen einzigen Fall kommt **jeder Vorschlag ohne Verschiebung einer Brand-Palettenstufe aus**; die Korrekturen lassen lediglich eine semantische Rolle auf eine bereits vorhandene Stufe zeigen. Nur bei der kräftigen Rahmenlinie (Gruppe D) steht eine Palettenverschiebung zur Wahl — die entschiedene Fassung steht in Abschnitt 9.

---

## 3. Die beiden bestehenden Ausnahmen — kein Befund

Beide sind von Ihnen abgenommen und werden hier nur der Vollständigkeit halber geführt. **Für sie ist nichts zu entscheiden.**

| Ausnahme | Wert | Warum sie steht |
|---|---|---|
| Modal-Schleier, dunkles Theme | 1,31:1 | Nahe der physikalischen Grenze für Schwarz bei 50 % Deckung über stone-900 |
| Feldkante im Ruhezustand, helles Theme | 2,23:1 | In `design-reference/CLAUDE.md` gelockt: „input-border=stone-400 (user chose light on purpose)" |

Die Feldkante des **dunklen** Themes (2,65:1) ist die Spiegelung derselben Entscheidung und wird ebenfalls nicht angetastet.

---

## 4. Gruppe A — Der Fokusring

**Betroffen:** `--medo-focus-ring` und `--medo-focus-ring-danger`, jeweils auf den vier Flächen Grundfläche, Karte, gehobene Karte und Menü. Acht Kombinationen.

| Kombination | Gemessen | Schwelle |
|---|---|---|
| Fokusring auf gehobener Karte | 1,65:1 | 3:1 |
| Fokusring auf Karte | 1,69:1 | 3:1 |
| Fokusring auf Grundfläche und Menü | 1,71:1 | 3:1 |
| Gefahren-Fokusring auf gehobener Karte | 1,94:1 | 3:1 |
| Gefahren-Fokusring auf Karte | 1,97:1 | 3:1 |
| Gefahren-Fokusring auf Grundfläche und Menü | 2,00:1 | 3:1 |

**Schwelle 3:1, und warum sie hier voll greift.** Der Ring ist kein Text, also gilt 3:1 statt 4,5:1. Er ist aber auch nicht schmückend: **26 Komponenten schalten die eingebaute Fokusmarkierung des Browsers ab (`outline: none`) und ersetzen sie durch diesen Ring.** Bei Schaltflächen, Links, Akkordeons und Menüeinträgen ist er damit die *einzige* Anzeige, wo die Tastatur gerade steht. Nur bei Eingabefeldern kommt eine zweite Anzeige hinzu, weil dort zusätzlich die Rahmenfarbe wechselt. Für alles andere trägt der Ring die Fokusanzeige allein — die Schwelle ist damit nicht verhandelbar.

**Warum keine dunklere Farbe hilft.** Der Ring ist eine durchscheinende Farbe bei 35 % Deckung. Selbst wenn man die dunkelste Stufe der Teal-Skala einsetzt, kommt er bei dieser Deckung nur auf 2,22:1 — die Schwelle ist über die Farbwahl allein **nicht erreichbar**:

| Stufe bei 35 % Deckung | auf Grundfläche |
|---|---|
| teal-600 (heute) | 1,71:1 |
| teal-800 | 1,93:1 |
| teal-1000 | 2,13:1 |
| teal-1100 (dunkelste) | 2,22:1 |

**Der Vorschlag: die Deckung anheben, die Farbe unverändert lassen.**

| | heute | Vorschlag |
|---|---|---|
| Fokusring | teal-600 bei 35 % | teal-600 bei **75 %** |
| Gefahren-Fokusring | red-600 bei 35 % | red-600 bei **75 %** |

Damit erreicht der Fokusring 3,18:1 bis 3,56:1 und der Gefahrenring 4,45:1 bis 4,94:1 — alle acht Kombinationen über der Schwelle.

**Welcher Weg ist das?** Weder der eine noch der andere im engeren Sinn: Der Fokusring ist einer von fünf Werten im Theme, die auf gar keine Palettenstufe zeigen, sondern einen eigenen Wert tragen. Die gute Nachricht daraus: **die Änderung erreicht ausschließlich den Fokusring.** Keine andere Rolle, keine Palettenstufe, keine Kaskade. Sichtbar wird sie in allen 26 Komponenten, aber immer nur an derselben Stelle — am Ring.

**Was sich sichtbar ändert.** Der Fokusring ist heute ein zarter, halbdurchsichtiger Schimmer um das bediente Element. Er wird zu einem deutlich sichtbaren, satten Ring in derselben Farbe. Die Farbe selbst ändert sich nicht — nur ihre Dichte. Wer heute mit der Tastatur durch eine Seite geht, wird den Unterschied sofort bemerken: der Fokus springt einem künftig ins Auge, statt sich anzudeuten. Das ist der Zweck der Vorgabe, aber es ist eine spürbare Veränderung des ruhigen Gesamteindrucks.

**Zwei Stellschrauben, falls Ihnen 75 % zu kräftig ist:**

- Das Minimum liegt bei **72 %** für den Fokusring und bei **57 %** für den Gefahrenring. Bei 75 % bleibt ein kleiner Sicherheitsabstand; genau am Minimum säße der Ring exakt auf der Grenze.
- Beide Ringe könnten auch verschiedene Werte bekommen — etwa 75 % und 60 %. Heute tragen sie dieselbe Deckung, und im dunklen Theme ebenfalls (dort 55 %). Ein gemeinsamer Wert ist die bestehende Ordnung, kein Zwang.

> **Eine Rückfrage an Sie, bevor dies umgesetzt wird.** Ihre Vorgabe lautet: die Farben bestehen, es ändert sich allenfalls ihre Helligkeit. Eine Deckungsänderung lässt Farbton und Sättigung unberührt — der hinterlegte Farbwert bleibt Zeichen für Zeichen derselbe — und macht den Ring im Ergebnis dunkler. Ich lese das als Helligkeitsänderung und halte es für gedeckt, zumal das dunkle Theme bereits eine andere Deckung verwendet als das helle. **Lesen Sie die Vorgabe enger, ist der Fokusring über die Helligkeit allein nicht lösbar** und gehört als offener Punkt behandelt. Diese Entscheidung liegt bei Ihnen, nicht bei mir.

---

## 5. Gruppe B — Die Warnfarbe

Hier liegen fünf der siebzehn Fälle, und sie haben **eine gemeinsame Ursache**.

### Die zwei bekannten Fälle

| Kombination | Gemessen | Schwelle |
|---|---|---|
| Beschriftung auf der Warn-Schaltfläche, Zustand *überfahren* | 3,70:1 | 4,5:1 |
| Beschriftung auf der Warn-Schaltfläche, Zustand *gedrückt* | 2,59:1 | 4,5:1 |

### Drei Fälle, die bisher niemand gemessen hat

Beim Durchgehen der Komponenten habe ich drei Kombinationen gefunden, welche die bestehende Prüfmatrix nicht abdeckt, die aber tatsächlich auf dem Bildschirm entstehen. Alle drei betreffen wieder nur die Warnung und nur das helle Theme:

| Kombination | Wo | Gemessen | Schwelle |
|---|---|---|---|
| Aktions-Schaltfläche in der Warnmeldung | `Notification`, weiche Form | 3,99:1 | 4,5:1 |
| Aktions-Schaltfläche in der Warn-Kurzmeldung | `Notification`, Toast | 4,29:1 | 4,5:1 |
| Symbolkreis der Warnung | `Modal` | 2,98:1 | 3:1 |

Die ersten beiden sind Text und brauchen 4,5:1. Der Symbolkreis ist ein grafisches Objekt und braucht 3:1 — er verfehlt sie um 0,02.

### Die Ursache

Die Warnfarbe ist unter den vier Statusfarben die einzige, deren mittlere Stufe hell ist. Der Vergleich macht es deutlich — es geht darum, wie gut **weiße Schrift** auf der jeweiligen Füllfarbe liest:

| Statusfarbe | Weiße Schrift auf der Füllfläche |
|---|---|
| Erfolg | 6,06:1 ✓ |
| Fehler | 7,55:1 ✓ |
| Information | 6,62:1 ✓ |
| **Warnung** | **3,21:1 ✗** |

Genau deshalb trägt die Warn-Schaltfläche als einzige *dunkle* Schrift statt weißer. Das funktioniert im Ruhezustand (4,95:1), aber sobald die Fläche beim Überfahren und Drücken nachdunkelt, verliert die dunkle Schrift ihren Halt: 3,70:1 und 2,59:1.

Dazu kommt ein zweiter Konflikt. Die Farbe des Zustands *überfahren* wird in den Meldungen **doppelt verwendet**: einmal als Hintergrund unter dunkler Schrift, einmal als Vordergrundfarbe für Symbol und Aktionstext auf heller Fläche. Diese beiden Aufgaben ziehen in entgegengesetzte Richtungen — als Hintergrund müsste die Farbe *heller* werden, als Vordergrund *dunkler*. Auf ihrem heutigen Wert verfehlt sie beides.

**Daraus folgt: Ein bloßes Verschieben dieser einen Farbe kann die Gruppe nicht lösen.** Jede Verschiebung repariert eine Seite und verschlechtert die andere.

### Vorschlag B — die Warnung an die anderen drei Statusfarben angleichen

> **Geprüft, aber nicht gewählt.** Der Inhaber hat sich für die Trennung der Doppelrolle entschieden (siehe unten), weil sie als einzige die helle Warnfarbe erhält. Dieser Abschnitt bleibt als Beleg der Abwägung stehen.

| Rolle | heute | Vorschlag |
|---|---|---|
| Füllfläche | amber-600 | **amber-800** |
| Füllfläche überfahren | amber-700 | **amber-900** |
| Füllfläche gedrückt | amber-800 | **amber-1000** |
| Beschriftung darauf | dunkles Stone | **Weiß** |

Das löst **alle fünf Fälle** auf einmal:

| Fall | heute | danach |
|---|---|---|
| Beschriftung, überfahren | 3,70:1 | 8,87:1 ✓ |
| Beschriftung, gedrückt | 2,59:1 | 12,01:1 ✓ |
| Aktionstext in der Meldung | 3,99:1 | 8,25:1 ✓ |
| Aktionstext im Toast | 4,29:1 | 8,87:1 ✓ |
| Symbolkreis im Modal | 2,98:1 | 5,71:1 ✓ |

**Welcher Weg ist das?** Der schonende: Die Rollen zeigen auf **bereits vorhandene Stufen** der Amber-Skala. Die Skala selbst wird nicht angefasst, keine andere Rolle ist mitbetroffen. Farbton und Sättigung bleiben unberührt — es bewegt sich ausschließlich die Helligkeit, innerhalb derselben Farbfamilie.

**Was sich sichtbar ändert — und das ist erheblich.** Die Warnung ist heute ein kräftiges, helles Orange. Sie würde zu einem tiefen, gebrannten Orange. Sie fällt dann nicht mehr durch Leuchtkraft auf, sondern durch Tiefe — so wie es Erfolg, Fehler und Information bereits tun. Betroffen sind die Warn-Schaltfläche, die gefüllte Warn-Markierung, der Fortschrittsbalken in Warnfarbe und der Symbolkreis im Modal. Die weichen Warnmeldungen mit hellem Hintergrund bleiben, wie sie sind.

Der Gewinn dabei: die Warnung hört auf, der Sonderfall zu sein. Die Ausnahmeregel „dunkle Schrift nur bei der Warnung" entfällt, alle vier Statusfarben verhalten sich gleich.

**Der Preis, klar benannt:** Die Warnfarbe verliert ihre Signalhelligkeit. Wenn die leuchtende Warnung ein bewusster Teil des Markenbildes ist, ist dieser Vorschlag der falsche — dann ist der richtige Weg der offene Punkt 2 unten.

### Zwei Wege, die ich geprüft und verworfen habe

**Die Füllfläche heller machen statt dunkler** (überfahren auf amber-500, gedrückt auf amber-400). Repariert die zwei Schaltflächen-Fälle, macht aber die drei neu entdeckten Fälle deutlich schlimmer: der Aktionstext in der Meldung fiele von 3,99:1 auf 2,18:1. Außerdem würde die Warn-Schaltfläche als einzige im hellen Theme beim Drücken *heller*. **Nicht empfehlenswert.**

**Die Amber-Stufen selbst nachdunkeln.** Erreicht dasselbe wie Vorschlag B, verschiebt dafür aber Stufen der Marken-Palette. Das erreicht jede Rolle, die dieselben Stufen verwendet, alle 36 Komponenten, beide Themes und die Token-Seiten des Portals. Da Vorschlag B dasselbe Ergebnis ohne diese Reichweite erzielt, gibt es keinen Grund dafür. **Nicht empfehlenswert.**

### Drei weitere Wege, die der Inhaber vorgeschlagen hat — alle rechnerisch ausgeschlossen

**Die Warnung auf die Orange-Skala umstellen.** Orange-600 sitzt in derselben Falle wie Amber-600, sogar tiefer: weiße Schrift 3,68:1, dunkle Schrift 4,31:1 — beides unter der Schwelle. Erst orange-700 trägt weiße Schrift (5,03:1), womit die Warnung zwar heller bliebe als bei Vorschlag B und sich besser vom Fehler-Rot abhöbe, aber es wäre ein **Farbtonwechsel** statt einer Helligkeitsänderung und berührte zusätzlich die Alias-Ebene. Nicht weiterverfolgt.

**Die Amber-Skala heller und gesättigter machen.** Rechnerisch ausgeschlossen. Kontrast hängt allein an der Leuchtdichte, und die Füllfarbe muss drei Bedingungen gleichzeitig erfüllen:

| Bedingung | Grenze für die Leuchtdichte |
|---|---|
| Dunkle Schrift darauf, 4,5:1 | mindestens 0,2476 |
| 3:1 gegen die weiße Seite | höchstens 0,3000 |
| Als Warn-Symbolkreis im Modal, 3:1 | höchstens 0,2754 |

Amber-600 liegt bei 0,2775 und ist damit **0,8 % zu hell** — genau das ist die 2,98:1-Verfehlung des Symbolkreises. Die Richtung, die hilft, ist eine Spur *dunkler*. Sättigung bewegt daran fast nichts: ein deutlich gesättigteres `#d97706` liegt bei 0,2796, praktisch gleichauf. Ein wirklich helles `#ff8c00` erreichte 6,81:1 für dunkle Schrift, fiele aber auf 2,33:1 gegen die weiße Seite.

**Die Beschriftung auf die Fließtextfarbe umstellen.** Wirkungslos — sie ist es bereits. `--medo-warning-on-solid` und `--medo-text` tragen im hellen Theme denselben Wert `#24221e`. Die gemessenen 3,70:1 und 2,59:1 sind schon mit dieser Farbe gemessen. Dunkler geht praktisch nichts mehr:

| Schriftfarbe | Ruhe | überfahren | gedrückt |
|---|---|---|---|
| stone-1000 (Fließtext, heute) | 4,95 ✓ | 3,70 ✗ | 2,59 ✗ |
| stone-1100 (dunkelste Stufe) | 5,68 ✓ | 4,25 ✗ | 2,97 ✗ |
| reines Schwarz | 6,55 ✓ | 4,89 ✓ | **3,42 ✗** |

Selbst reines Schwarz rettet den gedrückten Zustand nicht. Im dunklen Theme wäre die Umstellung zudem schädlich: dort ist die Fließtextfarbe hell, und helle Schrift auf hellem Amber ergäbe 2,19:1 statt der heutigen 7,76:1.

### Der Kern: warum keine Farbwahl die Gruppe lösen kann

Die Überfahren-Farbe muss als **Füllfläche unter dunkler Schrift** eine Leuchtdichte von mindestens 0,2476 haben und als **Akzentschrift auf der hellen Meldungsfläche** höchstens 0,1669. Diese beiden Fenster überschneiden sich nicht. **Kein Farbwert, kein Farbton und keine Sättigung erfüllen beides** — das ist keine Eigenschaft von Amber, sondern der Doppelrolle. Damit ist der Möglichkeitsraum über Farbwerte geschlossen.

### Beschluss des Inhabers: die Doppelrolle wird getrennt

Der Akzent bekommt ein **eigenes Token**, getrennt von der Füllfläche der Schaltfläche. Dadurch dürfen die Bedienzustände heller werden, und die helle Warnfarbe bleibt erhalten.

| Rolle | heute | beschlossen |
|---|---|---|
| Füllfläche | amber-600 | amber-600 (unverändert) |
| Füllfläche überfahren | amber-700 | **amber-500** |
| Füllfläche gedrückt | amber-800 | **amber-400** |
| Akzent in Meldung und Toast | *= überfahren* | **neues Token** auf amber-800 |
| Symbolkreis im Modal | *= Füllfläche* | **dasselbe neue Token** |

Nachgerechneter Endzustand, helles Theme — alle acht Prüfungen bestehen:

| Prüfung | Ergebnis |
|---|---|
| Beschriftung Ruhe / überfahren / gedrückt | 4,95 / 6,77 / 8,74 ✓ |
| Akzenttext in der Meldung / im Toast | 5,71 / 6,14 ✓ |
| Symbolkreis im Modal | 5,71 ✓ |
| Füllfläche gegen die Seite | 3,21 ✓ |
| Meldungstext | 11,17 ✓ |

Das dunkle Theme bleibt unverändert und durchgehend über den Schwellen (7,76 bis 11,89 für die Beschriftungen, 6,61 für den Akzent).

**Was sich sichtbar ändert:** Die Warnfarbe bleibt das kräftige helle Orange, das sie heute ist. Die Warn-Schaltfläche wird beim Überfahren und Drücken **heller** statt dunkler — so, wie sie sich im dunklen Theme ohnehin schon verhält. Der Akzent in Warnmeldungen und der Symbolkreis im Modal werden deutlich dunkler und damit klar lesbar.

**Eine Nebenwirkung, die heute niemand misst und die beim Abnehmen zu beurteilen ist.** Weil die Fläche beim Bedienen heller wird, verliert sie an Kante gegenüber der weißen Seite:

| Zustand | heute | nach der Änderung |
|---|---|---|
| überfahren | 4,29:1 | 2,35:1 |
| gedrückt | 6,14:1 | 1,82:1 |

Die bestehende Prüfmatrix misst nur die Füllfläche im Ruhezustand gegen die Seite, deshalb schlägt hier nichts an. Ob die Schaltfläche im gedrückten Zustand noch genug Kante hat, ist am Bildschirm zu beurteilen und nicht auszurechnen.

**Offene Frage für die Umsetzung: gilt die Trennung für alle vier Statusfarben?** Erfolg, Fehler und Information verwenden dieselbe Doppelrolle, verfehlen aber keine Schwelle — ihre 700er-Stufen tragen sowohl als Akzent (7,46 bis 8,79) als auch mit weißer Schrift als Füllung (7,96 bis 9,45). Ein neues Token nur für die Warnung macht die Warnung im Komponentencode zum Sonderfall; ein neues Token für alle vier hält das Muster einheitlich, ändert aber drei Rollen ohne fachliche Not. **Diese Entscheidung gehört ins Design-Projekt** und ist vor der Umsetzung zu klären.

---

## 6. Gruppe C — Der Textlink

| Kombination | Theme | Gemessen | Schwelle |
|---|---|---|---|
| Link auf gedrückter Fläche | hell | 4,18:1 | 4,5:1 |
| Link auf Textmarkierung | hell | 4,20:1 | 4,5:1 |
| Link auf gedrückter Fläche | dunkel | 4,11:1 | 4,5:1 |

**Schwelle 4,5:1**, weil es sich um Fließtext handelt.

### Vorschlag C1 — helles Theme

Der Textlink zeigt statt auf teal-600 auf **teal-700**.

| | heute | danach |
|---|---|---|
| auf gedrückter Fläche | 4,18:1 | 5,51:1 ✓ |
| auf Textmarkierung | 4,20:1 | 5,54:1 ✓ |
| auf der Grundfläche | 5,84:1 | 7,70:1 |

**Weg:** vorhandene Stufe. Nur die Rolle *Textlink* wechselt. Die Primärfläche der Schaltflächen verwendet zwar dieselbe Stufe teal-600, bleibt aber unberührt — es ändert sich nur, worauf der Link zeigt.

**Was sich sichtbar ändert:** Links werden eine Spur dunkler und satter. Der Unterschied zum Überfahren-Zustand (teal-800) bleibt erhalten, wenn auch etwas kleiner.

### Vorschlag C2 — dunkles Theme

Der Textlink zeigt statt auf teal-400 auf **teal-300**, der Überfahren-Zustand rückt von teal-300 auf **teal-200** nach.

| | heute | danach |
|---|---|---|
| auf gedrückter Fläche | 4,11:1 | 5,25:1 ✓ |
| auf der Grundfläche | 7,25:1 | 9,26:1 |

Das Nachrücken ist nötig, weil der Link sonst dieselbe Farbe hätte wie sein eigener Überfahren-Zustand — das Überfahren wäre nicht mehr zu sehen.

**Weg:** vorhandene Stufen, zwei Rollen betroffen.

**Was sich sichtbar ändert:** Links im dunklen Theme werden eine Spur heller.

> **Hinweis zur Einordnung:** Diese Unterschreitung im dunklen Theme ist bereits einmal als begründete Ausnahme abgenommen worden — mit dem Argument, dass die gedrückte Fläche nur für den Moment des Mausklicks besteht und das helle Theme dieselbe Eigenschaft hat. Das Argument steht weiterhin. Wenn Sie C1 freigeben, verliert es allerdings seine Grundlage: das helle Theme hätte die Eigenschaft dann nicht mehr. **Ich empfehle daher, C1 und C2 gemeinsam zu entscheiden.**

---

## 7. Gruppe D — Die kräftige Rahmenlinie

| Kombination | Gemessen | Schwelle |
|---|---|---|
| Kräftige Rahmenlinie auf Kartenfläche | 2,96:1 | 3:1 |

**Schwelle 3:1**, weil die Linie eine Bedienelement-Begrenzung trägt (etwa den Rahmen von Auswahlkästchen). Auf der weißen Grundfläche erreicht dieselbe Linie 3,17:1 und besteht — nur auf der leicht getönten Kartenfläche fällt sie um 0,04 darunter.

Hier stehen **zwei Wege** zur Wahl, und dies ist der einzige Fall im ganzen Bericht, bei dem eine Verschiebung der Marken-Palette überhaupt in Betracht kommt.

### Weg D1 — vorhandene Stufe

Die Rahmenlinie zeigt im hellen Theme statt auf stone-500 auf **stone-600**. Ergebnis: 6,41:1.

- **Reichweite:** klein, nur diese eine Rolle.
- **Sichtbar:** Die Linie wird deutlich dunkler — von einem zurückhaltenden Grau zu einer festen dunklen Kante. Für 0,04 fehlende Kontrastpunkte ein sehr kräftiger Eingriff; die Linie springt weit über das Ziel hinaus.
- **Nebenwirkung:** Die kräftige Rahmenlinie ist heute eine von nur vier Rollen, die im hellen und im dunklen Theme denselben Wert tragen. Dieser Weg würde das aufheben. Der Test, der diese Paare bewacht, würde anschlagen und müsste mitgeführt werden.

### Weg D2 — die Stufe selbst minimal nachdunkeln

Die Palettenstufe stone-500 wird um zwei Punkte je Farbkanal nachgedunkelt (`#94908c` → `#928e8a`). Ergebnis: 3,03:1 auf der Kartenfläche, 3,25:1 auf Weiß.

- **Reichweite:** groß. Betroffen wären außer der Rahmenlinie auch **gesperrter Text, gesperrte Symbole und gesperrte Schaltflächen-Beschriftungen — in beiden Themes.** Die Stufe kaskadiert durch alle 36 Komponenten und die Token-Seiten des Portals.
- **Sichtbar:** praktisch nichts. Zwei von 255 Punkten je Kanal liegen unter der Wahrnehmungsschwelle. Die gesperrten Elemente blieben im dunklen Theme weiterhin klar lesbar (4,88:1 statt 5,01:1).
- **Nebenwirkung:** keine. Weil beide Themes dieselbe Stufe verwenden, ändern sich beide gemeinsam; die Paarbeziehung bleibt erhalten.

### Weg D3 — als Ausnahme stehen lassen

2,96:1 gegen 3,00:1 ist eine Verfehlung von gut einem Prozent. Sie können diesen Fall wie die zwei bestehenden Ausnahmen behandeln und begründet dokumentieren. Dann bleibt AA an dieser Stelle unerreicht — das sollte eine bewusste Entscheidung sein, keine stillschweigende.

**Meine Einschätzung:** D2 löst den Fall genau und unsichtbar, kostet aber die größte Reichweite von allen Vorschlägen dieses Berichts. D1 ist klein in der Reichweite, aber grob im Ergebnis. Wenn Ihnen die unsichtbare Lösung die Kaskade wert ist, ist D2 richtig; wenn nicht, ist D3 ehrlicher als D1.

---

## 8. Offene Punkte

**Punkt 1 — Deckung als Helligkeit: entschieden.** Der Inhaber wertet die Anhebung der Ring-Deckung als Helligkeitsänderung; der hinterlegte Farbwert bleibt unverändert, nur seine Dichte steigt. Gruppe A wird umgesetzt.

**Punkt 2 — die doppelte Aufgabe der Warnfarbe: entschieden.** Die Doppelrolle wird getrennt, das helle Orange bleibt erhalten. Einzelheiten und nachgerechneter Endzustand in Abschnitt 5. **Dies ist eine Vertragsänderung und gehört als eigene Aufgabe ins Design-Projekt**, nicht in eine Farbkorrektur — sie braucht ein neues Token und zwei Komponenten müssen darauf zeigen (`Notification`, `Modal`).

**Offen geblieben — vor der Umsetzung von Gruppe B zu klären:** ob das neue Akzent-Token nur für die Warnung entsteht oder für alle vier Statusfarben. Siehe Abschnitt 5.

**Beobachtung ohne Handlungsbedarf.** Die Prüfmatrix misst Rahmenlinien nur gegen die Grundfläche und die Kartenfläche, nicht gegen die gehobene Kartenfläche. Dort läge die kräftige Rahmenlinie bei 2,68:1. Ob diese Kombination auf dem Bildschirm überhaupt entsteht, habe ich nicht feststellen können; ich vermerke es, damit es nicht unbemerkt bleibt.

---

## 9. Ihre Entscheidungen

Die Entscheidungen des Inhabers liegen vor und sind hier festgehalten. Dieser Bericht ist die Vorgabe für die spätere Umsetzung.

| Nr. | Fall | Beschlossen | Reichweite |
|---|---|---|---|
| **A** | Fokusring, 8 Kombinationen | Deckung **35 % → 75 %**, beide Ringe gleich | nur der Ring, keine Kaskade |
| **B** | Warnfarbe, 5 Kombinationen | **Doppelrolle trennen** — eigenes Akzent-Token auf amber-800, Bedienzustände auf amber-500/400, helle Warnfarbe bleibt | Vertragsänderung im Design-Projekt, neues Token, 2 Komponenten |
| **C1** | Textlink hell, 2 Kombinationen | teal-600 → **teal-700** | eine Rolle |
| **C2** | Textlink dunkel, 1 Kombination | teal-400 → **teal-300**, Überfahren → **teal-200** | zwei Rollen |
| **D** | Kräftige Rahmenlinie | **D2** — stone-500 minimal nachdunkeln (`#94908c` → `#928e8a`) | **Palettenstufe**, kaskadiert in beide Themes und alle 36 Komponenten |

### Was daraus für die Umsetzung folgt

**Eine einzige Marken-Palettenstufe wird verschoben: stone-500 (Fall D).** Sie erreicht außer der kräftigen Rahmenlinie auch gesperrten Text, gesperrte Symbole und gesperrte Schaltflächen-Beschriftungen in beiden Themes. Die Änderung ist mit zwei Punkten je Farbkanal unter der Wahrnehmungsschwelle, die Reichweite aber real.

**Alle übrigen Farbentscheidungen (A, C1, C2) kommen ohne Palettenänderung aus** und bewegen nur, worauf eine Rolle zeigt.

**Fall B ist keine Farbkorrektur, sondern eine Vertragsänderung** und gehört als eigene Aufgabe behandelt. Vor ihrer Umsetzung ist die offene Frage aus Abschnitt 5 zu klären, ob das neue Akzent-Token für eine oder für alle vier Statusfarben entsteht.

**Zwei Änderungen brauchen einen Blick am Bildschirm, weil keine Zahl sie entscheidet:** der deutlich kräftigere Fokusring (Fall A) und die Kante der Warn-Schaltfläche im gedrückten Zustand (Fall B, siehe Abschnitt 5).

**Der Paar-Test bleibt von allen Entscheidungen unberührt.** Fall D verschiebt die Stufe stone-500 für beide Themes gemeinsam, die Gleichheit der vier betroffenen Rollen bleibt also bestehen. Der Weg D1, der sie aufgehoben hätte, wurde nicht gewählt.
