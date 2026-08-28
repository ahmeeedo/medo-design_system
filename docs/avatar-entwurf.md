# Avatar — Entwurf zur Freigabe

**Fassung 2 · Stand:** 28.08.2026 · **Status:** wartet auf Freigabe · **Vorschau:** [`avatar-entwurf.html`](./avatar-entwurf.html) im Browser öffnen

---

## Was sich gegenüber Fassung 1 geändert hat

Der Inhaber hat das Layout freigegeben und drei Änderungen angeordnet. Sie sind eingearbeitet:

| | Anordnung | Folge |
|---|---|---|
| 1 | **Bild-Variante und Buchstaben-Variante**, Buchstaben aus Vor- und Nachname beziehungsweise aus dem Benutzernamen | [Ergänzung 1](#erganzung-1-bild-statt-initialen) angenommen · Ableitungsregel neu in [A4](#a4--füllung-zwei-buchstaben) |
| 2 | **Hintergrund der Buchstaben-Variante: alle Brand-Farben auf 600er Stärke** | ersetzt [A5](#a5--farbe-fall-1-eine-feste-farbe) und [A6](#a6--farbe-fall-2-vier-durchlaufende-farben) · neuer Abschnitt [F](#teil-f--farbe-fassung-2) |
| 3 | **Große Version für ein Profilbild** mitbedenken | neue Größe `lg` in [A3](#a3--größe-md--38-px-für-listenzeilen) · in der Vorschau in zwei Stufen gezeigt |

**Die 600er-Stärke bringt drei Punkte mit, die Sie noch entscheiden müssen** — sie stehen in [Teil F](#teil-f--farbe-fassung-2) und in der Vorschau. Kurz:

- **Drei der fünfzehn Farben tragen keine weiße Schrift** (Orange, Amber, Gelb). Sie bekommen dunkle Buchstaben. Geprüft, nicht geschätzt — die Messwerte stehen in [F2](#f2--wo-die-weiße-schrift-nicht-reicht).
- **Der Dunkelmodus löst sich damit von selbst.** Der offene Punkt D4 aus Fassung 1 entfällt.
- **Die Contained-list würde sichtbar anders aussehen**, wenn sie später auf die Komponente umgestellt wird. Das ist ausgelieferter Code — siehe [F4](#f4--was-das-für-die-contained-list-bedeutet).

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

| | Was | Herkunft |
|---|---|---|
| **Form** | Kreis | belegt |
| **Drei Größen** | 30 px (Tabelle) · 38 px (Liste) · 64 px (Profil) | 30/38 belegt · 64 **angeordnet** |
| **Füllung, Fall 1** | Bild, kreisrund beschnitten | **angeordnet** |
| **Füllung, Fall 2** | Zwei Buchstaben, halbfett | belegt |
| **Herkunft der Buchstaben** | Vor- und Nachname, sonst Benutzername | **angeordnet** |
| **Hintergrund der Buchstaben** | Brand-Farben auf 600er Stärke, weiße Schrift | **angeordnet** |
| **Rückfall** | Bild lädt nicht → Buchstaben → Personen-Symbol | **Ergänzung** |
| **Ladezustand** | Grauer Kreis ohne Inhalt | belegt |
| **Für Vorleseprogramme** | Unsichtbar — der Name steht ja daneben | belegt |

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

### A3b · Größe „lg" — 64 px, für das Profilbild · **angeordnet**

**Kein Beleg** — im System kommt heute keine Größe über 38 px vor. Der Inhaber hat sie angeordnet, damit ein Profilbild einen Platz hat.

Ich schlage **64 px** vor, und zwar aus einem Grund, der nicht Geschmack ist: **64 px ist eine exakte Stufe des Systems** (`--medo-space-3xl`), und die passende Schriftgröße für die Buchstaben ist es ebenfalls — **25 px** (`--medo-text-xl`). Beide Maße liegen damit auf Tokens; ich muss nichts erfinden und nichts ausrechnen.

Zum Vergleich zeigt die Vorschau daneben **96 px** (`--medo-space-4xl`, Buchstaben `--medo-text-3xl` = 39 px) — ebenfalls token-genau, falls Ihnen 64 px für eine Profilseite zu klein ist.

> **Bitte wählen Sie eine der beiden.** Ich schlage 64 px vor: Es ist deutlich größer als alles Bestehende, bleibt aber in einer Kopfzeile oder einer Seitenleiste noch unterzubringen.

### A4 · Füllung: zwei Buchstaben

Beide Fundstellen zeigen genau zwei Großbuchstaben, halbfett.

> `Contained-list.dc.html:218` — `{ id: 'm0', initials: 'AM', title: 'Anna Müller', … }`
> `Data-table.dc.html:283` — `const initials = r.name.split(' ').map(w => w[0]).join('').slice(0, 2);`

Die zweite Fundstelle zeigt zusätzlich, **woher** die Buchstaben kommen: aus dem Namen, erster Buchstabe je Wort, abgeschnitten nach zwei. „Anna Müller" wird zu „AM", „Dr. Marie Hoffmann" zu „DM".

**Angeordnet:** Die Buchstaben kommen aus Vor- und Nachname — **und wenn es keinen Namen gibt, aus dem Benutzernamen.** Der zweite Fall steht in der Referenz nicht; die dortige Regel liefert bei einem Benutzernamen ohne Leerzeichen nur **einen** Buchstaben.

**Vorschlag für die Regel**, die beides abdeckt:

| Eingabe | Ergebnis | warum |
|---|---|---|
| `Anna Müller` | **AM** | zwei Wörter → erster Buchstabe je Wort |
| `Dr. Marie Hoffmann` | **DM** | wie oben, nach zwei ist Schluss |
| `anna.mueller` | **AM** | Punkt, Bindestrich und Unterstrich trennen wie ein Leerzeichen |
| `amueller` | **AM** | nur ein Wort → die ersten **zwei** Buchstaben |
| `anna@medo.de` | **AM** | alles ab dem `@` wird abgeschnitten, dann wie oben |
| `Müller` | **MÜ** | nur ein Wort → die ersten zwei Buchstaben |

Die Buchstaben werden immer groß dargestellt, egal wie sie hereinkommen. Vorgeben lassen sie sich weiterhin auch direkt, so wie es die Contained-list heute tut.

**Schriftgewicht:** halbfett, Token `--medo-weight-semibold` (= 600). Passt exakt.

### A5 · Farbe, Fall 1: eine feste Farbe

> **Überholt durch Anordnung 2.** Was hier steht, beschreibt weiterhin richtig, wie das System heute aussieht — die Farbe des Entwurfs steht jetzt in [Teil F](#teil-f--farbe-fassung-2).

Die Contained-list gibt allen Avataren dieselbe Farbe — helles Teal mit dunklem Teal als Schrift.

> `Contained-list.dc.html:343` — `checkFill, avatarBg: primary[100], avatarText: primary[800],`

**Tokens:** Fläche `--medo-primary-100`, Schrift `--medo-primary-800`. Beide vorhanden, exakte Entsprechung.

### A6 · Farbe, Fall 2: vier durchlaufende Farben

> **Überholt durch Anordnung 2.** Der *Gedanke* — mehrere Farben reihum, damit sich Personen unterscheiden — bleibt und wird in [Teil F](#teil-f--farbe-fassung-2) auf fünfzehn Farben erweitert. Die *Werte* hier gelten nicht mehr.

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

Bereits unter [A6](#a6--farbe-fall-2-vier-durchlaufende-farben) beschrieben und dort begründet. Ich führe sie hier noch einmal auf, damit sie in der Liste der Einzelentscheidungen nicht untergeht. Mit fünfzehn Farben statt vier wiegt sie schwerer: Je mehr Farben im Umlauf sind, desto auffälliger ist ein Farbsprung beim Umsortieren.

---

## Teil F — Farbe (Fassung 2)

**Angeordnet:** Der Hintergrund der Buchstaben-Variante nutzt **alle Brand-Farben auf 600er Stärke**.

Das ist eine deutliche Abkehr von dem, was heute im System steht: Dort sind die Kreise **hell** getönt (Stufen 50 bis 200) und tragen **dunkle** Buchstaben. Auf 600er Stärke ist es umgekehrt — kräftige Fläche, **weiße** Buchstaben. Der Avatar wird damit zu einem farbigen Punkt in der Zeile statt zu einer zurückhaltenden Tönung.

### F1 · Die Palette

Das System führt **fünfzehn** Brand-Farbfamilien. Alle haben eine 600er Stufe:

| | Familie | 600er Wert | Buchstaben |
|---|---|---|---|
| 1 | Rot | `--medo-color-red-600` | weiß |
| 2 | Karmin | `--medo-color-crimson-600` | weiß |
| 3 | Rosé | `--medo-color-rose-600` | weiß |
| 4 | **Orange** | `--medo-color-orange-600` | **dunkel** |
| 5 | **Amber** | `--medo-color-amber-600` | **dunkel** |
| 6 | **Gelb** | `--medo-color-yellow-600` | **dunkel** |
| 7 | Grün | `--medo-color-green-600` | weiß |
| 8 | Teal | `--medo-color-teal-600` | weiß |
| 9 | Cyan | `--medo-color-cyan-600` | weiß |
| 10 | Blau | `--medo-color-blue-600` | weiß |
| 11 | Indigo | `--medo-color-indigo-600` | weiß |
| 12 | Violett | `--medo-color-violet-600` | weiß |
| 13 | Purpur | `--medo-color-purple-600` | weiß |
| 14 | Grau | `--medo-color-grey-600` | weiß |
| 15 | Stein | `--medo-color-stone-600` | weiß |

Weiß ist `--medo-color-white`, das Dunkel ist `--medo-color-stone-1100`. **Alle Angaben sind Tokens; nichts davon ist ein erfundener Wert.**

<a id="f2--wo-die-weiße-schrift-nicht-reicht"></a>
### F2 · Wo die weiße Schrift nicht reicht — gemessen, nicht geschätzt

Ich habe für alle fünfzehn Farben den Kontrast gegen weiße Schrift nach WCAG 2.2 berechnet. Buchstaben in 12 px halbfett zählen als normaler Text und brauchen **4,5:1**.

**Zwölf Farben bestehen. Drei nicht:**

| Farbe | weiße Schrift | dunkle Schrift (`stone-1100`) |
|---|---|---|
| Orange | 3,68 ✗ | **4,95 ✓** |
| Amber | 3,21 ✗ | **5,68 ✓** |
| Gelb | 2,76 ✗ | **6,60 ✓** |

Zum Vergleich die schwächste der bestehenden zwölf: Teal mit 5,84 ✓, die stärkste Purpur mit 7,67 ✓.

**Vorschlag:** Diese drei bekommen dunkle Buchstaben, die anderen zwölf weiße. Eine Regel, drei Ausnahmen, alle geprüft.

**Zwei Wege wurden geprüft und verworfen** — damit Sie wissen, dass ich nicht bei der ersten Lösung stehengeblieben bin:

- *Die drei warmen Farben weglassen.* Dann wären es zwölf statt fünfzehn Farben, aber die Palette hätte ein Loch im warmen Bereich.
- *Die drei auf eine dunklere Stufe ziehen, damit überall Weiß steht.* Funktioniert nicht sauber: Orange bräuchte Stufe 700, Amber und Gelb erst Stufe 800. Das wäre keine „600er Stärke" mehr, und die drei Farben stünden sichtbar dunkler neben den übrigen zwölf.

> **In der Vorschau sehen Sie alle fünfzehn nebeneinander.** Die drei mit dunkler Schrift sind dort gekennzeichnet. Bitte urteilen Sie danach, ob die Reihe stimmig aussieht.

### F3 · Der Dunkelmodus löst sich damit von selbst

In Fassung 1 war der Dunkelmodus ein offener Punkt (D4): Die hellen Tönungen brauchten je eine dunkle Entsprechung, und für drei von vier fehlte sie.

**Das entfällt.** Eine 600er Fläche bringt ihren eigenen Hintergrund mit und hängt nicht davon ab, worauf sie liegt. Der Kreis sieht im Dunkelmodus genauso aus wie im Hellmodus, und die gemessenen Kontraste gelten unverändert.

> **Bitte prüfen Sie das trotzdem in der Vorschau** — der Umschalter oben rechts. Die Farben sollen im Dunkeln kräftig wirken, nicht grell.

<a id="f4--was-das-für-die-contained-list-bedeutet"></a>
### F4 · Was das für die Contained-list bedeutet — **bitte entscheiden**

Die Contained-list hat den Kreis heute fest eingebaut, in der hellen Tönung: helles Teal mit dunklem Teal als Schrift. **Dieser Code ist bereits an andere Projekte ausgeliefert.**

Stellt man die Contained-list später auf die neue Komponente um, **ändert sich dort das Aussehen sichtbar** — aus dem zurückhaltenden hellen Kreis wird ein kräftiger farbiger. Das bricht nichts und erzeugt keine Fehlermeldung, aber wer die Liste heute im Einsatz hat, sieht sie danach anders.

**Drei Wege:**

1. **Umstellen.** Ein Avatar, überall gleich. Die Listen sehen künftig farbiger aus als heute.
2. **Nicht umstellen.** Die Contained-list behält ihren eingebauten hellen Kreis, die neue Komponente steht daneben. Dann gibt es im System **zwei verschieden aussehende Avatare**.
3. **Umstellen, aber die Liste bleibt einfarbig** — alle Kreise in Teal 600, weiße Schrift. Die Liste bleibt ruhig, ist aber trotzdem auf eine Komponente umgestellt.

> **Meine Empfehlung: Weg 3.** Er beseitigt den doppelten Avatar und behält gleichzeitig, dass eine Liste ruhig aussehen soll und eine Tabelle bunt. Die Vorschau zeigt in Abschnitt 4 beides nebeneinander.

### F5 · Grau und Stein sind kaum zu unterscheiden

Zwei der fünfzehn Familien liegen auf 600er Stärke sehr nah beieinander — Grau (`#595b5e`) und Stein (`#615951`). In einer Reihe von Avataren, die Personen unterscheidbar machen soll, wirken sie wie dieselbe Farbe.

Dazu kommt: Beide lesen sich als „keine Farbe". Ein grauer Avatar in einer bunten Reihe sieht schnell nach „deaktiviert" oder „unbekannt" aus.

> **Vorschlag: Stein aus der Reihenfolge nehmen** — es blieben vierzehn. Grau und Stein bleiben verfügbar, wenn jemand sie ausdrücklich wählt. **In der Vorschau sind beide markiert**, damit Sie sie nebeneinander sehen und selbst urteilen können.

---

## Teil C — Was ich bewusst **nicht** vorschlage

Diese Dinge haben andere Designsysteme, und es wäre naheliegend, sie mitzubauen. Sie kommen im medo-System nirgends vor, also schlage ich sie nicht vor:

- ~~**Größen über 38 px**~~ — **durch Anordnung 3 aufgenommen**, siehe [A3b](#a3b--größe-lg--64-px-für-das-profilbild--angeordnet).
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

### D4 · Dunkelmodus — ~~offen~~ **erledigt**

In Fassung 1 stand hier ein offener Punkt: Die hellen Tönungen brauchten je eine dunkle Entsprechung, und für drei von vier Farbpaaren fehlte sie.

**Durch die Anordnung, auf 600er Stärke zu gehen, entfällt der Punkt vollständig.** Eine 600er Fläche bringt ihren eigenen Hintergrund mit; sie sieht im Dunkeln aus wie im Hellen. Es fehlt kein Token mehr. Die Begründung steht in [F3](#f3--der-dunkelmodus-löst-sich-damit-von-selbst).

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

**Erledigt aus Fassung 1** — hier ist nichts mehr zu tun: Layout freigegeben · Bild-Variante angenommen · Dunkelmodus (D4) durch die 600er Stärke gegenstandslos.

**Offen — dazu brauche ich Ihre Rückmeldung:**

1. **Die fünfzehn Farben auf 600er Stärke** (Abschnitt 2 der Vorschau): Sieht die Reihe stimmig aus? Bitte auch im **Dunkelmodus** ansehen — Umschalter oben rechts.
2. **Orange, Amber und Gelb tragen dunkle statt weißer Buchstaben** (in der Vorschau gekennzeichnet). Weiß ist dort nicht lesbar — gemessen, siehe [F2](#f2--wo-die-weiße-schrift-nicht-reicht). Geht das für Sie so durch?
3. **Grau und Stein** sehen fast gleich aus (in der Vorschau nebeneinander markiert). *Vorschlag: Stein aus der Reihenfolge nehmen.*
4. **Große Version: 64 px oder 96 px?** Beide in Abschnitt 3 der Vorschau, nebeneinander mit einem Bild und mit Buchstaben. *Vorschlag: 64 px.*
5. **Die Buchstaben-Regel** (Abschnitt 4 der Vorschau, mit Beispielen): Stimmt sie für Ihre Fälle? Besonders: Was soll aus einem Benutzernamen wie `amueller` werden — *Vorschlag: `AM`.*
6. **Was mit der Contained-list geschieht** ([F4](#f4--was-das-für-die-contained-list-bedeutet), Abschnitt 6 der Vorschau): Sie sieht nach einer Umstellung anders aus als heute. *Vorschlag: umstellen, aber die Liste bleibt einfarbig.*
7. **Größe 30/38 px halten oder auf 32/40 px ziehen?** (Abschnitt 7, unverändert aus Fassung 1.) *Vorschlag: halten.*
8. **Teil C:** Fehlt Ihnen noch etwas, das ich bewusst weggelassen habe?

---

## Freigabe

### Fassung 1 — Rückmeldung vom 28.08.2026

| | Punkt | Entscheidung |
|---|---|---|
| ✓ | Layout und Aufbau | **angenommen** — „Layout passt" |
| ✓ | Ergänzung 1 · Bild-Variante mit Rückfall | **angenommen** |
| ✓ | Buchstaben aus Vor- und Nachname beziehungsweise Benutzername | **angeordnet** — Regel in [A4](#a4--füllung-zwei-buchstaben) |
| ✓ | Hintergrund: alle Brand-Farben auf 600er Stärke | **angeordnet** — ersetzt A5/A6, ausgeführt in [Teil F](#teil-f--farbe-fassung-2) |
| ✓ | Große Version für ein Profilbild | **angeordnet** — [A3b](#a3b--größe-lg--64-px-für-das-profilbild--angeordnet), Größe noch zu wählen |
| — | Ergänzung 2 · Personen-Symbol | noch nicht entschieden, bleibt im Entwurf |
| — | Ergänzung 3 · Farbe aus dem Namen | noch nicht entschieden, bleibt im Entwurf |
| — | Offener Punkt D1 · 30/38 px oder 32/40 px | noch nicht entschieden |
| ✓ | Offener Punkt D4 · Dunkelmodus | **gegenstandslos** durch die 600er Stärke |

### Fassung 2 — Rückmeldung

> _Wird nach Ihrer Rückmeldung hier eingetragen._

**Status:** offen
