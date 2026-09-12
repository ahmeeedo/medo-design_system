# Übergabe an das medo-Design-Projekt — der widersprüchliche Tabs-Kommentar

Drei Textstellen in drei Dateien. Keine Verhaltensänderung, kein Token, kein Vertrag — nur Beschreibungen, die etwas Falsches behaupten.

**Zielprojekt:**

```
medo Design System
https://claude.ai/design/p/9bff25e1-b01d-4339-ac16-a6e8fc26cdd3
```

---

## Worum es geht

Änderung 12 hat `scrollable` entwertet: die Tab-Leiste läuft seither von selbst mit der Auswahl mit, die Angabe wird entgegengenommen und nirgends gelesen. Der Kommentar bei `scrollable` wurde damals nachgezogen — **drei Stellen, die sie an anderer Stelle weiterempfehlen, blieben stehen.**

Die Quelle widerspricht sich dadurch selbst: `Tabs.d.ts` sagt beim einen Prop, `scrollable` „gewinnt", und drei Zeilen darunter beim anderen, es sei „ohne Wirkung". Wer den Vertrag liest, greift zu einer Angabe, die nichts tut.

---

## Der Prompt

```text
Wir arbeiten im Projekt „medo Design System"
(9bff25e1-b01d-4339-ac16-a6e8fc26cdd3). Drei Textstellen in drei Dateien
behaupten etwas Falsches über die Prop „scrollable" der Tabs. Bitte
berichtige sie — schreibe die Dateien tatsächlich, nicht nur einen Plan.

SCHRITT 0: PRUEFE ZUERST, WO DU BIST UND OB ES NOCH ANSTEHT

  1. Liegt die Datei guidelines/40-farben3-9-status.card.html vor?
     Wenn ja, bist Du im richtigen Projekt.
     Liegt dort stattdessen guidelines/colors-status.card.html, oder gibt
     es einen Ordner design_handoff_medo/, bist Du im FALSCHEN Projekt —
     halte an und sag mir Bescheid.

  2. Enthaelt ui/Tabs.d.ts noch den Satzteil
        dafuer ist scrollable da
     (mit scrollable in Backticks)? Wenn nein, ist Aenderung 1 schon
     umgesetzt. Sag mir, was Du vorfindest, bevor Du etwas aenderst.

HINTERGRUND

Aenderung 12 hat scrollable entwertet: die Tab-Leiste laeuft seither von
selbst mit der Auswahl mit. Die Angabe wird entgegengenommen und nirgends
gelesen. Der Kommentar bei scrollable selbst wurde damals berichtigt; die
drei folgenden Stellen empfehlen die Angabe weiterhin und blieben stehen.

AENDERUNG 1 — ui/Tabs.d.ts, Kommentar ueber fullWidth (Zeilen 24 bis 27)

  VORHER (vier Zeilen, wortgleich):

  /** Tabs teilen die Breite gleichmaessig. Nur horizontal. Passt eine Beschriftung nicht,
   *  bricht sie auf eine zweite Zeile um und wird erst danach gekuerzt; die Leiste wird
   *  dabei hoeher. Gleich breite Tabs rollen nie — dafuer ist scrollable da, das zusammen
   *  mit fullWidth gewinnt. */

  NACHHER (drei Zeilen):

  /** Tabs teilen die Breite gleichmaessig. Nur horizontal. Passt eine Beschriftung nicht,
   *  bricht sie auf eine zweite Zeile um und wird erst danach gekuerzt; die Leiste wird
   *  dabei hoeher. Gleich breite Tabs rollen nie. */

  Beachte: im Original stehen scrollable und fullWidth in Backticks und die
  Umlaute ausgeschrieben — uebernimm die Schreibweise der vorhandenen Datei,
  ich habe sie hier nur der Lesbarkeit halber ersetzt. Geaendert wird
  ausschliesslich der Schluss ab „Gleich breite Tabs rollen nie".

  Sichtbare Folge: der Vertrag widerspricht sich nicht mehr. Wer fullWidth
  nachschlaegt, wird nicht mehr auf eine wirkungslose Angabe verwiesen.

AENDERUNG 2 — ui/Tabs.jsx, Kommentar im CSS-Block (Zeilen 105 und 106)

  Diese Stelle liegt INNERHALB des Template-Literals MEDO_TABS_CSS. Setze
  dort keine Backticks ein, sonst endet der String vorzeitig.

  VORHER (zwei Zeilen):

     und „labels should be wrapped before truncating them". Gleich breite Tabs rollen nie;
     wer rollen will, nimmt „scrollable".

  NACHHER (eine Zeile):

     und „labels should be wrapped before truncating them". Gleich breite Tabs rollen nie.

  Die Zeile davor (Material Design 3: „Labels can use a second line …") und
  die Zeile danach („min-width: 0" hebt die Mindestbreite auf …) bleiben
  unveraendert. Es entfaellt genau eine Zeile.

  Sichtbare Folge: keine. Es ist ein Kommentar im Stylesheet — er wird nur
  gelesen, nicht ausgefuehrt.

AENDERUNG 3 — ui/Tabs.prompt.md, Zeilen 45 und 46

  VORHER (zwei Zeilen):

  Geraet dagegen mehr Platz, als vier gleiche Spalten hergeben; dort ist scrollable oder die
  vertikale Form (orientation="vertical") die ehrlichere Loesung.

  NACHHER (zwei Zeilen):

  Geraet dagegen mehr Platz, als vier gleiche Spalten hergeben; dort ist die vertikale Form
  (orientation="vertical") oder eine Leiste ohne fullWidth die ehrlichere Loesung.

  Auch hier: scrollable, orientation und fullWidth stehen im Original in
  Backticks — Schreibweise der vorhandenen Datei uebernehmen.

  Sichtbare Folge: die Nutzungsregel nennt jetzt zwei Wege, die wirklich
  helfen. Eine Leiste ohne fullWidth laeuft von selbst mit; das ist der
  Ausweg, den scrollable frueher versprochen hat.

WAS AUSDRUECKLICH UNBERUEHRT BLEIBT

  - Der Kommentar bei scrollable selbst in ui/Tabs.d.ts („Ohne Wirkung.
    Passen die Tabs nicht nebeneinander, laeuft die Leiste ohnehin mit …").
    Der stimmt bereits.
  - Die beiden Stellen in ui/Tabs.prompt.md in Zeile 34 („scrollable hat
    keine Wirkung mehr und bleibt nur fuer bestehende Einbindungen
    erhalten") und Zeile 40 („sie rollt nicht — gleich breite Tabs und
    Rollen schliessen einander aus"). Beide stimmen.
  - Die Prop scrollable selbst. Sie bleibt im Vertrag und in der Signatur,
    fuer bestehende Einbindungen. Nichts wird entfernt.
  - components/Tabs.dc.html. Dort ist nichts zu aendern.
  - Jede andere Datei.

ZUM SCHLUSS

Sag mir, welche Dateien Du geschrieben hast und welche Zeilen sich geaendert
haben. Wenn Du eine der drei Stellen anders vorfindest als oben beschrieben,
aendere sie NICHT, sondern sag mir, was dort steht.
```

---

## Danach

Die Änderung muss zurück in den Spiegel: `design-reference/ui/Tabs.d.ts`, `Tabs.jsx` und `Tabs.prompt.md` neu ziehen und byteweise vergleichen. Der Port ist bereits berichtigt (`src/types/Tabs.d.ts`, Commit `802f7aa`) — er braucht danach keine weitere Änderung, aber der Vergleich zeigt, ob die anwendende Seite genau die drei Stellen getroffen hat.
