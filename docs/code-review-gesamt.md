# Code Review über die ganze Codebasis

**Stand:** 12.09.2026 · Zweig `docs/code-review`, Zweigbasis `1f42901` (null Commits Abstand zu `main`)

Dieser Bericht listet auf, was bei einer systematischen Durchsicht des gesamten Projekts gefunden wurde. **Es ist nichts behoben worden** — der Bericht ist die Grundlage für die Entscheidung, was behoben wird.

Jeder Befund nennt die Fundstelle, was dort steht, wie schwer es wiegt und **was passiert, wenn nichts geschieht**. Die Befunde stehen nach Schwere geordnet, nicht nach Datei.

---

## Die vier Prüfläufe

| Lauf | Ergebnis |
|---|---|
| `npm test` | **grün** — 484 Tests in 37 Dateien, 15,9 s |
| `npm run build` | **fehlerfrei** — eine Warnung, die bekannte zur Bündelgröße |
| `npm run build:lib` | **fehlerfrei** — 48 Stylesheets, 37 Verträge über 37 Module |
| `npm run contrast:verify` | **17 von 17 bestanden** |

Kein Prüflauf schlägt fehl. Der Befund höchster Schwere, den ein Fehlschlag ausgelöst hätte, entfällt damit.

Zusätzlich geprüft: die acht Token-Dateien unter `src/styles/medo/` sind durchgängig CRLF (CR-Zahl gleich Zeilenzahl, mit `file` bestätigt) und nach Normalisierung der Zeilenenden **byteweise gleich** mit dem Spiegel unter `design-reference/tokens/`. Quelle und Spiegel laufen nicht auseinander.

---

## Was geprüft wurde

Damit sichtbar wird, was **nicht** geprüft ist:

| Einheit | Umfang |
|---|---|
| Komponenten | **37** Ordner, je `.jsx` und `.css`, vollständig gelesen |
| Barrel | `src/components/index.js` — 48 Exporte, keine Namensdopplung, kein fehlender Ordner |
| Verträge | **37** Dateien unter `src/types/`, **515 deklarierte Props** gegen die Umsetzung abgeglichen |
| Portal-Chrome | **19** Dateien unter `src/docs/` (ohne Tests), dazu `src/App.jsx` und `src/main.jsx` |
| Doku-Seiten | **45** Dateien unter `src/pages/` |
| Build- und Prüfskripte | **15** Dateien unter `scripts/`, dazu `vite.config.js`, `vite.config.lib.js`, `index.html`, `package.json` |
| Tests | **37** Testdateien |
| Stylesheets | `global.css`, `medo-theme.css`, `medo-theme-components.css`, `medo-tokens.css`, `fonts.css`, `icons.css`, `src/styles/medo/*.css` (8) |
| Sprachdateien | `de.json` und `en.json`, je **2809** Schlüssel |
| Erzeugte Dateien | `src/config/searchData.js`, `src/config/sectionData.js` |
| Sonstiges | `public/`, `.gitattributes`, Abgleich Spiegel gegen Repository |

**Nicht geprüft:** die Darstellung im Browser. Dieser Bericht beruht auf dem Code, nicht auf dem Bildschirm. Was sich nur am Bildschirm zeigt — Abstände, Farbwirkung, Verhalten auf echten Mobilgeräten —, steht nicht darin. Ebenfalls nicht geprüft: `design-reference/` als Ganzes (nur die Token-Dateien und die im Einzelfall herangezogenen Referenzdateien) sowie die Dokumente unter `docs/` (nur die beiden vom Kontrastwerkzeug erzeugten).

---

# Schwer

Diese Befunde brechen etwas, das jemand benutzt — im Portal oder im ausgelieferten Paket.

## 1. Der Popover verschwindet beim Scrollen und kommt nicht wieder

**`src/components/Popover/Popover.jsx:50`, `:101`, `:127-128`**

Beim Scrollen oder Verändern der Fenstergröße setzt die Komponente ihre gemessene Position zurück (`reflow = () => setPos(null)`, Zeile 50), damit neu gemessen wird. Die Neumessung läuft aber nur an, wenn sich eine von sechs festgelegten Angaben ändert (Zeile 101) — das Zurücksetzen der Position steht nicht darunter. Die Messung findet also nie wieder statt. Ohne Messung rendert die Komponente sich selbst mit `visibility: hidden` (Zeile 128).

**Folge:** Wer einen Popover öffnet und die Seite auch nur ein Stück scrollt oder das Fenster verändert, dem verschwindet der Popover. Er ist dann weder sichtbar noch wieder herholbar — nur Schließen und erneut Öffnen hilft. Nichts deutet darauf hin, dass etwas kaputt ist; der Inhalt ist einfach weg.

**Prüfbar unter** `/popover`: Popover öffnen, Seite scrollen.

**Betrifft das ausgelieferte Paket.** `Popover` ist exportiert (`src/components/index.js:17`); jedes fremde Projekt, das ihn einbindet, hat denselben Fehler. Verschärfend: `Popover` hat **keine einzige Testdatei** (siehe Befund 15).

## 2. Statusbanner und Etiketten verlieren Fläche und Rahmen

**`src/components/Notification/Notification.jsx:39`, `:41`, `:42` · `src/components/Tag/Tag.jsx:84`, `:90`**

An diesen fünf Stellen wird eine Farbe als CSS-**Kurzform** mit einem Token-Wert gesetzt (`background: 'var(…)'`, `borderColor: 'var(…)'`). Das Projekt hat für genau diesen Fall eine Regel, weil Kurzformen mit Token-Werten unvollständig ankommen — und der Fehler ist stumm.

Dass die Regel im Projekt gilt, belegt es an drei Stellen selbst:

- `src/components/Slider/Slider.jsx:120` und `:124` benutzen bewusst die Längsform `backgroundColor`, mit einem eigenen Test dazu (`src/components/Slider/Slider.test.jsx:39-49`).
- `src/components/Notification/Notification.jsx:146-154` — **dieselbe Datei** — setzt die Rahmenfarbe des Toasts ausdrücklich in vier Längsformen und trägt darüber den Kommentar „weil die Kurzform border-color einen var()-Wert nicht überall übernimmt". Das eingebettete Banner 100 Zeilen weiter oben wurde dabei übersehen.

**Folge:** Das eingebettete Statusbanner (`Notification`) steht ohne Statusfläche und ohne farbigen Rahmen da — die Basis setzt den Rahmen auf `transparent` (`Notification.css:7`), er ist dann unsichtbar. Bei der Stufe „solid" steht weiße Schrift auf ungefärbtem Grund und ist praktisch unlesbar. Die Etiketten (`Tag`) verlieren ihre Farbe ganz, der Statuspunkt ebenfalls.

**Prüfbar unter** `/notification` und `/tag`: Tragen Banner und Etiketten ihre Farben?

**Betrifft das ausgelieferte Paket.**

**Wichtige Einschränkung:** Sollte sich am Bildschirm zeigen, dass die Farben ankommen, ist nicht dieser Code falsch, sondern die Regel — dann gehört die Regel berichtigt, und die Längsformen in `Slider` und im Toast wären überflüssige Umwege. Eines von beiden stimmt nicht; beides zugleich kann nicht richtig sein. Der Blick auf die beiden Seiten entscheidet das in einer Minute.

## 3. Das Portal kann in manchen Browsern gar nicht erst erscheinen

**`src/docs/ThemeSwitcher.jsx:14`, `:41`**

Der Umschalter für Hell und Dunkel liest den gespeicherten Wert direkt aus dem Browser-Speicher (Zeile 14) — **während des Renderns** (Zeile 24) und ohne Absicherung. Browser, die den Speicher verweigern (Firefox mit blockierten Cookies, eingebettete Ansichten, manche Unternehmenseinstellungen), lösen bei diesem Zugriff einen Fehler aus.

Der Umschalter sitzt in der Kopfzeile über allen Seiten.

**Folge:** In einem solchen Browser rendert **die gesamte Anwendung nicht** — kein Portal, keine Seite, keine Fehlermeldung, nur eine leere Seite.

Zeile 41 hat dasselbe Problem beim Speichern: schlägt es fehl (Safari im privaten Fenster), ist das Theme bereits umgeschaltet, der Knopf zeigt aber weiter den alten Zustand.

**Dass das Projekt es besser weiß, steht daneben:** `src/docs/DocsLayout.jsx:96-110` und `:204-210` kapseln dieselben Zugriffe sauber ab, mit dem Kommentar „A browser that refuses storage still gets a working sidebar." Nur der ThemeSwitcher tut es nicht. Dieselbe Lücke hat das Inline-Skript in `index.html:13`.

## 4. Zwei Eigenschaften des Datumsfelds haben außerhalb des Inline-Modus keine Wirkung

**`src/components/DatePicker/DatePicker.jsx:248-282` gegen `:293` und `:357`**

Die Seitenspalte des Kalenders — Schnellauswahl (`presets`), die Schaltfläche „Zurücksetzen" und die Bereichs-Zusammenfassung (`summaryLabel`) — wird nur gerendert, wenn `inline` gesetzt ist (Zeile 293). Der Normalfall, das Feld mit aufklappendem Kalender, rendert ausschließlich den Kalender (Zeile 357).

Der Vertrag sagt das nicht. `src/types/DatePicker.d.ts:29-30` beschreibt `presets` als „Schnellauswahl neben dem Kalender", ohne Bedingung; `:38-39` ebenso für `summaryLabel`.

**Folge:** Wer `presets` setzt und den Kalender nicht fest anzeigt, bekommt keine Schnellauswahl — ohne Fehler, ohne Hinweis. Dasselbe für die Zeitraum-Zusammenfassung. Die Projektregel „jede in der Vertragsdatei deklarierte Eigenschaft muss funktionieren" ist hier nicht eingelöst.

**Herkunft:** Der Referenzcode (`design-reference/ui/DatePicker.jsx:478-489`) hat denselben Aufbau. Der Port ist getreu; der Fehler sitzt oben. Eine Berichtigung führt über das Design-Projekt.

**Betrifft das ausgelieferte Paket.**

## 5. Die Zieh-Handhabung des Schiebereglers bleibt am Dokument hängen

**`src/components/Slider/Slider.jsx:80-81`**

Beim Drücken der Maustaste meldet der Regler zwei Handhabungen am Dokument an. Abgemeldet werden sie ausschließlich, wenn die Maustaste wieder losgelassen wird (Zeile 76-77). Es gibt kein Aufräumen beim Ausbau der Komponente und keine Behandlung eines abgebrochenen Zeigevorgangs.

**Folge:** Wird der Regler bei gedrückter Maustaste entfernt — etwa weil der Dialog oder das Ausklappmenü, in dem er steht, sich schließt —, bleiben beide Handhabungen am Dokument hängen und arbeiten auf einem nicht mehr vorhandenen Stand weiter. Auf Touch- und Stiftgeräten, wo der Browser einen Abbruch statt eines Loslassens meldet, endet das Ziehen nie: der Rückruf „Ziehen beendet" kommt nicht, und der Regler bleibt im Ziehmodus.

**Betrifft das ausgelieferte Paket.**

## 6. Drei Fehler im Dialog

**`src/components/Modal/Modal.jsx:36-37` und `:68`** — Beim Öffnen merkt sich der Dialog den vorigen Scroll-Zustand der Seite und sperrt das Scrollen; beim Schließen stellt er den gemerkten Zustand wieder her. Einen Zähler für geschachtelte Dialoge gibt es nicht.

**Folge:** Sind zwei Dialoge zugleich offen und wird der **erste** geschlossen, gibt dessen Aufräumen das Scrollen wieder frei, obwohl der zweite Dialog noch offen ist. Die Seite scrollt dann hinter dem offenen Dialog mit.

**`src/components/Modal/Modal.jsx:42` mit der Liste in `:72`** — Die Escape-Behandlung ruft den Schließ-Rückruf auf, wird aber nur beim Wechsel zwischen offen und zu neu verdrahtet. Ein Aufrufer, der den Rückruf als Inline-Funktion über frischem Zustand übergibt — der übliche Fall —, bekommt bei Escape die Fassung vom Zeitpunkt des Öffnens.

**Folge:** Escape schließt zwar, arbeitet dabei aber mit veraltetem Zustand. Was der Rückruf speichern oder weitergeben sollte, kann falsch sein.

**`src/components/Modal/Modal.jsx:76`** — Die Kennung für die Verknüpfung von Dialog und Überschrift ist eine feste Zeichenkette (`'medo-mod-title'`) statt einer erzeugten.

**Folge:** Liegen zwei Dialoge zugleich im Dokument, gibt es die Kennung doppelt. Vorleseprogramme lesen dann die Überschrift des falschen Dialogs vor.

**Betrifft das ausgelieferte Paket.**

---

# Mittel

Diese Befunde stören die Benutzung, schließen Menschen aus oder lassen eine Prüfung leerlaufen, ohne dass etwas offensichtlich zusammenbricht.

## 7. Sieben Verweise auf der Link-Seite führen ins Leere, und es gibt keine Auffangseite

**`src/pages/LinkPage.jsx:29`, `:63`, `:69`, `:88`, `:100`, `:101`, `:120` · `src/App.jsx:111-126`**

Alle sieben gerenderten Beispiel-Links der Link-Seite zeigen auf `/colors`. Diese Route gibt es nicht — es gibt `/brand-colors`, `/alias-colors` und `/semantic-colors` (`src/App.jsx:65-67`).

Verschärfend: die Routenliste hat **keine Auffangroute**. Ein Pfad, den niemand kennt, führt nicht auf eine Fehlerseite, sondern rendert Kopfzeile und Seitenleiste mit **leerem Inhaltsbereich**.

**Folge:** Wer auf der Link-Seite einen der Beispiel-Links anklickt — das Naheliegendste, was man auf einer Link-Seite tut —, landet auf einer Seite, die aussieht wie das Portal, aber nichts enthält. Dasselbe gilt für jeden Tippfehler in der Adresszeile und jedes veraltete Lesezeichen.

**Prüfbar unter** `/link`: einen Beispiel-Link anklicken.

Die übrigen erfundenen Pfade (`/vertraege`, `/netzwerk`, `/rechnungen`, `/export`, `/hilfe`, `/praxis`, `/tokens`) stehen ausschließlich in **Code-Beispielen** und sind nicht anklickbar — geprüft und ausgeschlossen.

## 8. Im Suchdialog ist die Tabulatortaste wirkungslos und der Leeren-Knopf unerreichbar

**`src/docs/DocsSearch.jsx:61-62`, `:95`**

Der Dialog fängt Tabulator bedingungslos ab (Zeile 61-62) und benutzt ihn zum Durchwandern der Trefferliste. Ist das Feld leer, gibt es keine Treffer — Tabulator bewirkt dann gar nichts. Der Knopf zum Leeren des Feldes trägt `tabIndex={-1}` (Zeile 95) und ist damit ohnehin nie mit der Tastatur erreichbar.

**Folge:** Wer den Suchdialog mit der Tastatur bedient und nichts eingegeben hat, kommt mit Tabulator nicht mehr aus dem Suchfeld heraus. Escape schließt den Dialog — das ist der einzige Ausweg. Den Leeren-Knopf erreicht man mit der Tastatur überhaupt nicht.

**Prüfbar:** Suche öffnen (Strg+K), nichts eingeben, Tabulator drücken.

## 9. Auf dem Telefon bleiben 43 unsichtbare Navigationslinks in der Tabulatorreihenfolge

**`src/docs/DocsLayout.jsx:277`, `:263-268`**

Die Seitenleiste wird auf schmalen Bildschirmen nur aus dem Bild geschoben (`max-md:-translate-x-full`, Zeile 277). Sie wird nicht auf „unwirksam" gesetzt und nicht aus dem Bedienbaum genommen.

Zusätzlich ist die abdunkelnde Fläche hinter dem geöffneten Menü (Zeile 263-268) ein reines Klickziel ohne Tastaturzugang, und es gibt für das mobile Menü **keine Escape-Behandlung** (geprüft: `Escape` kommt in `src/docs/` nur in `Overlay.jsx:21` vor).

**Folge:** Wer auf einem Telefon oder Tablet mit einer Tastatur arbeitet, tabuliert bei geschlossenem Menü durch 43 Links, die nicht zu sehen sind — der Fokus verschwindet aus dem sichtbaren Bereich. Ist das Menü offen, lässt es sich mit der Tastatur nicht schließen.

## 10. Der Fokus springt aus dem Suchfeld, und das Scrollen wird zu früh freigegeben

**`src/docs/Overlay.jsx:45`, `:42`**

Die Überlagerung führt den Schließ-Rückruf in ihrer Abhängigkeitsliste (Zeile 45). Dieser Rückruf wird in `src/docs/DocsLayout.jsx:319` bei jedem Neuzeichnen des Layouts frisch erzeugt. Jedes Neuzeichnen reißt daher die gesamte Verdrahtung ab und baut sie neu auf — und das Aufräumen setzt den Fokus zurück auf den Auslöser (Zeile 43).

Zeile 42 gibt außerdem das Seiten-Scrollen bedingungslos wieder frei, obwohl `src/docs/DocsLayout.jsx:170` dieselbe Eigenschaft für das mobile Menü besitzt.

**Folge:** Ändert sich während der geöffneten Suche irgendetwas am Layout — Fensterbreite über die Schwelle von 768 px, ein anderes geöffnetes Menü —, springt der Schreibcursor aus dem Suchfeld heraus. Und wer bei geöffnetem mobilem Menü die Suche öffnet und wieder schließt, kann danach hinter dem noch offenen Menü scrollen.

## 11. Beim Verbreitern des Fensters bleibt eine Abdunklung ohne Inhalt stehen

**`src/docs/Drawer.jsx:11` mit `src/docs/Overlay.jsx:48-51`**

Die Schublade mit dem Inhaltsverzeichnis trägt `md:hidden` — aber nur auf dem Inhaltsfeld. Der bildschirmfüllende Rahmen und die Abdunklung der Überlagerung tragen es nicht. Ein Schließen beim Verbreitern gibt es nicht (geprüft: `src/docs/PageLayout.jsx` hat keine Fensterüberwachung dafür).

**Folge:** Wer auf einem schmalen Fenster das Inhaltsverzeichnis öffnet und dann das Fenster verbreitert, sieht eine graue Abdunklung über der ganzen Seite, ohne Panel und ohne Schließen-Knopf. Das Scrollen bleibt gesperrt. Escape oder ein Klick auf die Abdunklung lösen es auf — sichtbar kaputt ist es trotzdem.

## 12. Zehn Komponenten tragen deutsche Oberflächentexte fest verdrahtet

**Fundstellen mit fester Beschriftung ohne jede Eigenschaft zum Überschreiben:**

| Komponente | Fundstelle | Text |
|---|---|---|
| `Accordion` | `Accordion.jsx:76` | „Alle aufklappen" / „Alle zuklappen" |
| `Breadcrumb` | `Breadcrumb.jsx:98` | „Weitere Ebenen anzeigen" |
| `CodeSnippet` | `CodeSnippet.jsx:171` | „Weniger anzeigen" / „Alle N Zeilen anzeigen" |
| `DataTable` | `DataTable.jsx:128`, `:209` | „Alle auswählen" / „Auswahl aufheben" / „Zeile auswählen" |
| `DatePicker` | `DatePicker.jsx:10-12`, `:141`, `:147`, `:155`, `:168`, `:178`, `:182`, `:253`, `:263`, `:274`, `:333` | Monats- und Wochentagsnamen, „Kalender", „Vorheriger Monat", „Monat und Jahr wählen", „Nächster Monat", „Vorheriges Jahr", „Nächstes Jahr", „Schnellauswahl", „Zurücksetzen", „Kein Zeitraum", „Datum zurücksetzen" |
| `Loading` | `Loading.jsx:25` | „Wird geladen" |
| `Notification` (Toast) | `Notification.jsx:169` | „Schließen" — die eingebettete Form hat dafür die Eigenschaft `closeLabel` (`:28`), der Toast nicht |
| `NumberInput` | `NumberInput.jsx:141` | „Erhöhen" / „Verringern" |
| `Search` | `Search.jsx:66`, `:70`, `:226`, `:241`, `:280` | „Letzte Suchen", „Vorschläge", „Suche leeren", „Keine Treffer", „Aus dem Verlauf entfernen" |
| `TextInput` | `TextInput.jsx:129`, `:139` | „Passwort anzeigen" / „Passwort verbergen", „Feld leeren" |

**Folge:** Ein fremdes Projekt, das die Bibliothek in einer anderen Sprache oder mit eigener Wortwahl einsetzt, kann diese Texte nicht ändern. Sie erscheinen unverändert auf Deutsch — teils sichtbar, teils nur für Vorleseprogramme.

**Einordnung:** Das ist keine neue Verschlechterung. Dieselbe Session hat für genau dieses Muster **19 Beschriftungs-Eigenschaften mit Vorgabewert** an `Pagination`, `Select` und `ContainedList` ergänzt, und `CodeSnippet` (`copyLabel`, `copiedLabel`), `DataTable` (`emptyText`), `Breadcrumb` (`ariaLabel`), `DatePicker` (`placeholder`, `summaryLabel`) und `Notification` (`closeLabel`) haben das Muster bereits teilweise. Die Liste oben sind die Stellen, die dabei nicht erfasst wurden.

**Betrifft das ausgelieferte Paket.**

## 13. Der Kontrastbericht zeigt überholte Werte und widerspricht sich selbst

**`scripts/contrast/specials.mjs:27`, `:29`, `:31-33`, `:41`, `:46` · `scripts/contrast/page.mjs:703`, `:741`, `:366-371` · `scripts/contrast/report.mjs:366`, `:225-232`**

Das Kontrastwerkzeug erzeugt zwei Dokumente (`docs/dark-palette-vorschlag.md` und `.html`). In beiden stehen Zahlen, die von Hand in die Skripte geschrieben wurden und nicht aus den Tokens stammen — und genau diese Zahlen sind in dieser Session geändert worden:

- `specials.mjs:27` sagt, der helle Fokusring sei `#00726559` (35 Prozent Deckkraft). Der tatsächliche Token ist `#007265bf` (75 Prozent, `src/styles/medo/semantic-colors.css:47`). Dasselbe bei `:41` für den Fehler-Ring.
- Die Begründung darunter (`:31-33`) argumentiert vollständig aus dem alten 35-Prozent-Wert. Im **selben erzeugten Dokument** steht in `docs/dark-palette-vorschlag.md:494` das Gegenteil: „Das helle Theme … liegt seit Fall A bei 75 %".
- `page.mjs:703` leitet die Liste der Unterschreitungen mit „Zwei Kombinationen bleiben unter ihrer Schwelle" ein. Nachgerechnet ist es **genau eine** (`--medo-input-border` auf `--medo-input-bg`).
- `page.mjs:741` und `report.mjs:366` nennen als Herkunft der Werte die Datei `scripts/contrast/dark-palette.mjs`. Diese Datei **gibt es nicht** (der Ordner hat zehn Dateien, keine davon).

**Folge:** Die beiden Dokumente, die als Entscheidungsvorlage für die Farbarbeit dienen, zeigen einen Bestand, den es nicht mehr gibt, widersprechen einander und verweisen auf eine Datei, die niemand öffnen kann. Wer darauf eine Entscheidung stützt, entscheidet über einen alten Stand.

## 14. Drei Zusicherungen können niemals fehlschlagen

**`src/components/Slider/Slider.test.jsx:33-36` und `:46-49` · `src/components/ContainedList/ContainedList.test.jsx:172-173`**

Alle drei Prüfungen laufen über eine Liste von Elementen, die aus dem gerenderten Ergebnis gesammelt wird — ohne vorher zuzusichern, dass die Liste nicht leer ist. Ist sie leer, läuft die Schleife null Mal durch und der Test ist grün.

Besonders bitter bei `Slider.test.jsx:46-49`: der Kommentar darüber (Zeile 39-40) beschreibt den Fehler ausdrücklich als „stumm" — die Zusicherung dagegen ist es ebenfalls. Es ist genau der Test, der Befund 2 für den Slider absichern soll.

**Folge:** Verschwinden die Teilstriche des Schiebereglers oder die Personenkreise der Liste, oder wird nur eine Klasse umbenannt, bleiben diese drei Tests grün und melden nichts. Die Absicherung, für die sie geschrieben wurden, besteht dann nicht mehr — ohne dass es jemand merkt.

Die Nachbartests machen es richtig: `Slider.test.jsx:21` und `:66` sichern die Anzahl vorher zu, `ContainedList.test.jsx:165` ebenso.

## 15. Fünfzehn Komponenten haben keine eigene Testdatei

**Ohne eigene Testdatei:** `Accordion`, `Breadcrumb`, `Button`, `Field`, `Icon`, `InlineLoading`, `Link`, `List`, `Loading`, `MenuButtons`, **`Popover`**, `ProgressBar`, `ProgressIndicator`, `Tag`, **`Tooltip`**. (`Dropdown` hat `MenuList.test.jsx`.)

Bei den anzeigenden Komponenten ist das vertretbar. Bei sechs davon nicht: `Accordion` (Tastaturwege), `Breadcrumb` (Aufklappen, Klick nach außen), `Button` (Klicksperre bei gesperrt und ladend), `MenuButtons` (Menüzustand), **`Popover`** (Portal, Positionierung, Escape, Klick nach außen) und **`Tooltip`** (Verzögerungstimer, Portal).

**Folge:** Bei diesen sechs gibt es nichts, was rot werden könnte. Der schwerste Befund dieses Berichts — Befund 1 — sitzt in genau der Komponente, die keinen einzigen Test hat. Er wäre von einem Test über Öffnen und Scrollen sofort gefunden worden.

## 16. Der Kopierknopf im Portal meldet Erfolg, auch wenn nichts kopiert wurde

**`src/docs/CodeBlock.jsx:12`, `:14`**

Der Kopiervorgang wird angestoßen, sein Ergebnis aber nicht abgewartet und nicht geprüft (Zeile 12). Die Erfolgsmeldung wird unabhängig davon gesetzt (Zeile 13). Der Rückstell-Timer (Zeile 14) wird beim Verlassen der Seite nicht abgeräumt und bei einem zweiten Klick nicht zurückgesetzt.

**Folge:** In einem Umfeld, in dem der Browser das Kopieren verweigert (unverschlüsselte Verbindung, eingebettete Ansicht), zeigt der Knopf „Kopiert", obwohl die Zwischenablage leer ist. Wer darauf vertraut und einfügt, fügt etwas anderes ein. Bei zwei Klicks kurz nacheinander springt die Beschriftung zu früh zurück.

## 17. Jede Abschnittsüberschrift im Portal bekommt ihre Kennung doppelt

**`src/docs/PageLayout.jsx:78-79` mit `:197-198`**

Der Abschnitts-Rahmen erzeugt seine Kennung aus dem Titel (Zeile 198). Die Überschrift darin trägt denselben Text; Zeile 78-79 erzeugt daraus nachträglich dieselbe Kennung ein zweites Mal und setzt sie auf die Überschrift. Beide Elemente haben danach dieselbe Kennung — das ist ungültiges HTML.

Der zweite Teil: durch die Sperre `if (!el.id)` wird die einmal gesetzte Kennung nie erneuert. Beim zweiten Durchlauf greift Zeile 74 dann die Überschrift statt des Abschnitts ab; der Abstand beim Anspringen und die Beobachtung für die aktive Markierung landen auf der schmalen Überschrift statt auf dem Abschnitt.

**Folge:** Heute noch weitgehend folgenlos, weil beide Kennungen gleich lauten und das Anspringen die erste findet. Sobald die Sprache umschaltbar wird, behält die Überschrift die Kennung der alten Sprache — Inhaltsverzeichnis und Suchtreffer zeigen dann ins Ungefähre. Die aktive Markierung im Inhaltsverzeichnis kann schon heute hängenbleiben, weil eine Überschrift schmaler ist als ihr Abschnitt.

## 18. Das Vollständigkeitstor des Paket-Builds kann grün melden, obwohl etwas fehlt

**`scripts/build-package.mjs:116`**

Das Tor prüft, ob jeder Name aus einem Komponenten-Stylesheet im gebündelten Stylesheet vorkommt — per Teilzeichenketten-Vergleich. Klassennamen desselben Blocks sind aber Präfixe voneinander: allein in `Accordion.css` ist `.medo-acc` Präfix von `.medo-acc__head`, `.medo-acc__mark` von `.medo-acc__mark--chevron` und `.medo-acc__panel` von `.medo-acc__panel--open` (nachgezählt: 3 Präfixpaare bei 19 Klassen). Dasselbe gilt für Tokennamen: `--medo-action` ist Präfix von neun weiteren.

**Folge:** Geht beim Bündeln eine Regel verloren, deren Name Präfix eines überlebenden Namens ist, meldet das Tor trotzdem „vollständig". Genau der Fall, den es abfangen soll, kommt durch.

Zwei weitere Tore derselben Datei können ebenfalls nicht rot werden: Zeile 86 nimmt ein umbenanntes oder gelöschtes Stylesheet stillschweigend aus der Prüfliste (heute greift der Filter bereits einmal — `Icon` hat kein Stylesheet), und Zeile 70-78 prüft eine Liste, die leer sein kann, während Zeile 208 und 211 den Erfolg bedingungslos melden.

## 19. Der Index-Generator schreibt zwei Dateien bei jedem Lauf komplett um

**`scripts/generate-search-index.mjs:32-35` und `:37-49`**

`src/config/searchData.js` und `src/config/sectionData.js` liegen im Arbeitsbaum mit CRLF-Zeilenenden vor (nachgemessen: 344 bzw. 1174 CR bei gleicher Zeilenzahl). Der Generator schreibt reines LF. Eine `.gitattributes`-Regel für `src/` gibt es nicht.

**Folge:** Jeder Lauf von `npm run search-index` schreibt beide Dateien vollständig auf LF um. **Das ist die Ursache des bekannten Rätsels**, dass `git status` nach dem Lauf Änderungen an beiden Dateien meldet, ohne dass ein inhaltlicher Unterschied zu sehen ist. Solange das so bleibt, muss man bei jedem Lauf von Hand unterscheiden, ob eine echte Änderung darin steckt.

Dieselbe Datei hat einen zweiten Befund: Zeile 17 und 51 sichern nirgends zu, dass der erzeugte Index nicht leer ist. Rendern die Seiten wegen eines Umbaus nichts mehr, werden beide Dateien mit leeren Listen überschrieben, das Skript endet erfolgreich und meldet „0 page/tab entries". Die Suche im Portal fiele dann still aus.

## 20. Zwei Zeilenaktionen sind mit der Tastatur nicht auslösbar

**`src/components/ContainedList/ContainedList.jsx:124-135` · `src/components/DatePicker/DatePicker.jsx:329-339`**

In beiden Fällen liegt ein zweites Bedienelement **innerhalb** einer Schaltfläche (`ContainedList.jsx:81`, `DatePicker.jsx:313`) und trägt `tabIndex={-1}`. Ein Bedienelement in einem Bedienelement ist ungültiges HTML; das `tabIndex={-1}` nimmt es zusätzlich aus der Tastaturreihenfolge.

Dass es anders gemeint war, zeigt das Referenz-Stylesheet: `design-reference/ui/ContainedList.jsx:126` definiert einen Fokusrahmen für ein Element, das den Fokus nie bekommen kann.

**Folge:** Die Zeilenaktion der Liste (der Rückruf `onAction`) und das Zurücksetzen im Datumsfeld sind ausschließlich mit der Maus erreichbar. Wer mit der Tastatur arbeitet, kommt nicht heran. Vorleseprogramme melden je nach Hersteller nur ein Bedienelement oder lassen die Beschriftung fallen.

**Herkunft:** Beide stehen wortgleich im Referenzcode. Eine Berichtigung führt über das Design-Projekt.

**Betrifft das ausgelieferte Paket.**

## 21. Die aktive Auswahl im Auswahlfeld wandert nicht mit nachgeladenen Einträgen

**`src/components/Select/Select.jsx:210-213`**

Die Rücksetzung des aktiven Eintrags hängt allein am Suchbegriff (Zeile 213), benutzt aber die aktuelle Eintragsliste und den Offen-Zustand.

**Folge:** Ändert sich die Liste bei geöffnetem Feld, ohne dass jemand tippt — nachgeladene Einträge, eine von außen gesteuerte Filterung —, bleibt die Hervorhebung auf dem alten Platz stehen. Sie kann dann auf einen Eintrag zeigen, den es nicht mehr gibt; Vorleseprogramme verlieren den aktiven Eintrag.

---

# Leicht

Kleinere Ungenauigkeiten, veraltete Angaben und Stellen, an denen etwas nur unter seltenen Umständen auffällt.

## 22. Es sind 36 überschreibbare Zustandsangaben, nicht 34

**`src/components/Button/Button.jsx:62`, `:63`** (neu) — plus die 34 aus der bekannten Liste, die ich nachgezählt und **unverändert bestätigt** habe.

Die bekannte Erhebung hat die Attributliste im JSX abgesucht. `Button` baut seine Eigenschaften aber in einem Objekt zusammen; die beiden Angaben `aria-disabled` und `aria-busy` stehen dort vor der Zusammenführung und waren deshalb nicht sichtbar. Eine gezielte Suche nach diesem Muster findet genau diese eine zusätzliche Stelle.

**Folge:** Ein Aufrufer, der `aria-disabled` an einen Button durchreicht, überschreibt den echten Zustand. Vorleseprogramme melden dann einen bedienbaren Knopf, obwohl er gesperrt ist oder lädt. Wie bei den 34 bekannten: unschön, aber nicht schädlich in dem Sinn, in dem die drei früher behobenen es waren.

**Ausdrücklich geprüft und verworfen:** Die Klick-Behandlung des Buttons ist **nicht** überschreibbar — `onClick` wird in `Button.jsx:26` herausgelöst und kann über die Restangaben nicht zurückkommen. Der Befund „kein Ereignisbehandler ist mehr verdrängbar" gilt weiter.

## 23. Ein Textfeld verschluckt die Null als Startwert

**`src/components/TextInput/TextInput.jsx:47`**

`useState(defaultValue || '')` behandelt die Zahl 0 wie „nicht gesetzt".

**Folge:** `<TextInput defaultValue={0} />` startet leer statt mit „0". Bei Mengen- und Betragsfeldern ist das der wahrscheinlichste Startwert überhaupt.

Die Schwesterkomponente `Textarea` hatte denselben Fehler, er ist dort behoben und mit einem Test abgesichert (`src/components/Textarea/Textarea.test.jsx:64`). `TextInput` hat beides nicht.

**Betrifft das ausgelieferte Paket.**

## 24. Sechs Rollennamen sind im englischen Portal deutsch

**`src/i18n/locales/en.json`, Namensraum `tag.roles`**

„Neutral", „Primär", „Erfolg", „Warnung", „Fehler", „Hinweis" — wortgleich mit der deutschen Fassung.

**Folge:** Auf `/tag` stehen im englischen Portal deutsche Rollennamen.

**Einordnung:** Das ist der **einzige** solche Fall. Ein vollständiger Abgleich beider Sprachdateien (je 2809 Schlüssel, keiner fehlt auf einer Seite) fand 132 wörtlich deutsche Werte in der englischen Datei — 131 davon sind Demo-Inhalte, und die sind nach Projektregel auf Deutsch. Nur `tag.roles` fällt heraus.

## 25. Ein Tab-Panel kann auf eine Überschrift zeigen, die es nicht gibt

**`src/components/Tabs/Tabs.jsx:196` mit `:29-30`**

Die Verknüpfung des Panels zeigt auf die Kennung des aktiven Reiters. Ist die Reiterliste leer oder wird sie nachgeladen, bleibt der aktive Wert unbestimmt; ein von außen gesteuerter Wert, der in der Liste fehlt, hat dieselbe Wirkung.

**Folge:** Das Panel hat dann keinen Namen. Vorleseprogramme lesen es unbenannt vor.

## 26. Lange Code-Beispiele werden auch aufgeklappt abgeschnitten

**`src/components/CodeSnippet/CodeSnippet.jsx:150` mit `src/components/CodeSnippet/CodeSnippet.css:68`**

Im aufgeklappten Zustand ist die Höhe fest auf 1600 Pixel begrenzt, und der Rahmen schneidet Überstehendes ab (`overflow: hidden`), ohne zu scrollen.

**Folge:** Ein Code-Beispiel mit mehr als etwa 73 Zeilen bleibt auch nach „Alle N Zeilen anzeigen" abgeschnitten. Der Rest ist auf keinem Weg zu sehen.

**Betrifft das ausgelieferte Paket.**

## 27. Geschlossene Aufklappbereiche bleiben mit der Tastatur erreichbar

**`src/components/Accordion/Accordion.jsx:131-137` mit `src/components/Accordion/Accordion.css:51-57`**

Geschlossene Bereiche werden nur auf die Höhe null gefahren, nicht ausgeblendet und nicht auf „unwirksam" gesetzt.

**Folge:** Enthält ein geschlossener Bereich Links oder Schaltflächen, tabuliert man mit der Tastatur hinein, ohne etwas zu sehen. Der Fokus verschwindet.

**Herkunft:** Referenzcode (`design-reference/ui/Accordion.jsx:63-69`), wortgleich.

## 28. Ein Schwellenwert im Kontrastwerkzeug wird von niemandem benutzt

**`scripts/contrast/roles.mjs:13`**

`'text-large': 3` steht in der Schwellenliste. Die Zeichenkette `text-large` kommt im gesamten Projekt nur in dieser einen Zeile vor; keine Rolle und keine Paarung benutzt sie.

Verschärfend: `scripts/contrast/page.mjs:86` schreibt die Schwellenwerte ab, statt sie zu importieren — dort fehlt `text-large` ganz, und ein unbekannter Wert wird wie „nur informativ" behandelt, also als bestanden dargestellt.

**Folge:** Ein Schwellenwert, den man für gepflegt hält, wirkt nirgends. Und eine Änderung an den Schwellen wirkt im Markdown-Bericht, nicht aber in der HTML-Seite — beide Dokumente behaupten dann Unterschiedliches.

## 29. Das Werkzeug für den Suchindex steht in keiner Abhängigkeitsliste

**`package.json:31`**

`npm run search-index` ruft `vite-node` auf. Dieses Werkzeug ist weder unter `dependencies` noch unter `devDependencies` aufgeführt; es liegt nur als Mitbringsel von `vitest` im Projekt.

**Folge:** Trennt eine künftige Testwerkzeug-Version das Mitbringsel ab, bricht `npm run search-index` mit „command not found" — ohne dass vorher ein Test oder eine Sperrdatei darauf hingewiesen hätte.

## 30. Ein Prüfskript sucht seine Dateien im falschen Verzeichnis

**`scripts/verify-build.mjs:17`**

Als einziges Skript im Ordner bestimmt dieses seine Pfade relativ zum Aufrufverzeichnis statt zum eigenen Ort (vergleiche `scripts/build-package.mjs:20` und `scripts/contrast/tokens.mjs:14-15`).

**Folge:** Aus einem anderen Verzeichnis aufgerufen, bricht es ab oder prüft — schlimmer — ein fremdes Build-Verzeichnis. Über `npm run build` läuft es heute richtig.

## 31. Der stumme Zerstörer aus dem letzten Arbeitsgang hat noch eine Fundstelle

**`scripts/contrast/tokens.mjs:88`**

`next.replace(match[0], replacement)` — `replacement` ist ein aus einer CSS-Datei gelesener Tokenwert, also variabler Inhalt. Enthielte ein Tokenwert die Zeichenfolge `$'`, `$&`, `` $` `` oder `$1`, würde nicht der Wert eingesetzt, sondern ein Teil des umgebenden Textes.

**Folge:** Heute **nicht wirksam** — kein Tokenwert im Projekt enthält ein Dollarzeichen. Es ist die einzige verbliebene Stelle dieser Fehlerklasse im Projekt, und sie sitzt in der Auflösung der Farbwerte: träte sie ein, käme eine falsche Farbe heraus, ohne dass etwas anschlägt.

## 32. Zwei Timer im Portal werden nicht abgeräumt

**`src/docs/DocsSearch.jsx:49` · `src/docs/CodeBlock.jsx:14`**

Beide Timer laufen weiter, auch wenn die Seite gewechselt oder die Komponente entfernt wird.

**Folge:** Wer innerhalb von 100 Millisekunden nach der Auswahl eines Suchtreffers weiternavigiert, springt auf der neuen Seite zu einem zufällig passenden Anker oder ins Leere.

## 33. Die Regel zu den Portalen im Projekt-Regelwerk ist unvollständig

**`src/docs/Overlay.jsx:49`**

Das Regelwerk sagt: „Portale liegen ausschließlich in `Modal`, `Popover` und `Tooltip`." Nachgezählt gibt es ein viertes: `src/docs/Overlay.jsx:49` im Portal-Chrome. `Menu` benutzt tatsächlich kein Portal (`src/components/Menu/Menu.css:3`: `position: fixed; z-index: 1000`) — dieser Teil der Regel stimmt.

**Folge:** Wer sich beim Prüfen auf die Regel stützt, prüft `Overlay` mit dem falschen Verfahren und bekommt leeres Ergebnis, das wie ein Fehler aussieht. Der Befund in `Overlay` (Nummer 10) hätte daran vorbeirutschen können.

---

# Bekannte Befunde — auf Aktualität geprüft

Diese Punkte waren bereits erhoben. Ich habe sie nicht neu untersucht, sondern nur geprüft, ob sie noch gelten.

| Punkt | Stand heute |
|---|---|
| **34 überschreibbare `aria`-Angaben** | **Gilt, aber es sind 36** — siehe Befund 22. Die 34 bekannten sind unverändert, Zeile für Zeile nachgezählt. |
| **`DocsSearch.test.jsx` „walks the results with the arrow keys" am Zeitlimit** | Gilt. Im Lauf für diesen Bericht 3854 ms bei einem Limit von 5000 ms. Lastabhängiger Wackler, keine Regression. |
| **Favicon ohne Testdeckung, einzelnes SVG** | Gilt unverändert. `public/` enthält genau zwei Dateien. |
| **`public/logo-medo.svg` verwaist** | Gilt. Kein Verweis darauf in `src/`, `index.html` oder `scripts/`. Löschen bleibt Schritt des Inhabers. |
| **Schalter „Scrollable" aus der Tabs-Demo entfernt** | Gilt. Die Eigenschaft steht weiter im Vertrag und ist weiter wirkungslos: ein Abgleich aller **515** deklarierten Eigenschaften gegen die Umsetzungen findet **genau diese eine**, die entgegengenommen und nie gelesen wird. |
| **Kein Linter im Projekt** | Gilt. Keine Konfiguration, kein Skript, keine Abhängigkeit. |
| **Verbleibende AA-Unterschreitung** | Gilt: `--medo-input-border` auf `--medo-input-bg`, Schwelle 3,00:1, hell 2,23:1, dunkel 2,65:1. Nachgerechnet, es ist genau **eine** — siehe Befund 13. Gelockter Beschluss des Design-Projekts, kein neuer Befund. |
| **Widersprüchlicher `Tabs`-Kommentar** | **Erledigt.** Nicht mehr als Befund geführt. |

---

# Was ausdrücklich geprüft und **nicht** gefunden wurde

Diese Fehlerklassen sind gesucht worden, weil sie im Projekt belegt aufgetreten sind. Sie kommen heute nicht mehr vor. Das ist eine Aussage über den Zustand, keine Lücke.

- **Doppelt belegte CSS-Präfixe.** Alle 36 Komponenten-Stylesheets ausgewertet. Drei Klassennamen kommen in mehr als einer Datei vor (`.medo-field__box`, `.medo-field__box--focus`, `.medo-field__control`) — jedes Mal als Nachschärfung mit höherer Spezifität (`.medo-num .medo-field__box`, `.medo-ti-float .medo-field__box`, `.medo-search__box--compact.medo-field__box--focus`), nie als stille Überschreibung. Keine Kollision.
- **Die Tailwind-Fläche, die gegen `bg-transparent` in der Basisklasse verliert.** Eine Suche über alle Klassenzeichenketten in `src/docs/`, `src/pages/` und `src/` findet keine weitere Stelle dieser Bauart. Die Suche wurde gegengeprobt, indem ihr der bekannte Fall untergeschoben wurde — sie findet ihn. Die vier verbliebenen `bg-transparent` stehen ausschließlich gegen Zustandsvarianten mit echter Mehr-Spezifität.
- **Anzahl-Zusicherungen über nackte Zeichenketten.** Keine einzige in den 37 Testdateien. Alle Mengenzusicherungen laufen über Rollen-Abfragen, Klassen-Token-Selektoren oder geparste Daten. `src/styles/theme-pairs.test.js:79-85` schreibt die Regel sogar aus.
- **`react-dom/server` auf einer Portal-Komponente.** Kommt in `src/` nirgends vor; alle Tests rendern client-seitig.
- **Bedingte Hook-Aufrufe, Hooks ohne `use`-Präfix, `Math.random()` als Kennung, Element-Listen ohne Schlüssel.** Kein Fund in 37 Komponenten, 19 Chrome-Dateien und 45 Seiten.
- **Nicht auflösbare Verweise.** Alle Importe, alle 46 Routen gegen 45 Seitendateien, alle Navigationsziele, alle Bildpfade, alle `--docs-*`-Variablen und alle statisch erfassbaren Übersetzungsschlüssel gegen beide Sprachdateien — bis auf die sieben aus Befund 7 löst alles auf.
- **Übersprungene, allein laufende oder zusicherungslose Tests.** Keine.
- **Fehlendes `await`, `userEvent` mit falschen Zeitgebern.** Keine Verstöße.
- **Inline-Kurzformen mit Token-Werten** außer den fünf aus Befund 2. In den Doku-Seiten stehen drei weitere (`src/pages/BrandColorsPage.jsx:52`, `src/pages/FoundationsPage.jsx:91` und `:135`), alle mit einwertigen Angaben; sie fallen nicht unter die Regel, die sich auf die Komponenten bezieht.
- **Lücken im Dunkelmodus.** Alle 67 festen Farbwerte in den Komponenten-Stylesheets gegen `src/styles/medo-theme-components.css` abgeglichen: jede hat entweder eine Dunkel-Entsprechung oder ist erklärtermaßen themenunabhängig (die dunkle Code-Fläche, weiße Auflagen auf gefüllten Statusflächen, die Tooltip-Schrift). Keine Lücke.

---

# Hinweis zur Herkunft

Drei Befunde stammen nicht aus dem Port, sondern aus dem Referenzmaterial und stehen dort wortgleich: Befund 4 (Datumsfeld), Befund 20 (beide Zeilenaktionen) und Befund 27 (Aufklappbereiche). Der Port ist an diesen Stellen getreu. Eine Berichtigung im Repository allein würde beim nächsten Spiegeln verlorengehen — der Weg führt über das Design-Projekt.
