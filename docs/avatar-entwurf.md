# Avatar — Entwurf zur Freigabe

**Fassung 6 · Stand:** 28.08.2026 · **Status:** **freigegeben** am 28.08.2026 · **Vorschau:** [`avatar-entwurf.html`](./avatar-entwurf.html) im Browser öffnen

---

## Was entschieden ist

Aus fünf Rückmeldungen des Inhabers am 28.08.2026. Alles hier ist **festgelegt** und Grundlage der späteren Umsetzung:

| | Entscheidung | Ausgeführt in |
|---|---|---|
| Layout | freigegeben | — |
| Bild-Variante | **angenommen**, mit Rückfall auf Buchstaben | [Ergänzung 1](#erganzung-1-bild-statt-initialen) |
| Buchstaben | aus Vor-/Nachname, aus Binnengroßschreibung, sonst erste zwei Zeichen | [A4](#a4--füllung-zwei-buchstaben) |
| Farbe | **15 Brand-Farben**, überall **weiße** Schrift, keine zwei gleich wirkend | [Teil F](#teil-f--farbe-fassung-4) |
| Warme Farben | **Orange 900 · Amber 800 · Gelb 900** | [F3](#f3--warum-nicht-alle-drei-eine-stufe-hoch) |
| Indigo/Violett | **Violett auf 800** | [F4](#f4--indigo-und-violett--getrennt) |
| Grau/Stein | **Stein auf 900** — abgenommen | [F5](#f5--grau-und-stein--getrennt) |
| Profil-Größe | **64 px** (96 px verworfen) | [A3b](#a3b--größe-lg--64-px-für-das-profilbild--angeordnet) |
| Contained-list | **umstellen, einfarbig** | [F7](#f7--was-das-für-die-contained-list-bedeutet) |
| Kleine Größen | **30/38 px halten** (nicht auf 32/40 ziehen) | [D1](#d1--es-gibt-keine-token-für-komponentengrößen-30-px--38-px) |
| Dunkelmodus | **gegenstandslos** — die kräftigen Flächen tragen sich selbst | [F6](#f6--der-dunkelmodus-löst-sich-von-selbst) |
| Personen-Symbol | **angenommen** für den Fall ohne Bild und ohne Namen | [Ergänzung 2](#ergänzung-2--personen-symbol-wenn-kein-name-da-ist--angenommen) |
| Herkunft der Farbe | **gespeicherter Wert der Person** — bei der Registrierung vergeben, von ihr änderbar | [Ergänzung 3](#ergänzung-3--woher-die-farbe-einer-person-kommt--entschieden) |

## Die Palette ist fertig

Die letzte Rückfrage lautete: *„Orange, Amber und Gelb evtl. noch eine Stufe hoch?"* — **Ja, aber nicht alle drei.**

Ich habe alle 27 Kombinationen der drei Familien über die Stufen 700, 800 und 900 durchgerechnet. **Genau eine erfüllt alle drei Bedingungen** (weiße Schrift lesbar · kein Paar zu ähnlich · alle im Helligkeitsband der übrigen zwölf):

> **Orange 900 · Amber 800 · Gelb 900**

Amber muss auf 800 bleiben: Auf 900 rückt es so nah an Gelb, dass die beiden wieder gleich wirken — genau das Problem, das bei Grau und Stein beseitigt wurde, wäre an anderer Stelle neu entstanden. Die Begründung mit Zahlen steht in [F3](#f3--warum-nicht-alle-drei-eine-stufe-hoch).

**Die fertige Reihe in drei Zahlen:** schwächster Kontrast gegen Weiß **5,84** (gefordert 4,5) · engstes Farbpaar **16,2** (Schwelle 15) · alle fünfzehn im Helligkeitsband 19 bis 43.

> **Eine Korrektur zu Fassung 3:** Dort stand, Orange, Amber und Gelb seien „sichtbar dunkler als ihre Nachbarn". Das war falsch herum — sie waren die **hellsten** drei der Reihe und stachen als zu helle Flecken heraus. Ihre Rückfrage war damit genau richtig. Einzelheiten in [F2](#f2--eine-korrektur-zu-fassung-3).

## Nichts mehr offen

Der letzte Punkt ist mit der Rückmeldung vom 28.08.2026 geklärt — und zwar anders, als ich ihn gestellt hatte. Ich hatte gefragt, ob die Farbe **nach dem Listenplatz** oder **aus dem Namen berechnet** vergeben wird. Richtig ist keines von beiden:

> **Die Farbe wird bei der Registrierung vergeben und ist von der Person änderbar.** Sie ist ein gespeicherter Wert, keine Rechenregel.

Das schließt beide von mir vorgeschlagenen Wege aus: Eine berechnete Farbe ließe sich nicht ändern, und eine Farbe nach Listenplatz gehörte zur Zeile statt zur Person. Ausgeführt in [Ergänzung 3](#ergänzung-3--woher-die-farbe-einer-person-kommt--entschieden).

Zwei Punkte, die dabei ausdrücklich festgehalten sind: **Zwei Personen dürfen dieselbe Farbe haben**, und **es wird nicht nach Farbe sortiert** — die Farbe trägt keine Bedeutung.

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

> **Überholt durch Anordnung 2.** Was hier steht, beschreibt weiterhin richtig, wie das System heute aussieht — die Farbe des Entwurfs steht jetzt in [Teil F](#teil-f--farbe-fassung-4).

Die Contained-list gibt allen Avataren dieselbe Farbe — helles Teal mit dunklem Teal als Schrift.

> `Contained-list.dc.html:343` — `checkFill, avatarBg: primary[100], avatarText: primary[800],`

**Tokens:** Fläche `--medo-primary-100`, Schrift `--medo-primary-800`. Beide vorhanden, exakte Entsprechung.

### A6 · Farbe, Fall 2: vier durchlaufende Farben

> **Überholt durch Anordnung 2.** Der *Gedanke* — mehrere Farben reihum, damit sich Personen unterscheiden — bleibt und wird in [Teil F](#teil-f--farbe-fassung-4) auf fünfzehn Farben erweitert. Die *Werte* hier gelten nicht mehr.

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

### Ergänzung 2 · Personen-Symbol, wenn kein Name da ist — **angenommen**

> **Entschieden am 28.08.2026: angenommen.** Der Avatar zeigt ein Personen-Symbol, wenn weder ein Bild noch ein Name vorliegt.

**Kein direkter Beleg** — für die *Verwendung*. Für die *Darstellung* gibt es einen: Die Contained-list zeigt im Leerzustand ein Symbol in einem getönten Kreis.

> `Contained-list.dc.html:165` — `<div style="width:52px;height:52px;border-radius:9999px;background:{{ iconBg }};color:{{ muted }};…"><span class="msr" style="font-size:26px">inbox</span></div>`

**Begründung:** Es gibt Fälle ohne Namen — ein gelöschtes Konto, eine noch nicht angenommene Einladung, ein Systemvorgang ohne Person dahinter. Zwei Buchstaben lassen sich daraus nicht bilden. Ohne diesen Fall bleibt der Kreis leer.

**Vorschlag:** Material-Symbol `person`, in getönter Fläche — Fläche `--medo-surface-sunken`, Symbol `--medo-icon-muted`, analog zur zitierten Fundstelle.

### Ergänzung 3 · Woher die Farbe einer Person kommt — **entschieden**

**Festgelegt am 28.08.2026 vom Inhaber:**

> Die Farbe des Avatars wird **vom System bei der Registrierung vergeben**. Die Person kann ihr Farbschema **später selbst ändern**.

Damit ist die Frage anders beantwortet, als ich sie gestellt hatte. Ich hatte zwei Möglichkeiten zur Wahl gestellt — Farbe nach Listenplatz oder Farbe aus dem Namen berechnet. **Beide sind hinfällig:**

- **Farbe nach Listenplatz ist keine Option.** Sie würde sich beim Umsortieren ändern, obwohl die Farbe zur Person gehört.
- **Farbe aus dem Namen berechnet ist es ebenso wenig.** Eine berechnete Farbe ließe sich nicht ändern — und genau das soll die Person können. Sie würde außerdem wechseln, wenn jemand heiratet und den Namen ändert.

**Die Farbe ist ein gespeicherter Wert der Person, keine Rechenregel.** Der Avatar bekommt sie mitgeteilt und stellt sie dar; er ermittelt sie nicht.

**Was daraus folgt:**

- Die Person hat überall dieselbe Farbe — in jeder Tabelle, in jeder Liste, auf jeder Profilseite, in jeder Sortierung und in jedem Filter.
- **Zwei Personen dürfen dieselbe Farbe haben.** Das Farbschema ist eine persönliche Einstellung, kein eindeutiges Erkennungszeichen; bei fünfzehn Farben und freier Wahl ließe sich Eindeutigkeit ohnehin nicht erzwingen. Das ist ausdrücklich kein Fehler und darf später nicht „repariert" werden.
- **Die Farbe trägt keine Bedeutung.** Sie sagt nichts über Rolle, Status oder Rang und ist kein Ordnungsmerkmal — **es wird nicht nach Farbe sortiert.**
- Alle fünfzehn Farben müssen als **Auswahl** taugen, nicht nur als Zuteilung. Das ist der Grund, warum die Palette in [Teil F](#teil-f--farbe-fassung-4) durchgehend lesbar und in sich unterscheidbar ist: Die Person wählt selbst, und keine Wahl darf schlecht aussehen.

**In der Vorschau ausprobierbar:** Abschnitt 7 zeigt einen Farbwähler. Beim Klick wechselt dieselbe Person in Tabelle, Liste und Profilseite gleichzeitig die Farbe — die zweite Person daneben bleibt unberührt.

**Offen für die Umsetzung, nicht für diesen Entwurf:** Wo die Farbe herkommt, wenn ausnahmsweise keine gespeichert ist — etwa bei Daten aus der Zeit vor dieser Regel. Das ist eine Frage an die Anwendung, die den Avatar einsetzt, nicht an die Komponente.

---

## Teil F — Farbe (Fassung 4)

**Angeordnet:** Der Hintergrund der Buchstaben-Variante nutzt **alle Brand-Farben**, und zwar so, dass **überall weiße Schrift steht** und **keine zwei Farben gleich wirken**.

Das ist eine deutliche Abkehr von dem, was heute im System steht: Dort sind die Kreise **hell** getönt (Stufen 50 bis 200) und tragen **dunkle** Buchstaben. Jetzt ist es umgekehrt — kräftige Fläche, weiße Buchstaben. Der Avatar wird damit zu einem farbigen Punkt in der Zeile statt zu einer zurückhaltenden Tönung.

### F1 · Die fertige Palette

**Wichtig zum Vorgehen:** Wo die 600er Stufe nicht genügte, ist **kein neuer Farbwert erfunden** worden, sondern eine **andere, bereits vorhandene Stufe derselben Farbfamilie** genommen. Jeder Wert unten ist ein Token, das es im System schon gibt.

| | Familie | Stufe | Weiß-Kontrast | Helligkeit | |
|---|---|---|---|---|---|
| 1 | Rot | `--medo-color-red-600` | 7,55 | 36 | |
| 2 | Karmin | `--medo-color-crimson-600` | 7,31 | 37 | |
| 3 | Rosé | `--medo-color-rose-600` | 7,40 | 36 | |
| 4 | Orange | `--medo-color-orange-`**`900`** | 9,82 | 29 | **angehoben** |
| 5 | Amber | `--medo-color-amber-`**`800`** | 6,14 | 41 | **angehoben** |
| 6 | Gelb | `--medo-color-yellow-`**`900`** | 7,59 | 36 | **angehoben** |
| 7 | Grün | `--medo-color-green-600` | 6,06 | 42 | |
| 8 | Teal | `--medo-color-teal-600` | 5,84 | 43 | |
| 9 | Cyan | `--medo-color-cyan-600` | 5,94 | 42 | |
| 10 | Blau | `--medo-color-blue-600` | 6,62 | 39 | |
| 11 | Indigo | `--medo-color-indigo-600` | 7,29 | 37 | |
| 12 | Violett | `--medo-color-violet-`**`800`** | 12,30 | 22 | **angehoben** |
| 13 | Purpur | `--medo-color-purple-600` | 7,67 | 35 | |
| 14 | Grau | `--medo-color-grey-600` | 6,81 | 39 | |
| 15 | Stein | `--medo-color-stone-`**`900`** | 13,67 | 19 | **angehoben** |

Die Schrift ist durchgehend `--medo-color-white`.

**Die drei Kennzahlen der fertigen Reihe:**

- **Schwächster Kontrast gegen die weiße Schrift: 5,84** (Teal), gefordert sind 4,5 nach WCAG 2.2. Keine warme Farbe ist mehr der Engpass.
- **Engstes Farbpaar: 16,2** (Karmin/Rosé), Schwelle 15. Das ist die natürliche Grenze der Palette selbst, kein Nebeneffekt der Anhebungen.
- **Helligkeitsband: 19 bis 43.** Alle fünfzehn liegen darin; keine sticht heraus.

### F2 · Eine Korrektur zu Fassung 3

In Fassung 3 stand hier, Orange, Amber und Gelb seien „sichtbar dunkler als ihre Nachbarn in der Reihe". **Das war falsch, und zwar in die verkehrte Richtung.** Gemessen an der Helligkeit waren sie die **hellsten** drei der Reihe — Orange lag bei 47 und Gelb bei 46, während die übrigen zwölf zwischen 19 und 43 lagen. Sie stachen als zu helle Flecken heraus, nicht als zu dunkle.

Die Rückfrage, ob sie „evtl. noch eine Stufe hoch" sollen, war damit genau richtig. Sie ist der Grund für Fassung 4.

### F3 · Warum nicht alle drei eine Stufe hoch

Ich habe alle **27 Kombinationen** der drei warmen Familien über die Stufen 700, 800 und 900 durchgerechnet und gegen drei Bedingungen geprüft: weiße Schrift überall lesbar, kein Paar unter der Ähnlichkeitsschwelle, alle im Helligkeitsband der übrigen zwölf.

**Genau eine Kombination erfüllt alle drei: Orange 900 · Amber 800 · Gelb 900.**

Alle drei gleichmäßig anzuheben hätte nicht funktioniert:

- **Amber auf 900** rückt so nah an Gelb 900 heran, dass die beiden wieder gleich wirken — Abstand 13,8, unter der Schwelle von 15. Genau das Problem, das Sie bei Grau und Stein beseitigt haben wollten, wäre an anderer Stelle neu entstanden.
- **Amber bleibt deshalb auf 800.** Es ist mit Helligkeit 41 die hellste der drei, liegt aber innerhalb des Bandes der übrigen Farben.

Orange springt von 700 auf 900 damit **zwei** Stufen. Das wirkt unsystematisch, ist aber das Ergebnis der Messung: Auf 800 läge Orange bei Helligkeit 38 und wäre von Rot (36) nur noch 16,3 entfernt — noch zulässig, aber enger als nötig.

### F4 · Indigo und Violett — getrennt

**Entschieden: Violett geht auf Stufe 800.** Der Abstand zwischen Indigo und Violett steigt damit von 14,5 auf **23,0**.

Violett ist mit Helligkeit 22 danach eine der dunkleren Farben der Reihe — vergleichbar mit Stein (19). Die beiden sind farblich weit auseinander und deshalb trotzdem klar zu unterscheiden.

### F5 · Grau und Stein — getrennt

**Abgenommen.** Grau bleibt auf 600, Stein steht auf 900. Der Abstand steigt von 8,0 auf **20,7**.

Ich hatte für diese Entscheidung alle zwölf Kombinationen der beiden Familien durchgerechnet; diese trennt am deutlichsten.

### F6 · Der Dunkelmodus löst sich von selbst

In Fassung 1 war der Dunkelmodus ein offener Punkt (D4): Die hellen Tönungen brauchten je eine dunkle Entsprechung, und für drei von vier Farbpaaren fehlte sie.

**Das entfällt.** Eine kräftige Fläche bringt ihren eigenen Hintergrund mit und hängt nicht davon ab, worauf sie liegt. Der Kreis sieht im Dunkelmodus genauso aus wie im Hellmodus, und die gemessenen Kontraste gelten unverändert.

<a id="f7--was-das-für-die-contained-list-bedeutet"></a>
### F7 · Was das für die Contained-list bedeutet — **entschieden**

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

## Prüf-Checkliste für die Abnahme

Bitte **[`docs/avatar-entwurf.html`](./avatar-entwurf.html)** im Browser öffnen (Doppelklick genügt, kein Entwicklungsserver nötig) und die folgenden acht Punkte durchgehen. Alles davon ist sichtbar oder anklickbar.

| | Abschnitt | Was zu sehen ist |
|---|---|---|
| 1 | 1 · Farben | Fünfzehn Kreise, alle mit weißer Schrift |
| 2 | 1b · Enge Paare | Grau/Stein und Indigo/Violett, je „vorher" und „jetzt" |
| 3 | 2 · Tabelle | Wechselnde Farben in Zeilen, dazu der Ladezustand |
| 4 | 3 · Größen | 30 · 38 · 64 px, je mit Buchstaben und mit Bild |
| 5 | 4 · Buchstaben | Sieben Beispiele, darunter Ihre drei Vorgaben |
| 6 | 5 · Füllungen | Bild · Buchstaben · Personen-Symbol, und der Rückfall live |
| 7 | 6 · Contained-list | Heute gegen danach, einfarbig |
| 8 | 7 · Farbwähler | Eine Farbe anklicken — die Person wechselt in allen drei Größen zugleich, die zweite Person bleibt unberührt |

**Zusätzlich einmal in beiden Darstellungen:** Umschalter oben rechts auf **Dunkel** stellen und die Punkte 1 und 8 wiederholen.

**Auf dem Handy oder bei schmalem Fenster:** Die Seite ist auf schmale Breiten ausgelegt; die Spalten stellen sich untereinander. Bitte einmal das Fenster schmal ziehen.

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
| ✓ | Farben mit dunkler Schrift | **anpassen, bis die Schrift weiß ist** |
| ✓ | Farben, die gleich wirken | **anpassen, bis sie sich unterscheiden** |
| ✓ | Profil-Größe | **64 px** · 96 px verworfen |
| ✓ | Buchstaben-Regel | **festgelegt** an `Andreas Müller` → AM · `PeterZeider` → PZ · `renatosanches` → RE |
| ✓ | Contained-list | **umstellen, einfarbig** · die beiden anderen Wege verworfen |
| ✓ | Kleine Größen 30/38 px | **halten** · 32/40 px verworfen |

### Rückmeldung 3 vom 28.08.2026

| | Punkt | Entscheidung |
|---|---|---|
| ✓ | Orange, Amber, Gelb eine Stufe höher? | **Orange 900 · Gelb 900 · Amber bleibt 800** — Amber auf 900 hätte Gelb zu nahe gelegen |
| ✓ | Grau und Stein | **abgenommen** — Stein bleibt auf 900 |
| ✓ | Indigo und Violett | **Violett auf 800** |

### Rückmeldung 4 vom 28.08.2026

| | Punkt | Entscheidung |
|---|---|---|
| ✓ | Personen-Symbol ohne Namen | **angenommen** |
| — | Farbe nach Name statt nach Listenplatz | zurückgestellt — zu abstrakt erklärt |

### Rückmeldung 5 vom 28.08.2026

| | Punkt | Entscheidung |
|---|---|---|
| ✓ | Herkunft der Farbe | **Gespeicherter Wert der Person.** Bei der Registrierung vergeben, von der Person änderbar |
| ✓ | Farbe nach Listenplatz | **verworfen** — die Farbe gehört zur Person, nicht zur Zeile |
| ✓ | Farbe aus dem Namen berechnet | **verworfen** — eine berechnete Farbe ließe sich nicht ändern |
| ✓ | Farbe als Sortiermerkmal | **ausgeschlossen** — die Farbe trägt keine Bedeutung |

### Abnahme

**Der Inhaber hat den Entwurf am 28.08.2026 freigegeben** („Passt"), nach Durchsicht der Vorschau.

---

**Dieser Entwurf ist damit abgeschlossen und verbindlich.** Er ist die Entscheidungsgrundlage für die Umsetzung des Avatars; die Umsetzung selbst ist Gegenstand einer eigenen Aufgabe und hier nicht enthalten. Maßgeblich für sie ist ausschließlich, was in den Rückmeldungen 1 bis 5 oben protokolliert ist.
