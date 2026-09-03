# Anweisung an das Design-Projekt — Anwendung von „Farbe und Tokens"

Dieser Text ist zum Einfügen in das Gespräch mit der KI im medo-Design-Projekt gedacht, zusammen mit dem Dokument `uebergabe-farbe-und-tokens.md`.

## Vor dem Einfügen: das richtige Projekt öffnen

**Das Zielprojekt ist:**

```
medo Design System
https://claude.ai/design/p/9bff25e1-b01d-4339-ac16-a6e8fc26cdd3
```

Ein erster Anlauf ist in einem **anderen** Projekt gelandet — einem, in dem der medo-Bestand als Unterordner `design_handoff_medo/` liegt. Dort sind alle 68 Anweisungen umgesetzt; im Design System selbst ist keine einzige angekommen. Belegt in `abgleich-farbe-und-tokens.md`.

Woran die Verwechslung erkennbar ist: das Design System führt seine Farbkarten unter deutschen Namen (`guidelines/40-farben3-9-status.card.html`, `20-farben1-01-stone.card.html`), das andere Projekt unter englischen (`colors-status`, `colors-action`, `colors-border`). Hat das Projekt einen Ordner `design_handoff_medo/`, ist es das falsche.

---

## Der Prompt

```text
Wir arbeiten im Projekt „medo Design System"
(9bff25e1-b01d-4339-ac16-a6e8fc26cdd3). Ich gebe Dir das Dokument „Übergabe an
das medo-Design-Projekt — Farbe und Tokens". Es beschreibt 68 Einzelanweisungen
in 10 Dateien. Wende sie an — schreibe die Dateien tatsächlich, nicht nur einen
Plan oder eine Zusammenfassung.

SCHRITT 0: PRÜFE ZUERST, WO DU BIST UND WAS SCHON DA IST

Ein früherer Anlauf ist in einem anderen Projekt gelandet. Bevor Du etwas
änderst, sieh an genau diesen drei Stellen nach und sage mir, was Du findest:

  1. tokens/semantic-colors.css, Zeile 46
     erwartet, wenn NICHT angewandt:  --medo-focus-ring: #00726559;
     wenn dort #007265bf steht, ist Fall A schon umgesetzt

  2. tokens/brand-colors.css, Zeile 192
     erwartet, wenn NICHT angewandt:  --medo-color-stone-500: #94908c;
     wenn dort #928e8a steht, ist Fall D schon umgesetzt

  3. Existiert die Datei guidelines/40-farben3-9-status.card.html?
     Wenn ja, bist Du im richtigen Projekt.
     Wenn dort stattdessen guidelines/colors-status.card.html liegt oder es
     einen Ordner design_handoff_medo/ gibt, bist Du im FALSCHEN Projekt —
     halte an und sage es mir, ohne etwas zu ändern.

Findest Du bei 1 und 2 die alten Werte und bei 3 die deutsche Kartendatei:
alles in Ordnung, arbeite weiter. Findest Du etwas anderes, halte an.

1) ZWEI GELOCKTE BESCHLÜSSE SIND AUSDRÜCKLICH FREIGEGEBEN

Das Dokument ändert zwei Dinge, die CLAUDE.md als LOCKED führt. Beides ist von
mir als Inhaber geprüft und freigegeben. Halte deswegen nicht an:

  a) Die Deckkraft beider Fokusringe: 35 % → 75 % (hex-Endung 59 → bf).
     Grund: der Ring erreicht heute auf keiner Fläche die WCAG-Schwelle von
     3:1 (1,65:1 bis 2,00:1) und ist in 26 Komponenten der alleinige
     Fokusanzeiger. Farbton und Sättigung bleiben unberührt.

  b) Die Palettenstufe stone-500: #94908c → #928e8a.
     Grund: die kräftige Rahmenlinie erreicht auf der Kartenfläche 2,96:1
     statt 3:1.

Ändere für (b) NICHT den geteilten `default lRamp`. Er wird von stone, grey,
teal, red, green, blue und weiteren Skalen benutzt; ihn zu verschieben würde
die 500er-Stufe jeder dieser Skalen verändern. Das ist nicht gewollt. Trage den
Wert direkt ein und halte ihn als Ausnahme in CLAUDE.md fest, wie in Abschnitt
4.4 des Dokuments beschrieben.

Dieser Ausnahme-Eintrag ist der wichtigste Einzelschritt des Auftrags: ohne ihn
erzeugt der nächste Lauf des Algorithmus #94908c zurück und die Korrektur ist
stillschweigend verloren.

2) EIN NACHTRAG, DER IM DOKUMENT FEHLT

CLAUDE.md nennt die 35-%-Deckkraft an ZWEI Stellen. Das Dokument erfasst in
Abschnitt 2.3 nur die eine:

  - Unter „## Build conventions", im Satz „Rule: focus-ring is primary-600
    everywhere, EXCEPT … at the same 35% alpha …"  → im Dokument erfasst
  - Unter „### Key semantic tokens (Ebene 3)", im Eintrag
    „focus-ring=primary-600 (rendered as 3px ring at ~35% alpha, hex+59)"
    → im Dokument NICHT erfasst

Ändere beide auf 75 % beziehungsweise „hex+bf". Bleibt die zweite Stelle
stehen, widerspricht CLAUDE.md sich danach selbst.

3) DAS PROJEKT BLEIBT HELL-ONLY

Führe KEINE dunklen Werte ein, kein light-dark(), keine Theme-Umschaltung. Wo
das Dokument ein neues Token anlegt, bekommt es hier nur seinen hellen Wert.

Fall C2 (Textlink im dunklen Theme) betrifft dieses Projekt gar nicht.

4) NICHTS ÜBER DAS DOKUMENT HINAUS

Setze genau die 68 beschriebenen Anweisungen um und sonst nichts. Keine
Verbesserungen, keine Aufräumarbeiten, keine zusätzlichen Token, keine
Umformatierung. Insbesondere:

  - tokens/alias-colors.css wird NICHT verändert (Abschnitt 7.3)
  - --medo-input-border bleibt stone-400 (Abschnitt 7.1 — gelockte Absicht,
    sieht wie ein Fehler aus, ist keiner)
  - --medo-action und --medo-input-border-focus bleiben teal-600; nur der
    Textlink wechselt auf teal-700 (Abschnitt 4.1)
  - warning bleibt der Amber-Skala zugeordnet (Abschnitt 7.2)

Fällt Dir etwas auf, das geändert werden sollte und nicht im Dokument steht:
schreibe es in Deinen Bericht, aber ändere es nicht.

REIHENFOLGE

  1. tokens/brand-colors.css
  2. tokens/alias-colors.css — nur prüfen, nicht ändern
  3. tokens/semantic-colors.css
  4. tokens.css und tokens.json
  5. die Komponentendateien unter ui/
  6. die Richtlinien- und Spezifikationsseiten
  7. die Regeltexte in CLAUDE.md

Schritt 4 ist nicht optional. tokens.css spiegelt die Quellstruktur mit
var()-Verweisen, tokens.json hält dagegen aufgelöste Hex-Werte — eine Änderung
auf Brand-Ebene zieht dort NICHT von selbst nach.

Die 13 Seiten aus Abschnitt 8 gehören dazu. Ihre Namen im Dokument
(guidelines/40-farben3-*, 20-farben1-*, Semantic-Palette.dc.html,
components/Notification.dc.html und weitere) sind aus diesem Projekt
entnommen und müssen dort alle existieren. Findest Du einen dieser Pfade
nicht, sage es mir, statt einen ähnlich benannten zu nehmen.

WAS ICH DANACH VON DIR BRAUCHE

  a) Die Liste der Dateien, die Du TATSÄCHLICH GESCHRIEBEN hast — jeder Pfad
     einzeln, nicht „die Token-Dateien". Gelesen-aber-nicht-geändert bitte
     getrennt auflisten.
  b) Je Abschnitt des Dokuments (2, 3, 4, 5, 6, 8): umgesetzt oder nicht.
  c) Jede Stelle, an der Du von der Anweisung abgewichen bist, und warum.
  d) Jede Anweisung, die Du nicht ausführen konntest, mit dem Grund.
  e) Alles, was Du geändert hast, was NICHT im Dokument steht.
  f) Das Ergebnis von Schritt 0, wörtlich.

Zu Abschnitt 6 des Dokuments („Neu entdeckter Befund", --medo-focus-ring-danger
fehlt in beiden flachen Exporten): den bitte MIT anwenden. Ohne ihn bleibt
Fall A in tokens.css und tokens.json nur zur Hälfte umgesetzt.
```

---

## Was gegenüber dem ersten Prompt geändert ist

**Schritt 0 ist neu und der eigentliche Fix.** Der erste Prompt behauptete „ein erster Anlauf ist ohne jede Änderung geblieben". Aus Sicht der KI im anderen Projekt war das falsch — sie hat nachgesehen, die Änderungen vorgefunden und widersprochen, statt zu arbeiten. Das war richtig von ihr. Ein Prompt, der eine Prämisse setzt, die der Empfänger überprüfen kann, muss ihn diese Prämisse überprüfen lassen, statt sie zu behaupten.

**Die dritte Prüfung stellt die Projektidentität fest.** Sie ist der wichtigere Teil: `guidelines/40-farben3-9-status.card.html` existiert nur im Design System, `colors-status.card.html` und `design_handoff_medo/` nur im anderen Projekt. Damit erkennt die KI eine Verwechslung selbst, bevor sie schreibt.

**Der Hinweis zu den 13 Seiten ist geschärft.** Die KI im anderen Projekt hat die Pfade aus Abschnitt 8 nicht gefunden und sinngemäß den nächstliegenden genommen. Im richtigen Projekt existieren sie alle; ein nicht gefundener Pfad ist dort ein Warnzeichen, kein Anlass zum Ersetzen.

**Punkt (f) macht Schritt 0 berichtspflichtig.** Sonst bleibt offen, ob er ausgeführt wurde.
