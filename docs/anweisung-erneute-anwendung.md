# Anweisung an das Design-Projekt — erneute Anwendung von „Farbe und Tokens"

Dieser Text ist zum Einfügen in das Gespräch mit der KI im medo-Design-Projekt gedacht, zusammen mit dem Dokument `uebergabe-farbe-und-tokens.md`.

**Hintergrund:** Ein erster Anlauf hat das Projekt nicht erreicht — keine der 68 Anweisungen ist angekommen, keine Datei wurde geschrieben. Der Abgleich steht in `abgleich-farbe-und-tokens.md`. Die wahrscheinlichste Ursache: das Dokument ändert zwei Beschlüsse, die `CLAUDE.md` als `LOCKED` führt. Ohne ausdrückliche Freigabe wird eine sorgfältige Umsetzung dort anhalten. Genau das hebt der folgende Text auf.

---

## Der Prompt

```text
Ich gebe Dir das Dokument „Übergabe an das medo-Design-Projekt — Farbe und Tokens".
Es beschreibt 68 Einzelanweisungen in 10 Dateien dieses Projekts. Wende sie an —
schreibe die Dateien tatsächlich, nicht nur einen Plan oder eine Zusammenfassung.

Ein erster Anlauf ist ohne jede Änderung geblieben. Bitte lies deshalb zuerst die
folgenden vier Punkte, bevor Du anfängst.

1) ZWEI GELOCKTE BESCHLÜSSE SIND AUSDRÜCKLICH FREIGEGEBEN

Das Dokument ändert zwei Dinge, die CLAUDE.md als LOCKED führt. Beides ist von mir
als Inhaber geprüft und freigegeben. Halte deswegen nicht an und frage nicht nach:

  a) Die Deckkraft beider Fokusringe: 35 % → 75 % (hex-Endung 59 → bf).
     Grund: der Ring erreicht heute auf keiner Fläche die WCAG-Schwelle von 3:1
     (1,65:1 bis 2,00:1) und ist in 26 Komponenten der alleinige Fokusanzeiger.
     Farbton und Sättigung bleiben unberührt — nur die Deckkraft ändert sich.

  b) Die Palettenstufe stone-500: #94908c → #928e8a.
     Grund: die kräftige Rahmenlinie erreicht auf der Kartenfläche 2,96:1
     statt 3:1. Der Wert weicht bewusst von dem ab, was der Erzeugungs-
     algorithmus liefert.

Ändere für (b) NICHT den geteilten `default lRamp`. Er wird von stone, grey, teal,
red, green, blue und weiteren Skalen benutzt; ihn zu verschieben würde die
500er-Stufe jeder dieser Skalen verändern. Das ist nicht gewollt. Trage den Wert
stattdessen direkt ein und halte ihn als Ausnahme in CLAUDE.md fest, wie in
Abschnitt 4.4 des Dokuments beschrieben.

Dieser Ausnahme-Eintrag ist der wichtigste Einzelschritt des ganzen Auftrags:
ohne ihn erzeugt der nächste Lauf des Algorithmus #94908c zurück und die
Korrektur ist stillschweigend verloren.

2) EIN NACHTRAG, DER IM DOKUMENT FEHLT

CLAUDE.md nennt die 35-%-Deckkraft an ZWEI Stellen. Das Dokument erfasst in
Abschnitt 2.3 nur die eine:

  - Unter „## Build conventions", im Satz „Rule: focus-ring is primary-600
    everywhere, EXCEPT … at the same 35% alpha …"  → im Dokument erfasst
  - Unter „### Key semantic tokens (Ebene 3)", im Eintrag
    „focus-ring=primary-600 (rendered as 3px ring at ~35% alpha, hex+59)"
    → im Dokument NICHT erfasst

Ändere beide auf 75 % beziehungsweise „hex+bf". Bleibt die zweite Stelle stehen,
widerspricht CLAUDE.md sich danach selbst.

3) DAS PROJEKT BLEIBT HELL-ONLY

Führe KEINE dunklen Werte ein, kein light-dark(), keine Theme-Umschaltung. Wo das
Dokument ein neues Token anlegt, bekommt es hier nur seinen hellen Wert. Der
Beschluss „Light mode only" bleibt bestehen.

Fall C2 (Textlink im dunklen Theme) betrifft dieses Projekt gar nicht — dort ist
nichts zu tun. Er ist im Dokument nur der Vollständigkeit halber genannt.

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

Fällt Dir beim Arbeiten etwas auf, das geändert werden sollte und nicht im
Dokument steht: schreibe es unten in Deinen Bericht, aber ändere es nicht.

REIHENFOLGE

Arbeite die Kaskade in dieser Reihenfolge durch, sie ist im Dokument in
Abschnitt 1.3 begründet:

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

Vergiss die 13 Seiten aus Abschnitt 8 nicht. Sie zeigen geänderte Werte an; eine
Änderung, die nur in den Token-Dateien steht, hinterlässt dort falsche Angaben.

WAS ICH DANACH VON DIR BRAUCHE

Wenn Du fertig bist, gib mir bitte in dieser Form Auskunft:

  a) Die Liste der Dateien, die Du TATSÄCHLICH GESCHRIEBEN hast — jeder Pfad
     einzeln, nicht „die Token-Dateien". Wenn Du eine Datei gelesen, aber nicht
     geändert hast, führe sie getrennt auf.
  b) Je Abschnitt des Dokuments (2, 3, 4, 5, 6, 8): umgesetzt oder nicht.
  c) Jede Stelle, an der Du von der Anweisung abgewichen bist, und warum.
  d) Jede Anweisung, die Du nicht ausführen konntest, mit dem Grund.
  e) Alles, was Du geändert hast, was NICHT im Dokument steht.

Zu Abschnitt 6 des Dokuments („Neu entdeckter Befund", --medo-focus-ring-danger
fehlt in beiden flachen Exporten): den bitte MIT anwenden. Ohne ihn bleibt Fall A
in tokens.css und tokens.json nur zur Hälfte umgesetzt — der Gefahren-Fokusring
fehlt dort dann weiterhin ganz.
```

---

## Warum der Prompt so gebaut ist

**Punkt 1 steht ganz oben**, weil er die wahrscheinlichste Ursache des ersten Fehlschlags auflöst. `CLAUDE.md` beginnt mit „Locked Decisions" und dem Satz, jede Entscheidung sei einzeln bestätigt. Eine Umsetzung, die diese Datei ernst nimmt, hält bei Fall A und Fall D an — zu Recht. Nur der Inhaber kann das aufheben, und es muss im Auftrag stehen, nicht im Anhang.

**Punkt 4 ist die Gegenrichtung zu Punkt 1.** Wer eine Freigabe für zwei gelockte Beschlüsse erhält, könnte sie als allgemeine Öffnung lesen. Die vier ausdrücklich genannten Nicht-Änderungen sind genau die, die beim Arbeiten am nächsten liegen — die Feldkante sieht wie ein Fehler aus, und die Alias-Ebene liegt mitten in der Kaskade.

**Die Rückmeldung unter „Was ich danach brauche"** ist der Teil, der den ersten Fehlschlag sofort sichtbar gemacht hätte. Die Frage „welche Dateien hast Du geschrieben" lässt sich nicht mit „ist erledigt" beantworten. Punkt (a) verlangt Pfade, Punkt (e) fragt nach Zutaten — beides ist im Nachhinein gegen den Spiegel prüfbar.

**Was der Prompt bewusst nicht enthält:** die 68 Anweisungen selbst. Sie stehen im Dokument, mit Zeilennummern, die alle noch stimmen. Sie hier zu wiederholen, schüfe eine zweite Quelle, die von der ersten abweichen kann.
