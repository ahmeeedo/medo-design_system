# Nachtrag zur Übergabe „Farbe und Tokens"

Dieses Dokument schließt eine Lücke im Übergabedokument `uebergabe-farbe-und-tokens.md`. Es ist wie jenes als Arbeitsanweisung geschrieben und für die Anwendung in einem Durchgang gedacht.

---

## 1. Warum es diesen Nachtrag gibt

Die Anwendung des Übergabedokuments war **fehlerfrei** — alle 68 Anweisungen genau umgesetzt, keine Abweichung. Beim Abgleich danach sind aber Stellen aufgefallen, die nach der Anwendung **im Widerspruch zu den Token-Dateien stehen**. Sie stehen dort nicht, weil falsch gearbeitet worden wäre, sondern weil das Übergabedokument sie **nicht erfasst hatte**.

Die Widersprüche sind alle derselben Art: eine Stelle nennt einen Farbwert oder eine Stufe, die die Quelle inzwischen anders führt. Nichts davon ist funktional kaputt — es sind Angaben, die in die Irre führen, wenn jemand sie liest und ihnen glaubt.

**Eine Zahl vorweg, weil sie den Zuschnitt bestimmt:** Der Fokusring ist nicht an drei, sondern an **31 Stellen in 22 Dateien** fest eingetragen. Abschnitt 3 ist deshalb als Regel geschrieben, nicht als Zeilenliste.

**Dieser Nachtrag wird zusammen mit einem der beiden ausstehenden Übergabedokumente angewandt**, nicht für sich allein.

---

## 2. `CLAUDE.md` — drei Stellen

Die Datei ist die höchste Autorität des Projekts. Drei ihrer Angaben stimmen seit der Anwendung nicht mehr.

### 2.1 Der Textlink steht noch auf der alten Stufe

Zeile 33, in `### Key semantic tokens (Ebene 3)`:

| alt | neu |
|---|---|
| `text-link=primary-600` | `text-link=primary-700` |

Nur diese eine Angabe ändert sich; der Rest der Zeile bleibt wörtlich stehen, `text-link-hover=primary-800` eingeschlossen.

**Warum:** Fall C1 hat `--medo-text-link` auf `teal-700` gesetzt. `tokens/semantic-colors.css` führt die 700er-Stufe, `CLAUDE.md` nennt weiterhin die 600er.

**Sichtbar:** nichts. Die Angabe beschreibt nur, was die Token-Datei ohnehin tut.

### 2.2 Die Status-Zeile gilt für die Warnung nicht mehr

Zeile 40, in derselben Aufstellung:

| alt |
|---|
| `- Status sets (success/warning/error/info): -surface=50, -text=1000, -border=300, -solid=600, -solid-hover=700, -solid-active=800, -on-solid: white EXCEPT warning-on-solid=stone-1000 (amber too light for white text)` |

| neu |
|---|
| `- Status sets (success/warning/error/info): -surface=50, -text=1000, -border=300, -solid=600, -solid-hover=700, -solid-active=800, -accent=700, -on-solid: white. EXCEPTIONS for warning: -solid-hover=500 and -solid-active=400 (the fill lightens when operated so its dark label stays readable), -accent=800 (the accent goes darker where the fill goes lighter), -on-solid=stone-1000 (amber too light for white text)` |

**Warum:** Fall B hat die Warnung von der gemeinsamen Regel gelöst — sie wird beim Bedienen heller statt dunkler. Die alte Zeile behauptet für alle vier Statusfarben dasselbe. Außerdem fehlt die neue `-accent`-Rolle ganz.

**Sichtbar:** nichts.

### 2.3 Die neun neuen Token fehlen in der Aufstellung

Die Aufstellung `### Key semantic tokens (Ebene 3)` führt jede Semantic-Rolle. Neun kamen hinzu und stehen dort nicht. Vier davon sind mit §2.2 erledigt (`-accent` je Statusrolle); die übrigen fünf sind zu ergänzen.

**Zeile 34** — die Icon-Zeile bekommt die neue Rolle angehängt:

| alt | neu |
|---|---|
| `…, icon-on-primary=white, icon-disabled=stone-500` | `…, icon-on-primary=white, icon-disabled=stone-500, icon-on-light=stone-600` |

**Nach Zeile 41** (`- divider=stone-200, scrim=rgba(23,21,19,0.5)`) eine neue Zeile einfügen:

```
- accent-neutral=stone-700, control-mark=stone-400, control-mark-on-primary=white @75% (transparent!), logo-dot=primary-600
```

**Warum:** Die Aufstellung ist der Ort, an dem jemand nachschlägt, welche Rollen es gibt. Fehlen dort neun, wird eine davon beim nächsten Entwurf neu erfunden.

**Sichtbar:** nichts.

---

## 3. Der Fokusring steht auf 22 Seiten fest auf 35 %

Fall A hat die Deckkraft auf 75 % angehoben. Die Spezifikationsseiten sind eigenständig lauffähig und lesen die Tokens **nicht** — sie tragen den Wert wörtlich im Quelltext. Er wurde daher nirgends mitgeändert.

**Erhoben, nicht geschätzt:** 31 Vorkommen in 22 Dateien, in zwei Schreibweisen.

### 3.1 Schreibweise B — die Deckkraft am Token-Wert

14 Vorkommen in 14 Dateien. Die Grundfarbe ist hier korrekt (`primary[600]`), nur die Deckkraft ist alt.

**Die Regel:** In diesen Dateien wird die Endung `59` durch `bf` ersetzt, überall dort, wo sie unmittelbar auf `primary[600]` folgt. Sonst nichts.

| alt | neu |
|---|---|
| `` `0 0 0 3px ${primary[600]}59` `` | `` `0 0 0 3px ${primary[600]}bf` `` |
| `focusRing: primary[600] + '59',` | `focusRing: primary[600] + 'bf',` |

Betroffen: `Breadcrumb`, `Button`, `Checkbox`, `Content-switcher`, `Link`, `Number-input`, `Radio-button`, `Search`, `Select`, `Slider`, `Tabs`, `Tag`, `Text-input`, `Toggle` — je einmal, alle unter `components/`.

### 3.2 Schreibweise A — der harte Hexwert

17 Vorkommen in 11 Dateien, als `#0e9d9159`.

Hier ist nicht nur die Deckkraft alt, sondern auch die Grundfarbe falsch. Der Inhaber hat entschieden, **beides in einem Zug zu korrigieren**; die Herleitung steht in §6.

| alt | neu |
|---|---|
| `#0e9d9159` | `#007265bf` |

Ersetzt wird die vollständige Zeichenfolge, nicht nur die Endung — Grundfarbe und Deckkraft ändern sich gemeinsam.

| Datei (unter `components/`) | Vorkommen |
|---|---|
| `Pagination.dc.html` | 4 |
| `Date-picker.dc.html` | 3 |
| `Menu-buttons.dc.html` | 2 |
| `Breadcrumb.dc.html` | 1 |
| `Contained-list.dc.html` | 1 |
| `Content-switcher.dc.html` | 1 |
| `Dropdown.dc.html` | 1 |
| `Modal.dc.html` | 1 |
| `Popover.dc.html` | 1 |
| `Slider.dc.html` | 1 |
| `Tabs.dc.html` | 1 |

Vier Dateien tragen **beide** Schreibweisen (`Breadcrumb`, `Content-switcher`, `Slider`, `Tabs`). Dort sind §3.1 und §3.2 beide anzuwenden.

**Sichtbar:** Der Fokusring wird auf allen 22 Seiten von einem zarten Schimmer zu einem satten Ring — genau die Änderung, die im Rest des Systems seit Fall A eingetreten ist. Auf den 11 Seiten aus §3.2 wechselt zusätzlich der Farbton: von einem helleren, stärker gesättigten Teal auf die Primärfarbe des Systems. Wer die Seiten heute nebeneinanderlegt, sieht drei verschiedene Fokusringe; danach einen.

---

## 4. `readme.md` nennt die Deckkraft ein drittes Mal

Zeile 143:

| alt | neu |
|---|---|
| `**Fokus.** Immer sichtbar, immer gleich: ein 3px-Ring in primary-600 mit rund 35 % Alpha` | `**Fokus.** Immer sichtbar, immer gleich: ein 3px-Ring in primary-600 mit rund 75 % Alpha` |

Geändert wird ausschließlich `35 %` → `75 %`. Der Rest des Satzes bleibt wörtlich stehen.

**Warum:** Das Übergabedokument hatte in §2.3 nur die eine Stelle in `CLAUDE.md` erfasst. Tatsächlich nennt das Projekt die Deckkraft in Prosa an drei Stellen: zwei in `CLAUDE.md` (beide inzwischen auf 75 %) und diese hier.

**Sichtbar:** nichts. Die Datei beschreibt, sie färbt nicht.

---

## 5. Die aktiven Teilstriche des Sliders — Entscheidung liegt vor

`components/Slider.dc.html`, Zeile 336:

| alt | neu |
|---|---|
| `o.ticks.push({ pos: tp + '%', color: i <= v ? '#ffffffcc' : this._tickIdle });` | `o.ticks.push({ pos: tp + '%', color: i <= v ? 'rgba(255,255,255,0.75)' : this._tickIdle });` |

**Der Widerspruch:** Die Spezifikationsseite zeigte die aktiven Teilstriche mit `#ffffffcc`, also 80 % Deckkraft. Der Referenzcode `ui/Slider.jsx` verwendete 75 %, und das neue Token `--medo-control-mark-on-primary` hat diesen Wert übernommen. Nach der Rangfolge des Projekts steht die Spezifikationsseite über dem Referenzcode — der Widerspruch war also nicht von selbst aufzulösen.

**Die Entscheidung des Inhabers: die Seite zieht auf 75 % nach, das Token bleibt.**

Die tragenden Gründe, gemessen:

| Deckkraft | Strich auf der Füllung, hell | dunkel |
|---|---|---|
| 75 % (Token) | 4,01:1 | 2,40:1 |
| 80 % (Seite) | 4,34:1 | 2,53:1 |

Der Unterschied liegt an der Wahrnehmungsgrenze, und keiner der Werte erreicht 3:1 im dunklen Theme — die Teilstriche sind Ergänzung, Lage und Zustand des Reglers tragen Füllung und Griff. Ausschlaggebend war die Zahl der berührten Stellen: die Seite zu korrigieren ändert eine Datei, das Token anzuheben fünf (drei Token-Dateien im Design-Projekt, Spiegel und Port). Hinzu kommt, dass derselbe Seitensatz bei harten Farbwerten nachweislich unzuverlässig ist — siehe §3 und §6.

**Sichtbar:** Auf der Spezifikationsseite werden die aktiven Teilstriche eine Spur weniger deckend. Nebeneinandergelegt kaum zu unterscheiden; die Seite stimmt danach mit dem überein, was die Komponente tatsächlich zeigt.

---

## 6. Ein Befund ohne Anweisung — die Grundfarbe `#0e9d91`

> Dieser Befund stammt **nicht** aus den freigegebenen AA-Korrekturen. Er wurde beim Abgleich entdeckt, dem Inhaber getrennt vorgelegt und von ihm entschieden. Er steht abgesetzt, weil seine Herleitung nichts mit Fall A zu tun hat.

Die 17 Stellen aus §3.2 tragen den Fokusring als `#0e9d9159`. Die Deckkraft `59` ist der bekannte Fall A. **Die Grundfarbe `#0e9d91` ist aber nicht `teal-600`** — die Primärfarbe des Systems ist `#007265`.

`#0e9d91` ist deutlich heller und stärker gesättigt. Der Wert steht in keiner Token-Datei und ist keiner Palettenstufe zuzuordnen. Er kommt ausschließlich in Spezifikationsseiten vor, dort aber systematisch — er ist kein Vertipper, sondern eine über elf Seiten getragene Annahme. Der Fehler ist älter als die AA-Korrekturen und unabhängig von ihnen.

**Ein verwandter Fall:** `Übersicht.dc.html` trägt einmal `#0e9d9126` — dieselbe falsche Grundfarbe bei 15 % Deckkraft, an einer Feldvorschau. Ob das ein dritter Ring-Zustand sein soll oder derselbe Fehler mit anderer Deckkraft, ist von außen nicht zu entscheiden.

**Drei Wege standen zur Wahl:** beides zusammen korrigieren (`#007265bf`); nur die Deckkraft anheben und den fremden Farbton behalten (`#0e9d91bf`); oder zurückstellen, bis jemand klären kann, woher der Wert stammt.

**Die Entscheidung des Inhabers: beides zusammen korrigieren.** Der Wert lässt sich keiner Palettenstufe zuordnen, steht in keiner Token-Datei, und die Spezifikationsseiten sollen zeigen, was das System tatsächlich tut. Die Anweisung dazu steht in §3.2.

**Ein Rest bleibt offen:** das einzelne `#0e9d9126` in `Übersicht.dc.html`. Es trägt dieselbe fremde Grundfarbe, aber eine dritte Deckkraft (15 %) an einer Feldvorschau. Ob das ein eigener, gewollter Zustand ist oder derselbe Fehler mit anderer Deckkraft, ist von außen nicht zu entscheiden — es war nicht Teil der Entscheidung und **bleibt unangetastet**. Wer die Seite ohnehin anfasst, sollte es klären.

---

## 7. Eine Prüfung, die nur am Bildschirm zu entscheiden ist

`guidelines/40-farben3-9-status.card.html` hat bei der Anwendung eine Akzent-Zeile je Statusfarbe bekommen, und ihr `viewport` wurde von `700x150` auf `700x196` erhöht. Die `body`-Höhe der Seite blieb aber bei `150px` mit `overflow:hidden`.

**Zu prüfen:** Ist die neue Akzent-Zeile auf der Karte vollständig sichtbar, oder wird sie unten abgeschnitten? Rechnerisch ist das nicht zu entscheiden — es hängt an den tatsächlichen Zeilenhöhen im Browser.

Wird sie abgeschnitten, ist die Abhilfe, die `body`-Höhe auf `196px` zu setzen, passend zum `viewport`.

---

## 8. Was dieser Nachtrag nicht enthält

- **Fall B im Port.** Die Umstellung von `Notification` und `Modal` auf die vier Statusakzente ist eine eigene Aufgabe im abnehmenden Repository und keine Änderung am Design-Projekt.
- **Den C2PA-Herkunftsblock in `logo-medo.svg`.** Er wird beim Speichern neu angehängt und ist im Projekt nicht entfernbar. Der Spiegel führt ihn bewusst nicht; das ist in `abgleich-farbe-und-tokens.md` §8 festgehalten und braucht keine Anweisung.
- **Die Alias-Ebene.** Sie bleibt unverändert, wie schon im Übergabedokument.
