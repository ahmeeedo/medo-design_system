# Avatar — Entwurf zur Freigabe

**Stand:** 26.08.2026 · **Status:** wartet auf Freigabe · **Vorschau:** [`avatar-entwurf.html`](./avatar-entwurf.html) im Browser öffnen

---

## Worum es geht

Der Avatar ist der kleine runde Kreis, der neben einem Namen steht und zeigt, um welche Person es geht. Er existiert heute **nirgends als eigene Komponente** — weder im medo-Design-Projekt noch im Spiegel `design-reference/` noch in `src/components/`.

Was es gibt: An zwei Stellen im System steht der Kreis heute **hineingebaut** — einmal fest verdrahtet in der Komponente Contained-list, einmal als reines Demo-Markup in der Spezifikationsseite Data-table. Wer eine Tabelle mit Personen bauen will, muss den Kreis heute selbst nachbauen.

Dieser Entwurf schlägt vor, daraus eine Komponente zu machen — **genau so, wie sie an diesen beiden Stellen heute schon aussieht.** Nichts auf Vorrat.

---

## Ein Befund vorweg: es gibt keine Bild-Avatare

Die Aufgabenstellung ging davon aus, die beiden Spezifikationsseiten zeigten „runde Bilder in Listeneinträgen und Tabellenzeilen".

**Das ist nicht der Fall.** Ich habe das gesamte Referenzmaterial durchsucht — alle 33 Spezifikationsseiten unter `design-reference/components/` und alle Referenzdateien unter `design-reference/ui/`. Es gibt **kein einziges Bild** in einem Avatar. Überall stehen **zwei Buchstaben**, aus dem Namen abgeleitet.

Das ändert die Gewichtung des Entwurfs:

- **Initialen sind der belegte Normalfall** — nicht der Rückfall.
- **Ein Bild-Avatar ist eine Ergänzung** (siehe [Ergänzung 1](#erganzung-1-bild-statt-initialen)). Er ist nicht falsch, aber er ist nicht belegt, und Sie entscheiden ihn einzeln.

---

## Der Vorschlag auf einen Blick

| | Was | Beleg? |
|---|---|---|
| **Form** | Kreis | belegt |
| **Zwei Größen** | 30 px (Tabellenzeile) · 38 px (Listenzeile) | belegt |
| **Füllung** | Zwei Buchstaben, halbfett | belegt |
| **Farbe** | Entweder eine feste (Teal) oder eine aus vier durchlaufenden | beides belegt |
| **Ladezustand** | Grauer Kreis ohne Inhalt | belegt |
| **Für Vorleseprogramme** | Unsichtbar — der Name steht ja daneben | belegt |
| **Bild statt Buchstaben** | mit Rückfall auf Buchstaben, wenn es nicht lädt | **Ergänzung** |
| **Symbol, wenn kein Name da ist** | Personen-Symbol im Kreis | **Ergänzung** |

---

## Teil A — Die belegten Fälle

Jeder Punkt hier ist eine Darstellung, die heute im System steht. Die Fundstelle ist jeweils zitiert.

### A1 · Form: Kreis

Beide Fundstellen setzen dieselbe Rundung — vollständig rund.

> `Contained-list.dc.html:67` — `border-radius:9999px`
> `Data-table.dc.html:40` — `.dt-avatar{width:30px;height:30px;border-radius:9999px;…}`

**Token:** `--medo-radius-full` (= 9999px). Passt exakt.

### A2 · Größe „sm" — 30 px, für Tabellenzeilen

Die Data-table setzt den Avatar auf 30 × 30 Pixel.

> `Data-table.dc.html:40` — `.dt-avatar{width:30px;height:30px;…font-size:12px;font-weight:600;flex:none}`
> `Data-table.dc.html:98` — `<span class="dt-avatar" style="background:{{ r.avatarBg }};color:{{ r.avatarText }}">{{ r.initials }}</span>`

Der Abstand zum Namen daneben beträgt dort 11 px (`gap:11px`, `Data-table.dc.html:97`).

### A3 · Größe „md" — 38 px, für Listenzeilen

Die Contained-list setzt ihn auf 38 × 38 Pixel — an zwei Stellen identisch.

> `Contained-list.dc.html:67` (Mehrfachauswahl) und `:103` (Gruppenliste) — `width:38px;height:38px;border-radius:9999px;…font-size:13px;font-weight:600;flex:none`

Bestätigt durch den bereits ausgelieferten Port:

> `src/components/ContainedList/ContainedList.css:82-92` — `.medo-clist__avatar{ flex:none; width:38px; height:38px; border-radius: var(--medo-radius-full); … }`

Der Abstand zum Text beträgt hier 14 px (`gap:14px`).

**Zwei Größen, nicht mehr.** Eine dritte kommt im System nirgends vor.

### A4 · Füllung: zwei Buchstaben

Beide Fundstellen zeigen genau zwei Großbuchstaben, halbfett.

> `Contained-list.dc.html:218` — `{ id: 'm0', initials: 'AM', title: 'Anna Müller', … }`
> `Data-table.dc.html:283` — `const initials = r.name.split(' ').map(w => w[0]).join('').slice(0, 2);`

Die zweite Fundstelle zeigt zusätzlich, **woher** die Buchstaben kommen: aus dem Namen, erster Buchstabe je Wort, abgeschnitten nach zwei. „Anna Müller" wird zu „AM", „Dr. Marie Hoffmann" zu „DM".

**Vorschlag:** Die Komponente leitet die Buchstaben selbst aus dem Namen ab — so wie die Data-table es heute tut —, und man kann sie bei Bedarf auch direkt vorgeben, wie in der Contained-list.

**Schriftgewicht:** halbfett, Token `--medo-weight-semibold` (= 600). Passt exakt.

### A5 · Farbe, Fall 1: eine feste Farbe

Die Contained-list gibt allen Avataren dieselbe Farbe — helles Teal mit dunklem Teal als Schrift.

> `Contained-list.dc.html:343` — `checkFill, avatarBg: primary[100], avatarText: primary[800],`

**Tokens:** Fläche `--medo-primary-100`, Schrift `--medo-primary-800`. Beide vorhanden, exakte Entsprechung.

### A6 · Farbe, Fall 2: vier durchlaufende Farben

Die Data-table verteilt vier Farbpaare reihum über die Zeilen, damit die Personen auf einen Blick unterscheidbar sind.

> `Data-table.dc.html:269` — `const avatarPalette = [[primary[100], primary[800]], [warning[50], warning[900]], [success[50], success[700]], [stone[200], stone[900]]];`
> `Data-table.dc.html:282` — `const pal = avatarPalette[(r.id - 1) % avatarPalette.length];`

**Tokens** — alle vier Paare sind vorhanden und entsprechen exakt:

| | Fläche | Schrift |
|---|---|---|
| 1 | `--medo-primary-100` | `--medo-primary-800` |
| 2 | `--medo-warning-50` | `--medo-warning-900` |
| 3 | `--medo-success-50` | `--medo-success-700` |
| 4 | `--medo-neutral-alt-200` | `--medo-neutral-alt-900` |

**Vorschlag:** Die Farbe wird aus dem Namen bestimmt, nicht aus der Zeilennummer. Dieselbe Person bekommt damit überall dieselbe Farbe — in der Tabelle, in der Liste, im Menü. Die Referenz rechnet mit der Zeilennummer (`r.id - 1`); das ist in einer statischen Demo-Tabelle gleichwertig, in echten, sortierbaren Daten aber nicht: dort würde beim Umsortieren die Farbe einer Person springen.

> **Diese Abweichung von der Fundstelle lege ich Ihnen ausdrücklich vor.** Wenn Sie sie nicht wollen, bleibt es bei der Reihenfolge.

### A7 · Zustand: Laden

Die Data-table zeigt beim Laden einen grauen Kreis ohne Inhalt, in derselben Größe.

> `Data-table.dc.html:144` — `<div class="sk" style="width:30px;height:30px;border-radius:9999px;flex:none"></div>`

**Token:** Fläche `--medo-surface-container-high` (= stone-100, exakt der Wert `#ececeb` aus der Fundstelle).

### A8 · Für Vorleseprogramme unsichtbar

Der Avatar wird von Screenreadern übersprungen — der Name steht ja unmittelbar daneben im Text, und „AM" vorgelesen zu bekommen hilft niemandem.

> `design-reference/ui/ContainedList.jsx:245-246` — `React.createElement("span", { className: "medo-clist__avatar", "aria-hidden": "true" }, it.avatar)`

**Vorschlag:** So bleibt es. Steht der Avatar ausnahmsweise allein, ohne Namen daneben, kann der Aufrufer eine Beschriftung mitgeben.

### A9 · Kein eigener „deaktiviert"-Zustand

Die Contained-list blendet **die ganze Zeile** ab, wenn sie deaktiviert ist — nicht den Avatar einzeln.

> `Contained-list.dc.html:47` — `…style="…opacity:{{ r.opacity }}"` auf der Zeile

**Vorschlag:** Der Avatar bekommt keinen eigenen Deaktiviert-Zustand. Die Umgebung regelt das.

---

## Teil B — Ergänzungen

Diese Vorschläge lassen sich **nicht** auf eine Fundstelle zurückführen. Sie stehen hier einzeln, damit Sie jeden für sich annehmen oder verwerfen können.

<a id="erganzung-1-bild-statt-initialen"></a>
### Ergänzung 1 · Bild statt Buchstaben — **und was passiert, wenn es nicht lädt**

**Kein Beleg.** Es gibt im gesamten Referenzmaterial kein Bild in einem Avatar.

**Begründung, sie trotzdem vorzuschlagen:** Sobald eine Anwendung Profilbilder kennt, ist der Avatar der Ort, an dem sie erscheinen. Die Komponente jetzt ohne diese Möglichkeit zu bauen heißt, sie später aufbrechen zu müssen.

**Das ist der wichtigere Teil dieser Ergänzung:** Ein Bild lädt irgendwann nicht — der Server antwortet nicht, die Adresse ist veraltet, das Netz ist weg. Das ist kein Sonderfall, sondern tritt im Betrieb regelmäßig ein. Ohne Regelung sieht der Anwender dann ein kaputtes Bildsymbol oder einen leeren Kreis.

**Vorschlag für die Reihenfolge, in der zurückgefallen wird:**

1. Bild vorhanden und geladen → **Bild**, kreisrund beschnitten
2. Bild fehlt oder lädt nicht → **die zwei Buchstaben** (also der belegte Normalfall aus A4)
3. Kein Name vorhanden → **Personen-Symbol** (siehe Ergänzung 2)

Der Rückfall ist für den Anwender nicht als Fehler erkennbar — er sieht einfach den Buchstaben-Avatar. Das ist gewollt.

**Annehmen oder verwerfen?** Verwerfen Sie diese Ergänzung, bleibt der Avatar reine Buchstaben — was heute überall im System der Fall ist.

### Ergänzung 2 · Personen-Symbol, wenn kein Name da ist

**Kein direkter Beleg** — für die *Verwendung*. Für die *Darstellung* gibt es einen: Die Contained-list zeigt im Leerzustand ein Symbol in einem getönten Kreis.

> `Contained-list.dc.html:165` — `<div style="width:52px;height:52px;border-radius:9999px;background:{{ iconBg }};color:{{ muted }};…"><span class="msr" style="font-size:26px">inbox</span></div>`

**Begründung:** Es gibt Fälle ohne Namen — ein gelöschtes Konto, eine noch nicht angenommene Einladung, ein Systemvorgang ohne Person dahinter. Zwei Buchstaben lassen sich daraus nicht bilden. Ohne diesen Fall bleibt der Kreis leer.

**Vorschlag:** Material-Symbol `person`, in getönter Fläche — Fläche `--medo-surface-sunken`, Symbol `--medo-icon-muted`, analog zur zitierten Fundstelle.

### Ergänzung 3 · Farbe aus dem Namen statt aus der Zeilennummer

Bereits unter [A6](#a6--farbe-fall-2-vier-durchlaufende-farben) beschrieben und dort begründet. Ich führe sie hier noch einmal auf, damit sie in der Liste der Einzelentscheidungen nicht untergeht.

---

## Teil C — Was ich bewusst **nicht** vorschlage

Diese Dinge haben andere Designsysteme, und es wäre naheliegend, sie mitzubauen. Sie kommen im medo-System nirgends vor, also schlage ich sie nicht vor:

- **Größen über 38 px** (z. B. für eine Profilseite) — kein Beleg, kein bekannter Bedarf.
- **Quadratische oder abgerundet-quadratische Variante** — die Referenz kennt für Personen nur den Kreis. Die eckige, getönte Fläche ist im System dem **Symbol** vorbehalten (`Contained-list.dc.html:48`, Radius 9 px) — die Unterscheidung „rund = Person, eckig = Sache" ist im System durchgehend eingehalten und sollte nicht verwässert werden.
- **Anwesenheitspunkt** (grüner Punkt „online") — kein Beleg.
- **Avatar-Gruppe** (mehrere überlappende Kreise für „und 4 weitere") — kein Beleg.
- **Klickbarer Avatar** mit eigenem Hover- und Fokus-Zustand — kein Beleg. Wo der Avatar heute in einer klickbaren Zeile steht, reagiert **die Zeile**, nicht der Kreis.

Sagen Sie, dass eines davon gebraucht wird, nehme ich es auf.

---

## Teil D — Offene Punkte: fehlende Tokens

Diese Angaben brauche ich, und es gibt dafür **keine** Token-Stufe. Ich habe sie nicht mit plausiblen Werten gefüllt.

### D1 · Es gibt keine Token für Komponentengrößen (30 px / 38 px)

Die Abstands-Stufen des Systems sind 24, 32 und 48 Pixel (`src/styles/medo/spacing.css`). **30 und 38 liegen zwischen den Stufen.**

Die Regel des Projekts trennt hier: Bei einer 1:1 portierten Komponente bleiben die Zahlen der Referenz unangetastet. Der Avatar ist aber **kein Port, sondern ein Neuentwurf** — und für neu geschriebenes CSS gilt, dass Zwischenwerte aus Tokens berechnet statt hingeschrieben werden.

**Was ich brauche:** eine Entscheidung, welcher der beiden Wege gilt.

- **Weg 1 — Zahlen übernehmen (30/38).** Der Avatar sieht überall exakt so aus wie heute. Bricht die Zwischenwert-Regel für neuen Code.
- **Weg 2 — auf Token-Stufen ziehen (32/40).** Regelkonform, aber der Avatar wird in der Tabelle 2 px größer und in der Liste 2 px größer als heute. Die ausgelieferte Contained-list müsste mitgezogen werden, sonst stehen zwei verschiedene Avatare im System.

> **Meine Empfehlung: Weg 1.** Der Unterschied ist mit bloßem Auge nicht zu sehen, aber Weg 2 verlangt eine Änderung an bereits ausgeliefertem Code. Das steht in keinem Verhältnis.

### D2 · Es gibt keine Schriftgrößen-Stufe 13 px

Die Contained-list setzt die Buchstaben auf 13 px (`Contained-list.dc.html:67`). Die Stufen des Systems sind 12 px (`--medo-text-xs`) und 14 px (`--medo-text-sm`).

**Hier gibt es bereits eine Entscheidung im System**, die ich nur übernehme: Der ausgelieferte Port hat 13 px schon auf 12 px gezogen.

> `src/components/ContainedList/ContainedList.css:89` — `font-size: var(--medo-text-xs);`

**Vorschlag:** Beide Größen nutzen `--medo-text-xs` (12 px). Damit stimmt der Avatar mit dem überein, was heute ausgeliefert wird. **Kein neuer Token nötig** — ich melde es nur, damit die Abweichung von der Fundstelle nicht unbemerkt bleibt.

### D3 · Es gibt keine Laufweiten-Stufe 0,02 em

Der ausgelieferte Port zieht die Buchstaben minimal auseinander (`ContainedList.css:91` — `letter-spacing: 0.02em`). Die Stufen sind −0,02 em, 0 und 0,04 em.

**Vorschlag:** übernehmen wie im Port. **Offener Punkt, aber ohne Folge** — es ist derselbe Wert, der heute schon ausgeliefert wird.

### D4 · Der Dunkelmodus ist für zwei der vier Farbpaare ungeklärt

Für das Teal-Paar ist die Frage im System **schon beantwortet**:

> `src/styles/medo-theme-components.css:120-125` — *„teal-100 is the light value of `--medo-state-selected`; the initials follow the 800 -> 300 mapping, because teal-800 on a teal surface is unreadable."*

Für die drei anderen Paare gibt es diese Antwort nicht. Es gibt zwar fertige Hell/Dunkel-Paare im System (`--medo-warning-surface` / `--medo-warning-text` und `--medo-success-surface` / `--medo-success-text`), aber deren **helle** Werte weichen von der Fundstelle ab: die Schrift wäre dort dunkler als in der Data-table.

**Zwei Wege, und ich brauche Ihre Entscheidung:**

- **Weg 1 — die fertigen Hell/Dunkel-Paare nehmen.** Der Dunkelmodus ist ohne weitere Arbeit gelöst. Dafür ist die Schrift in drei der vier Farben im Hellmodus geringfügig dunkler als in der Spezifikationsseite.
- **Weg 2 — die Werte der Fundstelle exakt halten.** Der Hellmodus stimmt exakt mit der Spezifikationsseite überein. Dafür brauchen die drei übrigen Paare je einen eigenen Dunkelmodus-Eintrag, der noch festzulegen ist — **und dafür fehlt mir die Vorgabe.**

> **Meine Empfehlung: Weg 1.** Er nutzt, was das System bereits entschieden hat, und erfindet keine Werte. Der sichtbare Unterschied im Hellmodus betrifft nur die Schrift in drei von vier Kreisen — jeweils eine Stufe dunkler.

**Die Vorschau zeigt beide Wege nebeneinander** — schalten Sie dort in den Dunkelmodus, um zu sehen, worum es geht.

### D5 · Kein Namenskonflikt beim CSS-Präfix

Kein offener Punkt, sondern eine Entwarnung: Ich habe alle 40 vergebenen Präfixe unter `src/components/` geprüft. **`medo-av` ist frei.** Der Avatar kann es ohne Kollision belegen.

---

## Teil E — Wo der Avatar künftig stehen könnte

| Stelle | Was sich ändert | Aufwand |
|---|---|---|
| **Contained-list** (`src/components/ContainedList/`) | Der heute fest eingebaute Kreis wird durch die Komponente ersetzt. Sichtbar ändert sich nichts. | Ersetzen, kein Vertragsbruch — die Zeilen-Eigenschaft `avatar` bleibt, wie sie ist |
| **Data-table** (`src/components/DataTable/`) | Bisher muss der Aufrufer den Kreis selbst nachbauen. Die Tabelle erlaubt eine eigene Zelldarstellung (`render`), in die der Avatar direkt hineinpasst. | Kein Eingriff in die Tabelle nötig |
| **Doku-Seite der Data-table** | Die Spezifikationsseite zeigt eine Personentabelle **mit** Avataren, die Doku-Seite im Portal zeigt sie **ohne**. Der Port hat den Kreis unterwegs verloren. | Nachziehen, sobald der Avatar existiert |
| **Ladezustand der Data-table** | Zeigt heute schon einen grauen Kreis (`Data-table.dc.html:144`), von Hand gebaut. | Könnte den Avatar in seinem Ladezustand nutzen |
| **Menu** (`src/components/Menu/`) | Ein Benutzermenü mit „Angemeldet als …" ist die klassische Stelle für einen Avatar. | **Heute nicht vorhanden** — nur Möglichkeit, kein Bedarf |
| **Kopfzeile des Portals** | Dito. | **Heute nicht vorhanden** — nur Möglichkeit, kein Bedarf |

Die letzten beiden Zeilen stehen hier der Vollständigkeit halber. Sie sind **kein Argument** für den Avatar — die ersten vier sind es.

---

## Was ich von Ihnen zur Freigabe brauche

Bitte öffnen Sie **[`docs/avatar-entwurf.html`](./avatar-entwurf.html)** im Browser (Doppelklick genügt, kein Entwicklungsserver nötig) und sehen Sie sich die Matrix an. Dann bitte Rückmeldung zu diesen Punkten:

1. **Teil A — die belegten Fälle:** Passt das Aussehen? Insbesondere die zwei Größen nebeneinander und die vier Farben.
2. **Ergänzung 1 (Bild + Rückfall):** aufnehmen oder verwerfen?
3. **Ergänzung 2 (Personen-Symbol):** aufnehmen oder verwerfen?
4. **Ergänzung 3 (Farbe aus dem Namen statt aus der Zeilennummer):** aufnehmen oder verwerfen?
5. **Teil C:** Fehlt Ihnen etwas, das ich bewusst weggelassen habe?
6. **Offener Punkt D1** (30/38 px halten oder auf 32/40 px ziehen) — meine Empfehlung: halten.
7. **Offener Punkt D4** (Dunkelmodus) — meine Empfehlung: die fertigen Paare nehmen. In der Vorschau umschaltbar.

---

## Freigabe

> _Wird nach Ihrer Rückmeldung hier eingetragen: was angenommen, was verworfen wurde._

**Status:** offen
