# Avatar — Entwurf zur Freigabe

**Fassung 3 · Stand:** 28.08.2026 · **Status:** wartet auf Freigabe · **Vorschau:** [`avatar-entwurf.html`](./avatar-entwurf.html) im Browser öffnen

---

## Was entschieden ist

Aus zwei Rückmeldungen des Inhabers am 28.08.2026. Alles hier ist **festgelegt** und Grundlage der späteren Umsetzung:

| | Entscheidung | Ausgeführt in |
|---|---|---|
| Layout | freigegeben | — |
| Bild-Variante | **angenommen**, mit Rückfall auf Buchstaben | [Ergänzung 1](#erganzung-1-bild-statt-initialen) |
| Buchstaben | aus Vor-/Nachname, aus Binnengroßschreibung, sonst erste zwei Zeichen | [A4](#a4--füllung-zwei-buchstaben) |
| Farbe | **alle Brand-Farben**, überall **weiße** Schrift, keine zwei gleich wirkend | [Teil F](#teil-f--farbe-fassung-3) |
| Profil-Größe | **64 px** (96 px verworfen) | [A3b](#a3b--größe-lg--64-px-für-das-profilbild--angeordnet) |
| Contained-list | **umstellen, einfarbig** | [F6](#f6--was-das-für-die-contained-list-bedeutet) |
| Kleine Größen | **30/38 px halten** (nicht auf 32/40 ziehen) | [D1](#d1--es-gibt-keine-token-für-komponentengrößen-30-px--38-px) |
| Dunkelmodus | **gegenstandslos** — die kräftigen Flächen tragen sich selbst | [F5](#f5--der-dunkelmodus-löst-sich-von-selbst) |

## Was Fassung 3 daraus gemacht hat

Die Anweisung lautete: *„Bei den Farben, in der eine dunkle Schrift ist oder sie gleich wirken, die Farben so anpassen, dass die Schrift weiß wird bzw. die sich unterscheiden."*

**Umgesetzt, ohne einen einzigen Farbwert zu erfinden.** Wo die 600er Stufe nicht genügte, steht jetzt eine **andere bereits vorhandene Stufe derselben Farbfamilie**:

| Familie | vorher | jetzt | warum |
|---|---|---|---|
| Orange | 600 | **700** | Weiß erreichte auf 600 nur 3,68 statt 4,5 |
| Amber | 600 | **800** | 3,21 auf 600 · auf 700 immer noch nur 4,29 |
| Gelb | 600 | **800** | 2,76 auf 600 · auf 700 immer noch nur 3,59 |
| Stein | 600 | **900** | war von Grau nicht zu unterscheiden (Farbabstand 8,0 → jetzt 20,7) |

Die übrigen elf Familien bleiben auf 600. **Alle fünfzehn tragen jetzt weiße Schrift**, der schwächste Kontrast der Reihe ist 5,03.

**Zwei Punkte sind noch offen** — beide klein, beide in der Vorschau zu sehen:

- Ob die vier angehobenen Farben **neben ihren Nachbarn stimmig wirken** (sie sind sichtbar dunkler).
- Ein Randbefund, den ich beim Nachrechnen fand: **Indigo und Violett** liegen bei 14,5 knapp unter derselben Schwelle. Ich habe sie nicht angefasst, sondern lege sie Ihnen vor — siehe [F4](#f4--ein-randbefund-indigo-und-violett).

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
| **Herkunft der Buchstaben** | Vor-/Nachname · Binnengroßschreibung · sonst erste zwei Zeichen | **entschieden** |
| **Hintergrund der Buchstaben** | 15 Brand-Farben, überall weiße Schrift | **entschieden** |
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

**Entschieden am 28.08.2026: 64 px.** Die zur Wahl gestellte Alternative (96 px) ist verworfen und aus der Vorschau entfernt.

**64 px ist eine exakte Stufe des Systems** (`--medo-space-3xl`), und die passende Schriftgröße für die Buchstaben ist es ebenfalls — **25 px** (`--medo-text-xl`). Beide Maße liegen damit auf Tokens; es ist nichts erfunden und nichts ausgerechnet.

Damit hat der Avatar drei Größen: **30 px** (Tabelle) · **38 px** (Liste) · **64 px** (Profil).

### A4 · Füllung: zwei Buchstaben

Beide Fundstellen zeigen genau zwei Großbuchstaben, halbfett.

> `Contained-list.dc.html:218` — `{ id: 'm0', initials: 'AM', title: 'Anna Müller', … }`
> `Data-table.dc.html:283` — `const initials = r.name.split(' ').map(w => w[0]).join('').slice(0, 2);`

Die zweite Fundstelle zeigt zusätzlich, **woher** die Buchstaben kommen: aus dem Namen, erster Buchstabe je Wort, abgeschnitten nach zwei. „Anna Müller" wird zu „AM", „Dr. Marie Hoffmann" zu „DM".

**Angeordnet:** Die Buchstaben kommen aus Vor- und Nachname — **und wenn es keinen Namen gibt, aus dem Benutzernamen.** Der zweite Fall steht in der Referenz nicht; die dortige Regel liefert bei einem Benutzernamen ohne Leerzeichen nur **einen** Buchstaben.

**Die Regel, aus den drei vorgegebenen Fällen abgeleitet.** Der Inhaber hat sie am 28.08.2026 an drei Beispielen festgelegt: `Andreas Müller` → **AM**, `PeterZeider` → **PZ**, `renatosanches` → **RE**. Daraus ergeben sich drei Stufen, die nacheinander greifen:

1. **Trennzeichen suchen** — Leerzeichen, Punkt, Bindestrich, Unterstrich. Bei einer E-Mail-Adresse wird vorher alles ab dem `@` abgeschnitten.
2. **Sonst: Großbuchstaben im Wortinneren suchen.** Sie trennen genauso. Das ist der Fall `PeterZeider`.
3. **Sonst: die ersten zwei Buchstaben nehmen.** Das ist der Fall `renatosanches`.

Bei zwei oder mehr Teilen zählt der erste Buchstabe der ersten beiden Teile. Das Ergebnis wird immer groß dargestellt.

| Eingabe | Ergebnis | welche Stufe greift |
|---|---|---|
| `Andreas Müller` | **AM** | 1 — Leerzeichen trennt · **vorgegeben** |
| `PeterZeider` | **PZ** | 2 — der Großbuchstabe im Wortinneren trennt · **vorgegeben** |
| `renatosanches` | **RE** | 3 — kein Trennzeichen, keine Großbuchstaben → erste zwei · **vorgegeben** |
| `Dr. Marie Hoffmann` | **DM** | 1 — nach zwei Teilen ist Schluss |
| `anna.mueller` | **AM** | 1 — der Punkt trennt |
| `anna@medo.de` | **AN** | 1 — `@` abschneiden → `anna` → Stufe 3 greift |
| `Müller` | **MÜ** | 3 — ein Wort ohne innere Großbuchstaben |

> **Korrektur zu Fassung 2:** Dort stand in dieser Tabelle für `anna@medo.de` das Ergebnis „AM". Das war falsch — nach dem Abschneiden bleibt `anna` übrig, daraus werden die ersten zwei Buchstaben, also **AN**. Die Regel selbst hat sich nicht geändert, nur mein Beispiel war verrechnet.

Vorgeben lassen sich die Buchstaben weiterhin auch direkt, so wie es die Contained-list heute tut.

**Schriftgewicht:** halbfett, Token `--medo-weight-semibold` (= 600). Passt exakt.

### A5 · Farbe, Fall 1: eine feste Farbe

> **Überholt durch Anordnung 2.** Was hier steht, beschreibt weiterhin richtig, wie das System heute aussieht — die Farbe des Entwurfs steht jetzt in [Teil F](#teil-f--farbe-fassung-3).

Die Contained-list gibt allen Avataren dieselbe Farbe — helles Teal mit dunklem Teal als Schrift.

> `Contained-list.dc.html:343` — `checkFill, avatarBg: primary[100], avatarText: primary[800],`

**Tokens:** Fläche `--medo-primary-100`, Schrift `--medo-primary-800`. Beide vorhanden, exakte Entsprechung.

### A6 · Farbe, Fall 2: vier durchlaufende Farben

> **Überholt durch Anordnung 2.** Der *Gedanke* — mehrere Farben reihum, damit sich Personen unterscheiden — bleibt und wird in [Teil F](#teil-f--farbe-fassung-3) auf fünfzehn Farben erweitert. Die *Werte* hier gelten nicht mehr.

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

## Teil F — Farbe (Fassung 3)

**Angeordnet:** Der Hintergrund der Buchstaben-Variante nutzt **alle Brand-Farben**, und zwar so, dass **überall weiße Schrift steht** und **keine zwei Farben gleich wirken**.

Das ist eine deutliche Abkehr von dem, was heute im System steht: Dort sind die Kreise **hell** getönt (Stufen 50 bis 200) und tragen **dunkle** Buchstaben. Jetzt ist es umgekehrt — kräftige Fläche, weiße Buchstaben. Der Avatar wird damit zu einem farbigen Punkt in der Zeile statt zu einer zurückhaltenden Tönung.

### F1 · Die Palette — fünfzehn Farben, alle mit weißer Schrift

**Wichtig zum Vorgehen:** Wo die 600er Stufe nicht genügte, habe ich **keinen neuen Farbwert erfunden**, sondern eine **andere, bereits vorhandene Stufe derselben Farbfamilie** genommen. Jeder Wert unten ist ein Token, das es im System schon gibt.

| | Familie | Stufe | Kontrast gegen Weiß | |
|---|---|---|---|---|
| 1 | Rot | `--medo-color-red-600` | 7,55 | |
| 2 | Karmin | `--medo-color-crimson-600` | 7,31 | |
| 3 | Rosé | `--medo-color-rose-600` | 7,40 | |
| 4 | Orange | `--medo-color-orange-`**`700`** | 5,03 | **angehoben** (600 lag bei 3,68) |
| 5 | Amber | `--medo-color-amber-`**`800`** | 6,14 | **angehoben** (600 lag bei 3,21) |
| 6 | Gelb | `--medo-color-yellow-`**`800`** | 5,18 | **angehoben** (600 lag bei 2,76) |
| 7 | Grün | `--medo-color-green-600` | 6,06 | |
| 8 | Teal | `--medo-color-teal-600` | 5,84 | |
| 9 | Cyan | `--medo-color-cyan-600` | 5,94 | |
| 10 | Blau | `--medo-color-blue-600` | 6,62 | |
| 11 | Indigo | `--medo-color-indigo-600` | 7,29 | |
| 12 | Violett | `--medo-color-violet-600` | 7,54 | |
| 13 | Purpur | `--medo-color-purple-600` | 7,67 | |
| 14 | Grau | `--medo-color-grey-600` | 6,81 | |
| 15 | Stein | `--medo-color-stone-`**`900`** | 13,67 | **angehoben**, damit es sich von Grau löst |

Die Schrift ist durchgehend `--medo-color-white`. **Keine Ausnahme, kein Sonderfall, keine dunkle Schrift mehr.** Der schwächste Kontrast der Reihe ist Orange mit 5,03 — deutlich über den geforderten 4,5.

### F2 · Warum drei Farben angehoben wurden

Auf der 600er Stufe waren Orange, Amber und Gelb zu hell, um weiße Buchstaben zu tragen: 3,68 · 3,21 · 2,76 gegen die geforderten 4,5 nach WCAG 2.2.

Sie mussten unterschiedlich weit angehoben werden, weil die Familien unterschiedlich hell verlaufen:

- **Orange** genügt schon auf Stufe **700** (5,03).
- **Amber** genügt auf 700 noch nicht (4,29) — erst auf **800** (6,14).
- **Gelb** genügt auf 700 noch nicht (3,59) — erst auf **800** (5,18).

Die drei sind damit sichtbar dunkler als ihre Nachbarn in der Reihe. **Das ist der Preis dafür, dass die Schrift überall weiß ist**, und in der Vorschau können Sie beurteilen, ob die Reihe damit noch stimmig wirkt.

### F3 · Warum Stein angehoben wurde

Grau und Stein lagen auf 600er Stufe so nah beieinander, dass sie in einer Reihe wie dieselbe Farbe wirkten. Gemessen als Farbabstand: **8,0** — alles unter 15 ist mit bloßem Auge kaum zu trennen.

Ich habe alle zwölf Kombinationen der beiden Familien durchgerechnet. **Grau auf 600 und Stein auf 900** trennen am deutlichsten: Farbabstand **20,7**. Aus zwei fast gleichen Grautönen wird ein mittleres, kühles Grau neben einem sehr dunklen, warmen Braunschwarz.

> **Bitte in der Vorschau ansehen.** Die beiden stehen dort nebeneinander. Überzeugt Sie die Trennung nicht, wäre die Alternative, eine der beiden Familien ganz aus der Reihenfolge zu nehmen.

### F4 · Ein Randbefund: Indigo und Violett

Beim Nachrechnen ist mir ein zweites Paar aufgefallen, das ich vorher nicht gemeldet hatte: **Indigo und Violett** liegen bei einem Farbabstand von **14,5** — knapp unter der Schwelle von 15.

Ich habe sie **nicht** angepasst, weil Ihre Anweisung die Farben betraf, die gleich *wirken*, und die beiden noch klar als Blau und als Lila lesbar sind. **In der Vorschau stehen sie direkt nebeneinander**, damit Sie selbst urteilen können. Soll auch dieses Paar getrennt werden, ginge Violett auf Stufe 800 — Farbabstand dann 23,0.

Dasselbe gilt in abgeschwächter Form für **Orange/Amber** (15,4) und **Amber/Gelb** (15,3): knapp über der Schwelle, in der Vorschau nebeneinander zu sehen.

### F5 · Der Dunkelmodus löst sich von selbst

In Fassung 1 war der Dunkelmodus ein offener Punkt (D4): Die hellen Tönungen brauchten je eine dunkle Entsprechung, und für drei von vier Farbpaaren fehlte sie.

**Das entfällt.** Eine kräftige Fläche bringt ihren eigenen Hintergrund mit und hängt nicht davon ab, worauf sie liegt. Der Kreis sieht im Dunkelmodus genauso aus wie im Hellmodus, und die gemessenen Kontraste gelten unverändert.

> **Bitte prüfen Sie das trotzdem in der Vorschau** — der Umschalter oben rechts.

### F3 · Der Dunkelmodus löst sich damit von selbst

In Fassung 1 war der Dunkelmodus ein offener Punkt (D4): Die hellen Tönungen brauchten je eine dunkle Entsprechung, und für drei von vier fehlte sie.

**Das entfällt.** Eine 600er Fläche bringt ihren eigenen Hintergrund mit und hängt nicht davon ab, worauf sie liegt. Der Kreis sieht im Dunkelmodus genauso aus wie im Hellmodus, und die gemessenen Kontraste gelten unverändert.

> **Bitte prüfen Sie das trotzdem in der Vorschau** — der Umschalter oben rechts. Die Farben sollen im Dunkeln kräftig wirken, nicht grell.

<a id="f6--was-das-für-die-contained-list-bedeutet"></a>
### F6 · Was das für die Contained-list bedeutet — **entschieden**

Die Contained-list hat den Kreis heute fest eingebaut, in der hellen Tönung: helles Teal mit dunklem Teal als Schrift. **Dieser Code ist bereits an andere Projekte ausgeliefert.**

Stellt man die Contained-list später auf die neue Komponente um, **ändert sich dort das Aussehen sichtbar** — aus dem zurückhaltenden hellen Kreis wird ein kräftiger farbiger. Das bricht nichts und erzeugt keine Fehlermeldung, aber wer die Liste heute im Einsatz hat, sieht sie danach anders.

**Entschieden am 28.08.2026: umstellen, und die Liste bleibt einfarbig.**

Alle Kreise einer Liste tragen damit dieselbe Farbe (Teal) mit weißer Schrift; die wechselnden Farben bleiben der Tabelle vorbehalten. Es gibt künftig **einen** Avatar im System statt zwei, und die Liste wirkt weiterhin ruhiger als eine Tabelle.

Die beiden verworfenen Wege, der Vollständigkeit halber: gar nicht umstellen (hätte zwei verschieden aussehende Avatare hinterlassen) oder umstellen mit wechselnden Farben (hätte die Liste so bunt gemacht wie die Tabelle).

> **Folge, die bei der Umsetzung anfällt:** Die Umstellung berührt ausgelieferten Code (`src/components/ContainedList/`). Sie ist Gegenstand einer eigenen Aufgabe, nicht dieses Entwurfs.

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

**Entschieden am 28.08.2026: die Zahlen bleiben bei 30 und 38 px.** Die Alternative — auf 32/40 px ziehen — ist verworfen und aus der Vorschau entfernt.

Der Avatar sieht damit überall exakt so aus wie heute, und an bereits ausgeliefertem Code muss nichts angefasst werden. Die Zwischenwert-Regel für neu geschriebenes CSS tritt hier zurück; das ist die bewusste Entscheidung des Inhabers und bei der Umsetzung so zu übernehmen.

**Die dritte Größe ist davon nicht betroffen:** 64 px liegt exakt auf `--medo-space-3xl`.

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

Bitte öffnen Sie **[`docs/avatar-entwurf.html`](./avatar-entwurf.html)** im Browser (Doppelklick genügt, kein Entwicklungsserver nötig).

**Nur noch vier Punkte sind offen.** Alles andere ist entschieden und oben festgehalten.

1. **Die fünfzehn Farben** (Abschnitt 1 der Vorschau). Alle tragen jetzt weiße Schrift. Orange, Amber, Gelb und Stein stehen dafür auf einer dunkleren Stufe und sind sichtbar dunkler als ihre Nachbarn. **Wirkt die Reihe so stimmig?** Bitte auch im **Dunkelmodus** ansehen — Umschalter oben rechts.
2. **Grau und Stein** stehen in der Vorschau nebeneinander, jetzt mit dem größtmöglichen Abstand zwischen den beiden Familien. **Sind sie für Sie ausreichend getrennt?**
3. **Indigo und Violett** stehen ebenfalls nebeneinander — der Randbefund aus [F4](#f4--ein-randbefund-indigo-und-violett). Sie liegen bei 14,5 knapp unter der Schwelle. **Soll ich sie ebenfalls trennen?** Violett ginge auf Stufe 800.
4. **Zwei Kleinigkeiten aus Fassung 1, die noch keine Antwort haben:**
   - **Personen-Symbol**, wenn es gar keinen Namen gibt (gelöschtes Konto, offene Einladung) — Abschnitt 4 der Vorschau. Es ist das letzte Glied des Rückfalls, den Sie angenommen haben.
   - **Farbe aus dem Namen statt aus der Zeilennummer** — sonst springt die Farbe einer Person, sobald jemand die Tabelle umsortiert. Mit fünfzehn Farben fällt das mehr auf als mit vier.

---

## Freigabe

### Rückmeldung 1 vom 28.08.2026

| | Punkt | Entscheidung |
|---|---|---|
| ✓ | Layout und Aufbau | **angenommen** — „Layout passt" |
| ✓ | Bild-Variante mit Rückfall | **angenommen** |
| ✓ | Buchstaben aus Name beziehungsweise Benutzername | **angeordnet** |
| ✓ | Hintergrund: Brand-Farben auf 600er Stärke | **angeordnet** |
| ✓ | Große Version für ein Profilbild | **angeordnet** |
| ✓ | Dunkelmodus (D4 aus Fassung 1) | **gegenstandslos** geworden |

### Rückmeldung 2 vom 28.08.2026

| | Punkt | Entscheidung |
|---|---|---|
| ✓ | Farben mit dunkler Schrift | **anpassen, bis die Schrift weiß ist** → Orange 700, Amber 800, Gelb 800 |
| ✓ | Farben, die gleich wirken | **anpassen, bis sie sich unterscheiden** → Stein 900 |
| ✓ | Profil-Größe | **64 px** · 96 px verworfen |
| ✓ | Buchstaben-Regel | **festgelegt** an `Andreas Müller` → AM · `PeterZeider` → PZ · `renatosanches` → RE |
| ✓ | Contained-list | **umstellen, einfarbig** · die beiden anderen Wege verworfen |
| ✓ | Kleine Größen 30/38 px | **halten** · 32/40 px verworfen |
| — | Personen-Symbol | noch offen |
| — | Farbe aus dem Namen statt Zeilennummer | noch offen |
| — | Indigo/Violett trennen | neu vorgelegt, noch offen |

### Rückmeldung 3

> _Wird nach Ihrer Rückmeldung hier eingetragen._

**Status:** offen
