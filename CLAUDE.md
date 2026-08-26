APM_RULES {

## Kommunikation

- Auf Deutsch antworten. Code, Variablen-/Funktionsnamen und Code-Kommentare auf Englisch.
- Antworten kurz und präzise halten. Nach Abschluss dokumentieren, was getan wurde und was die nächsten Schritte sind.
- Keine unnötigen Code-Kommentare — nur kommentieren, wenn das *Warum* nicht offensichtlich ist.
- Bei Kontext über 50 %: neue Konversation oder Subagenten für unabhängige Aufgaben vorschlagen; Datei-Reads statt Einfügen großer Inhalte, Recherche in Subagenten.

## Code-Qualität

- Nachhaltigen, wartbaren Code schreiben. Klarheit und Wiederverwendbarkeit vor Cleverness.
- Keine halbfertigen Implementierungen — jeder gelieferte Stand ist funktionsfähig.
- Kein Error-Handling, keine Fallbacks, keine Validierung für Szenarien, die nicht eintreten können. Nur an Systemgrenzen validieren (User-Eingaben, externe APIs).

## Referenzmaterial

- `design-reference/` ist der Spiegel des medo-Design-Projekts. Verbindlichkeit bei Widersprüchen (absteigend): `design-reference/CLAUDE.md` (gelockte Beschlüsse) → `design-reference/components/<Name>.dc.html` (Spezifikation pro Komponente) → `design-reference/ui/<Name>.jsx` / `.d.ts` / `.prompt.md` (Referenzcode, Props-Vertrag, Nutzungsregeln). **Die Spezifikationsdateien heißen nicht `<Name>.dc.html`**, sondern in Bindestrich-Schreibweise mit kleingeschriebenem zweitem Wort: `Code-snippet.dc.html`, `Contained-list.dc.html`, `Date-picker.dc.html`, `File-uploader.dc.html`, `Text-input.dc.html`, `Radio-button.dc.html` (für `Radio`) und so fort. Vor dem Zugriff den Namen in `design-reference/components/` nachsehen.
- **`design-reference/` wird nie von Hand editiert.** Der Spiegel ändert sich ausschließlich durch Neuspiegelung aus dem Design-Projekt. Eine Änderung, die direkt in `design-reference/` geschrieben wird, ist beim nächsten Spiegeln verloren und lässt Quelle und Spiegel stillschweigend auseinanderlaufen.
- Die Referenz ist maßgeblich, nicht Ausgangspunkt für Vereinfachungen: Verhalten, Zustände und Details vollständig übernehmen. Jede in der `.d.ts` deklarierte Prop/Variante muss funktionieren.
- **Portierte Komponenten werden nicht additiv erweitert.** Eine Prop, die die `.d.ts` nicht kennt, gehört nicht in den Port — auch nicht als „dokumentierte Abweichung", auch nicht, wenn sie einen echten Bedarf löst. Der Weg für einen echten Bedarf führt über den Vertrag im Design-Projekt (siehe „Schreiben ins Design-Projekt"), nie am Vertrag vorbei.
- Das Referenzmaterial enthält echte Implementierungsfehler: bedingte Hooks hinter `||`, Hooks ohne `use`-Präfix, veraltete Closure-Werte in Timern und Drag-Handlern, `Math.random()`-IDs, `aria-describedby` auf nicht gerenderte IDs, Element-Arrays ohne `key`. Portieren heißt prüfen, nicht abschreiben.
- Behauptet eine Aufgabenbeschreibung eine interne Abhängigkeit, die der Referenzcode nicht hat, gilt das Material. Die `.d.ts` beschreibt den Vertrag nach außen, nicht den Aufbau innen.
- Fehlt ein Token oder eine Angabe, oder widerspricht sich Material: an den Manager eskalieren und auf Klärung warten. Nie Werte erfinden, nachrechnen oder improvisieren.

## Schreiben ins Design-Projekt

Gilt für jede Arbeit, die Tokens, Props-Verträge, Komponentenverhalten oder Spezifikationsseiten ändert.

- **Die Richtung ist festgelegt: oben beginnen.** Die Kette lautet Design-Projekt → `design-reference/` → `src/` → Doku-Seite → Test, in dieser Reihenfolge. Eine Änderung, die in `src/` beginnt und nach oben nachgereicht wird, ist ein Regelverstoß — außer die Aufgabenbeschreibung kehrt die Richtung ausdrücklich und begründet um.
- **Nie schreiben, solange die Sicherung des Design-Projekts nicht nachweislich vollständig vorliegt.** Das Projekt liegt außerhalb der Versionskontrolle; Git schützt dort nicht, und ein Fehlgriff wirkt sofort auf alles, was daran hängt.
- **Vor jedem Schreibvorgang den konkreten Vorschlag dem Inhaber vorlegen und die Freigabe abwarten** — was sich in welcher Datei ändert und was dadurch sichtbar anders wird. Eine allgemeine Freigabe des Themas ersetzt die Freigabe des Vorschlags nicht.
- **Nach dem Schreiben neu spiegeln, nicht nachführen.** Die acht Token-Dateien unter `src/styles/medo/` sind CRLF, die Quelle LF — rohe Prüfsummen taugen nicht als Integritätsnachweis; maßgeblich ist der Inhaltsvergleich nach Normalisierung der Zeilenenden.
- Eine Vertragsänderung berührt im Design-Projekt in aller Regel mehr als eine Datei: `ui/<Name>.d.ts`, meist auch `ui/<Name>.jsx`, `ui/<Name>.prompt.md` und die Spezifikationsseite unter `components/`. Wer nur die `.d.ts` ändert, hinterlässt eine Quelle, die sich selbst widerspricht.
- Berührt eine Änderung einen in `design-reference/CLAUDE.md` gelockten Beschluss, ist das dem Inhaber ausdrücklich zu benennen, bevor geschrieben wird.
- **Ein neu entdeckter Rückläufer wird protokolliert und vorgelegt, nicht eigenmächtig mitgeschrieben.** Die Öffnung gilt für die zugewiesenen Punkte, nicht als Generalvollmacht.

## Verträge und ausgelieferter Code

- **Eine Typprüfung wird ausgeführt, nicht behauptet.** Wer einen Props-Vertrag anlegt oder ändert, belegt seine Gültigkeit mit einem tatsächlich gelaufenen Prüfschritt und dessen Ausgabe.
- **Kollisionen mit HTML-Attributen sind die häufigste Fehlerklasse in Verträgen.** `prefix?: React.ReactNode` gegen das HTML-Attribut `prefix?: string` erzeugt TS2430 und zwingt Abnehmer zu `skipLibCheck: true`. Jeden neuen Prop-Namen gegen die Attribute des zugrundeliegenden Elements prüfen.
- **Eine neue Prop an bereits ausgeliefertem Code braucht einen Vorgabewert.** Das Paket ist in fremden Projekten eingebunden; eine Prop ohne Vorgabewert hinterlässt dort leere Beschriftungen oder fehlendes Verhalten, ohne dass etwas bricht. `aria-label`-Texte zählen als Oberflächentexte, auch wenn sie nicht sichtbar sind.
- Komponenten binden **kein** `react-i18next` ein. Übersetzung ist Sache des Aufrufers; der Paket-Build bricht ab, wenn eine Portal-Abhängigkeit in die Bibliothek gerät.

## Port-Konventionen (Komponenten aus design-reference/ui/)

- `React.createElement`-Code in normales JSX umschreiben; Verhalten 1:1 erhalten.
- Den `MEDO_*_CSS`-String der Referenz in eine eigene Datei `src/components/<Name>/<Name>.css` extrahieren und in der Komponente importieren. CSS-Klassennamen (`medo-btn` …) und Selektoren unverändert lassen; das `injectCss`-Muster entfällt.
- **Vor dem Anlegen der CSS-Datei den Klassenpräfix gegen die bereits portierten Komponenten prüfen** (`grep` über `src/components/`). Anders als in der Referenz, wo jede Spezifikationsseite für sich läuft, landen hier alle Stylesheets in einem Bündel — ein doppelt belegter Präfix lässt zwei Komponenten einander stillschweigend überschreiben, ohne Build-Fehler. Bei einer Kollision an den Manager eskalieren; der neue Präfix wird im Design-Projekt festgelegt.
- `window.MedoUI`-Registrierung entfernen; stattdessen benannte ES-Exporte und Export über das Barrel `src/components/index.js`.
- Interne Abhängigkeiten der Referenz (z.B. Icon, Field, MenuList aus Dropdown) als ES-Imports auflösen — keine Window-Lookups, keine Ladereihenfolge-Annahmen.
- **Inline-Stile mit Token-Werten nur in Längsformen setzen** (`borderTopColor`, `borderRightColor` … statt `borderColor`). Kurzformen mit `var()`-Werten kommen unvollständig an, und der Fehler ist stumm: ein Teil der Kanten färbt sich korrekt, der Rest bleibt neutral. Betrifft jede Komponente, die Farben inline aus Tokens setzt.
- Ablage: `src/components/<Name>/<Name>.jsx` + `<Name>.css`.

## Arbeit an gemeinsam genutzten Dateien

- **Vier Dateien haben in jeder bisherigen Session bei paralleler Arbeit kollidiert:** `src/components/index.js`, `src/App.jsx`, `src/docs/DocsLayout.jsx` und `src/i18n/locales/*.json`. In allen vieren wird **additiv und punktgenau** eingefügt — nie umsortiert, nie umformatiert, nie neu gruppiert. Verlangt eine Aufgabe ausdrücklich eine Umsortierung, arbeitet sie allein an der Datei.
- **Die Sprachdateien sind spaltenausgerichtet.** Ein `JSON.parse`/`stringify`-Round-Trip zerstört tausende Zeilen, ohne dass ein Test anschlägt. Bearbeitung ausschließlich durch punktgenaues Einfügen gegen eindeutige Anker.
- Neue Routen werden als Datenzeile in `ROUTES` (`src/App.jsx`) ergänzt, nicht als `<Route>`-Element.

## Styling

- Zwei Welten, klare Grenze: Komponenten (`src/components/`) verwenden ausschließlich das portierte klassenbasierte CSS auf `--medo-*`-Tokens — kein Tailwind in Komponenten-CSS. Docs-Chrome und Seiten (`src/docs/`, `src/pages/`) verwenden Tailwind-Utilities, die ausschließlich `--medo-*`-Tokens referenzieren (z.B. `bg-[var(--medo-surface-container)]`).
- Nie Farb-, Abstands-, Radius- oder Schatten-Werte hardcoden — immer Token-Referenz. Bevorzugt semantische Tokens (Ebene 3); Brand-Stufen nur, wo die Referenz sie selbst nutzt.
- Die Zwischenwert-Regel gilt für selbst geschriebenen Code (Docs-Chrome, Doku-Seiten, neu ergänzte Komponenten-CSS). **1:1 portiertes Komponenten-CSS behält die Zahlenwerte der Referenz** — Umrechnen fiele unter das Verbot des Nachrechnens.
- Zwischenwerte, die auf keiner Token-Stufe liegen, werden im CSS aus Tokens berechnet statt hardcodiert: `calc(var(--medo-space-xs) * 0.75)` für 6px, `calc(var(--medo-space-2xl) + var(--medo-space-xs))` für 56px. Wiederkehrende Zwischenwerte bekommen eine globale Definition im `:root`-Block von `src\styles\global.css` (z.B. `--docs-header-height`, `--docs-hit-target`) und werden überall darüber referenziert, nie mehrfach ausgerechnet.
- Die Semantic-Ebene liegt als `light-dark()`-Paare in `src/styles/medo-theme.css`. `src/styles/medo-theme-components.css` trägt die dunkle Entsprechung fester Farbwerte aus dem Komponenten-CSS, alphabetisch partitioniert und mit `:root`-Präfix — die Wirkung entsteht über Spezifität, nicht über die Bündelreihenfolge.
- Alt-Tokens (`--color-brand-*`, `--space-1…32` usw.) in neuem oder geändertem Code nicht mehr verwenden; sie existieren nur noch für unmigrierte Alt-Seiten bis zum Cleanup.
- `src/styles/global.css`: EIN `@theme inline`-Block, EIN `:root`-Block, keine zirkulären `var()`-Selbstreferenzen, keine `@source`-Direktiven.

## Icons

- Ausschließlich Material Symbols Rounded, weight 300, FILL 0 — immer über die `Icon`-Komponente aus `src/components/Icon/`. Die Schrift kommt aus dem npm-Paket `material-symbols` und wird mit ausgeliefert, nicht von einem CDN. `size` ist eine freie Zahl: Standardgrößen sind 18 (neben `text-sm`), 20 (neben `text-base`, Default) und 24 (alleinstehend); kleinere Werte wie 16 nur dort, wo die Referenz sie selbst setzt (Meldungszeilen, Chips, dichte Kontexte).
- **Maßgeblich ist die Auslösefläche, nicht die Komponente:** Icons, die eine Auslösefläche begleiten (Button, Link, Dropdown-Auslöser, MenuButton, SplitButton, IconMenuButton), liegen auf sm 20 / md 22 / lg 24; der `+2`-Aufschlag der Referenz für Icon-only entfällt dabei. **Alle übrigen Icons behalten die Größen ihrer Referenzimplementierung** — Icons in Menü- und Listeneinträgen, Feld-Icons, Chips, Meldungszeilen, Tabellen. Eine Komponente kann beides enthalten. Im Zweifel: an den Manager eskalieren.
- Keine Inline-SVGs, keine Emojis als Icons, kein lucide-react oder andere Icon-Bibliotheken. **Ausnahme: die Wortmarke** (`src/docs/MedoLogo.jsx`) — sie ist kein Icon, hat keinen Weg über die `Icon`-Komponente, und als `<img>` erreicht sie weder Tokens noch den `data-theme`-Schalter. Ihre Pfaddaten stammen unverändert aus `public/logo-medo.svg`, nur die Füllungen zeigen auf Tokens.
- Bedienbare Icons in Feldern (Leeren, Passwort anzeigen, Kopieren) haben Icon-Button-Optik (Ruhefläche stone-100, Hover stone-200) und immer ein `aria-label`; dekorative Icons stehen flach im Text.

## Internationalisierung und Demo-Inhalte

- Jeder User-facing String in JSX läuft über `t()` aus `react-i18next`; jeder neue Key wird in `src/i18n/locales/de.json` **und** `en.json` eingetragen (Deutsch ist Standard, Englisch übersetzt der Worker). `tabs.*` ist reserviert für globale Tab-Labels.
- Demo-Inhalte in Komponenten-Vorschauen sind Deutsch mit „Sie"-Anrede: Buttons tragen Verb-Infinitive („Termin anlegen", nie „OK"), keine Ausrufezeichen, keine Werbesprache, keine Emojis, deutsche Formate (`1.234,56 €`, `04.08.2026`, 24h-Uhrzeit). Zahlen, Beträge, IDs und Daten stehen in DM Mono.
- Fehlermeldungs-Demos benennen Ursache und nächsten Schritt, nie nur den Zustand.

## Doku-Seiten und DemoPanel

- Jede Komponenten-Doku-Seite folgt dem 4-Tab-Muster (Overview/Usage/Code/Accessibility); Inhalte entstehen aus der jeweiligen Spezifikation in `design-reference/components/`, nicht aus Alt-Seiten.
- `<DemoPanel>` ist das erste JSX-Element im Overview-Tab-Content jeder Komponenten-Seite, vor allen `<Section>`-Elementen (Import: `import { DemoPanel } from '../docs/PageLayout'`; API: `component`-Funktion + `controls`-Array, siehe `src/docs/DemoPanel.jsx`). Die Controls decken die Varianten/Props aus der `.d.ts` der Komponente ab. Info-Seiten haben kein DemoPanel.
- Die `component`-Prop wird als **reguläre Funktion** aufgerufen, nicht als React-Komponente — darin dürfen keine Hooks stehen. Zustandsbehaftete Vorschauen gehören als Komponente auf Modulebene daneben.
- **Überschriften der Ebene h2 gehören in einen `<Section>`-Wrapper.** Steht eine `h2` außerhalb, greift die Ankersuche über `el.closest('[id]')` die ID des nächsten Vorfahren ab statt einen eigenen Anker zu erzeugen — Inhaltsverzeichnis und Suchtreffer springen dann ins Ungefähre. Der Anker-Algorithmus liegt in `src/docs/anchors.js` und ist die einzige Quelle; nicht kopieren, importieren. Dass Umlaute darin ersatzlos entfallen („Größen" wird zu `gren`), ist bekannt und bleibt unangetastet.
- **`src/config/searchData.js` und `sectionData.js` werden erzeugt, nicht gepflegt.** Nach jeder neuen, umbenannten oder entfernten Seite und nach jeder geänderten Abschnittsüberschrift `npm run search-index` laufen lassen; sonst schlägt `npm test` fehl. Eine bewusst nicht in der NAV geführte Route gehört in `NAV_EXEMPT` in `src/config/searchData.test.jsx`.
- Der Indexgenerator hängt an `TAB_BAR_MARKER` und an der Entfernung von Icons vor dem Auslesen der Tab-Labels. Wer die Tab-Leiste umbaut, muss beides mitziehen.

## Validierung und Abnahme

- Vor jedem Commit: `npm run build` und `npm test` fehlerfrei; nach Komponenten-/Seitenänderungen zusätzlich `npm run dev` mit Browser-Check (alle Tabs, Desktop und Mobile ≤768px). Nach Änderungen am Paket zusätzlich `npm run build:lib`.
- Verhaltensanteile (Tastaturwege, Fokus, Rückrufe, Zeitgeber) werden per Vitest belegt: Testdatei neben der Komponente als `src/components/<Name>/<Name>.test.jsx`, Elemente über Rolle und Namen ansprechen, Zeitgeber mit `fireEvent` statt `userEvent`. Vor der Übergabe eine Zusicherung absichtlich verdrehen und den Lauf wiederholen — ein grüner Lauf, der nie rot werden kann, belegt nichts. Markup und Props weiterhin per `react-dom/server`; Farben und Abstände bleiben Sache des visuellen Abgleichs.
- **Portale liegen ausschließlich in `Modal`, `Popover` und `Tooltip`.** `Menu` entkommt der Beschneidung über `position: fixed` mit `z-index: 1000`, nicht über ein Portal — wer sich auf eine Portal-Einteilung stützt, prüfe sie am Code nach.
- **Komponenten mit `createPortal` lassen sich nicht über `react-dom/server` nachweisen** — Portale rendern serverseitig nicht, das Skript meldet stillschweigend leeres Markup und damit lauter Fehlschläge, die wie Portfehler aussehen. Solche Komponenten über echtes Client-Rendering prüfen (`createRoot` plus `flushSync`, gelesen wird der ganze `body`).
- Anzahl-Zusicherungen im Prüfskript auf ein Klassen-Token stützen (`class="[^"]*\btoken\b[^"]*"`), nie auf die nackte Zeichenkette: Klassennamen desselben Blocks sind Präfixe voneinander (`__dot`/`__dots`, `__line`/`__line--filled`), eine `split()`-Zählung liegt deshalb leise zu hoch. Vorhandensein-Prüfungen sind nicht betroffen.
- `src/styles/component-theme.test.js` importiert `splitTopLevel` aus `scripts/contrast/tokens.mjs` — wer die Hilfsfunktion umbenennt, bricht den Testlauf.
- `vitest` bleibt auf 3.x (4.x zieht Rolldown mit gebrochenem nativem Binding ein) und `jsdom` auf 26.x (30.x lädt ESM per `require` und bricht auf Node 20). Beide Deckel nicht arglos anheben.
- Visueller Abgleich jeder portierten Komponente gegen ihre Spezifikationsseite in `design-reference/components/` (im Browser öffnen; sie ist eigenständig lauffähig und zeigt Varianten-, Zustands- und Größenmatrix). Die Vorschauen `design-reference/ui/*.card.html` rendern leer, weil das kompilierte Bündel `_ds_bundle.js` nicht übertragbar war — nicht als Abgleichsgrundlage verwenden.
- Jede fertige Komponente/Seite wird dem Inhaber mit einer Prüf-Checkliste übergeben (was prüfen, unter welcher Route, welche Varianten/Zustände/Viewports). Der Task gilt erst nach Abnahme als abgeschlossen; Feedback wird vorher eingearbeitet.
- **Die Prüf-Checkliste verlangt dem Inhaber nur Sichtbares und Ausführbares ab** — Oberfläche, Routen, Varianten, Zustände, Viewports, laufende Befehle. Der Inhaber ist kein Entwickler und bewertet keine Prosa: nie um eine fachliche Beurteilung von Entwicklerdokumentation, Fehlermeldungen, Code-Beispielen oder Verständlichkeit für Dritte bitten. Dass ein fremder Entwickler das Gelieferte versteht und daraus weiß, was zu tun ist, ist vor der Übergabe einzulösen, nicht abzufragen.
- Anleitungen für Abnehmer stehen anweisungsgeführt: erst die auszuführenden Schritte mit vollständigen Dateien und richtigen Pfaden, darunter die tatsächlichen Fehlermeldungen mit jeweiliger Abhilfe, erst zuletzt Begründung und Feinheiten. Jedes gezeigte Code-Beispiel ist vor der Aufnahme gebaut und ausgeführt worden.
- Tailwind durchsucht auch Markdown-Dateien: Codebeispiele in `README.md`, `DEVELOPMENT.md` und `editors-doc.md` können Build-Warnungen erzeugen.
- **Eine Aussage über den Umgebungszustand wird nachgeprüft, nicht geglaubt** — insbesondere „der Entwicklungsserver ist beendet". Ein weiterlaufender `vite`-Prozess sperrt Dateien und verfälscht Abnahmen. Aussagen über den eigenen Arbeitsstand sind davon nicht betroffen.
- `git status` meldet nach `npm run search-index` Änderungen an `searchData.js` und `sectionData.js` ohne Inhaltsdiff — reiner Zeilenenden-Effekt. `git diff --numstat` gibt Auskunft, bevor daraus ein Befund gemacht wird.

## Versionskontrolle

- Basis-Branch ist `main`. Vor jedem Task einen Feature-Branch davon anlegen: `type/kurze-beschreibung` (z.B. `feat/port-button-batch`).
- Commit-Konvention: `type: kurze beschreibung`. Typen: `feat`, `fix`, `refactor`, `docs`, `chore`. Betreff deutsch und kleingeschrieben, ohne Umlaute (`abstand am rechten rand`, nicht `Abstände`).
- Nie direkt auf `main` committen. Feature-Branch in `main` mergen, dann pushen: `git push origin main` ohne Rückfrage, wenn Build clean und Merge erfolgreich.
- Commit-Autor ist der Projektinhaber (ahmeeedo). Keine AI-Tool-Referenzen in Commits, Code-Kommentaren oder Doku.
- Bei paralleler Arbeit erhält jeder Arbeitsstrang einen eigenen Worktree unter `.apm/worktrees/`. Dort Shell-Befehle mit explizitem Verzeichnisbezug ausführen — die Shell ist in früheren Worktree-Betrieben mehrfach ins Hauptverzeichnis zurückgefallen.

## Scope-Grenzen

- Keine Nebenreparaturen an Alt-Code, der ohnehin ersetzt oder entfernt wird.
- **Der Rücklauf ins medo-Design-Projekt wird grundsätzlich protokolliert, nicht ausgeführt. Für diese Session ist diese Sperre ausgesetzt** — für die zugewiesenen Punkte und unter dem Verfahren aus „Schreiben ins Design-Projekt". Nach der Session gilt sie wieder. Was in dieser Session neu entdeckt wird, wird protokolliert und vorgelegt.
- Umlaute in Anker-IDs bleiben unangetastet: eine Korrektur bräche alle bestehenden Anker und Indexeinträge.
- Keine Veröffentlichung in einer npm-Registry, kein Umbau zu einer Monorepo-/Workspace-Struktur, keine Auslagerung der Bibliothek in ein eigenes Repository.
- Keine Vergleichsseite im Portal, die alle Tokens beider Themes samt Kontrastwerten gegenüberstellt. Kein neuer Eintrag auf der Releases-Seite.
- `worktrees-backup/` und die lokalen Feature-Branches der Vorsessions bleiben unangetastet.

} //APM_RULES
