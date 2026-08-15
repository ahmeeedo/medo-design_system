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

- `design-reference/` ist die unveränderliche Design-Wahrheit (Kopie des medo-Design-Projekts). Nie editieren, nur lesen.
- Verbindlichkeit bei Widersprüchen (absteigend): `design-reference/CLAUDE.md` (gelockte Beschlüsse) → `design-reference/components/<Name>.dc.html` (Spezifikation pro Komponente) → `design-reference/ui/<Name>.jsx` / `.d.ts` / `.prompt.md` (Referenzcode, Props-Vertrag, Nutzungsregeln).
- Die Referenz ist maßgeblich, nicht Ausgangspunkt für Vereinfachungen: Verhalten, Zustände und Details vollständig übernehmen. Jede in der `.d.ts` deklarierte Prop/Variante muss funktionieren.
- **`design-reference/` ist die alleinige Quelle: portierte Komponenten werden auch nicht additiv erweitert.** Eine Prop, die die `.d.ts` nicht kennt, gehört nicht hinein — auch nicht als „dokumentierte Abweichung", auch nicht, wenn sie einen echten Bedarf löst. Braucht der Aufrufer mehr, löst er es auf seiner Seite oder der Bedarf geht als Änderungswunsch ins Design-Projekt zurück.
- Fehlt ein Token oder eine Angabe, oder widerspricht sich Material: an den Manager eskalieren und auf Klärung warten. Nie Werte erfinden, nachrechnen oder improvisieren.

## Port-Konventionen (Komponenten aus design-reference/ui/)

- `React.createElement`-Code in normales JSX umschreiben; Verhalten 1:1 erhalten.
- Den `MEDO_*_CSS`-String der Referenz in eine eigene Datei `src/components/<Name>/<Name>.css` extrahieren und in der Komponente importieren. CSS-Klassennamen (`medo-btn` …) und Selektoren unverändert lassen; das `injectCss`-Muster entfällt.
- **Vor dem Anlegen der CSS-Datei den Klassenpräfix gegen die bereits portierten Komponenten prüfen** (`grep` über `src/components/`). Anders als in der Referenz, wo jede Spezifikationsseite für sich läuft, landen hier alle Stylesheets in einem Bündel — ein doppelt belegter Präfix lässt zwei Komponenten einander stillschweigend überschreiben, ohne Build-Fehler. Bei einer Kollision an den Manager eskalieren; der neue Präfix wird dort entschieden und gilt als dokumentierte Abweichung von der Referenz.
- `window.MedoUI`-Registrierung entfernen; stattdessen benannte ES-Exporte und Export über das Barrel `src/components/index.js`.
- Interne Abhängigkeiten der Referenz (z.B. Icon, Field, MenuList aus Dropdown) als ES-Imports auflösen — keine Window-Lookups, keine Ladereihenfolge-Annahmen.
- **Inline-Stile mit Token-Werten nur in Längsformen setzen** (`borderTopColor`, `borderRightColor` … statt `borderColor`). Kurzformen mit `var()`-Werten kommen unvollständig an, und der Fehler ist stumm: ein Teil der Kanten färbt sich korrekt, der Rest bleibt neutral. Betrifft jede Komponente, die Farben inline aus Tokens setzt.
- Ablage: `src/components/<Name>/<Name>.jsx` + `<Name>.css`.

## Styling

- Zwei Welten, klare Grenze: Komponenten (`src/components/`) verwenden ausschließlich das portierte klassenbasierte CSS auf `--medo-*`-Tokens — kein Tailwind in Komponenten-CSS. Docs-Chrome und Seiten (`src/docs/`, `src/pages/`) verwenden Tailwind-Utilities, die ausschließlich `--medo-*`-Tokens referenzieren (z.B. `bg-[var(--medo-surface-container)]`).
- Nie Farb-, Abstands-, Radius- oder Schatten-Werte hardcoden — immer Token-Referenz. Bevorzugt semantische Tokens (Ebene 3); Brand-Stufen nur, wo die Referenz sie selbst nutzt.
- Die Zwischenwert-Regel gilt für selbst geschriebenen Code (Docs-Chrome, Doku-Seiten, neu ergänzte Komponenten-CSS). **1:1 portiertes Komponenten-CSS behält die Zahlenwerte der Referenz** — Umrechnen fiele unter das Verbot des Nachrechnens.
- Zwischenwerte, die auf keiner Token-Stufe liegen, werden im CSS aus Tokens berechnet statt hardcodiert: `calc(var(--medo-space-xs) * 0.75)` für 6px, `calc(var(--medo-space-2xl) + var(--medo-space-xs))` für 56px. Wiederkehrende Zwischenwerte bekommen eine globale Definition im `:root`-Block von `src\styles\global.css` (z.B. `--docs-header-height`, `--docs-hit-target`) und werden überall darüber referenziert, nie mehrfach ausgerechnet.
- Alt-Tokens (`--color-brand-*`, `--space-1…32` usw.) in neuem oder geändertem Code nicht mehr verwenden; sie existieren nur noch für unmigrierte Alt-Seiten bis zum Cleanup.
- `src/styles/global.css`: EIN `@theme inline`-Block, EIN `:root`-Block, keine zirkulären `var()`-Selbstreferenzen, keine `@source`-Direktiven.

## Icons

- Ausschließlich Material Symbols Rounded, weight 300, FILL 0 — immer über die `Icon`-Komponente aus `src/components/Icon/`. `size` ist eine freie Zahl: Standardgrößen sind 18 (neben `text-sm`), 20 (neben `text-base`, Default) und 24 (alleinstehend); kleinere Werte wie 16 nur dort, wo die Referenz sie selbst setzt (Meldungszeilen, Chips, dichte Kontexte).
- **Maßgeblich ist die Auslösefläche, nicht die Komponente:** Icons, die eine Auslösefläche begleiten (Button, Link, Dropdown-Auslöser, MenuButton, SplitButton, IconMenuButton), liegen auf sm 20 / md 22 / lg 24; der `+2`-Aufschlag der Referenz für Icon-only entfällt dabei. **Alle übrigen Icons behalten die Größen ihrer Referenzimplementierung** — Icons in Menü- und Listeneinträgen, Feld-Icons, Chips, Meldungszeilen, Tabellen. Eine Komponente kann beides enthalten. Im Zweifel: an den Manager eskalieren.
- Keine Inline-SVGs, keine Emojis als Icons, kein lucide-react oder andere Icon-Bibliotheken.
- Bedienbare Icons in Feldern (Leeren, Passwort anzeigen, Kopieren) haben Icon-Button-Optik (Ruhefläche stone-100, Hover stone-200) und immer ein `aria-label`; dekorative Icons stehen flach im Text.

## Internationalisierung und Demo-Inhalte

- Jeder User-facing String in JSX läuft über `t()` aus `react-i18next`; jeder neue Key wird in `src/i18n/locales/de.json` **und** `en.json` eingetragen (Deutsch ist Standard, Englisch übersetzt der Worker). `tabs.*` ist reserviert für globale Tab-Labels.
- Demo-Inhalte in Komponenten-Vorschauen sind Deutsch mit „Sie"-Anrede: Buttons tragen Verb-Infinitive („Termin anlegen", nie „OK"), keine Ausrufezeichen, keine Werbesprache, keine Emojis, deutsche Formate (`1.234,56 €`, `04.08.2026`, 24h-Uhrzeit). Zahlen, Beträge, IDs und Daten stehen in DM Mono.
- Fehlermeldungs-Demos benennen Ursache und nächsten Schritt, nie nur den Zustand.

## Doku-Seiten und DemoPanel

- Jede Komponenten-Doku-Seite folgt dem 4-Tab-Muster (Overview/Usage/Code/Accessibility); Inhalte entstehen aus der jeweiligen Spezifikation in `design-reference/components/`, nicht aus Alt-Seiten.
- `<DemoPanel>` ist das erste JSX-Element im Overview-Tab-Content jeder Komponenten-Seite, vor allen `<Section>`-Elementen (Import: `import { DemoPanel } from '../docs/PageLayout'`; API: `component`-Funktion + `controls`-Array, siehe `src/docs/DemoPanel.jsx`). Die Controls decken die Varianten/Props aus der `.d.ts` der Komponente ab. Info-Seiten haben kein DemoPanel.
- **Überschriften der Ebene h2 gehören in einen `<Section>`-Wrapper.** Steht eine `h2` außerhalb, greift die Ankersuche über `el.closest('[id]')` die ID des nächsten Vorfahren ab statt einen eigenen Anker zu erzeugen — Inhaltsverzeichnis und Suchtreffer springen dann ins Ungefähre. Der Anker-Algorithmus liegt in `src/docs/anchors.js` und ist die einzige Quelle; nicht kopieren, importieren.
- **`src/config/searchData.js` und `sectionData.js` werden erzeugt, nicht gepflegt.** Nach jeder neuen, umbenannten oder entfernten Seite und nach jeder geänderten Abschnittsüberschrift `npm run search-index` laufen lassen; sonst schlägt `npm test` fehl. Neue Routen werden als Datenzeile in `ROUTES` (`src/App.jsx`) ergänzt, nicht als `<Route>`-Element. Eine bewusst nicht in der NAV geführte Route gehört in `NAV_EXEMPT` in `src/config/searchData.test.jsx`.

## Validierung und Abnahme

- Vor jedem Commit: `npm run build` und `npm test` fehlerfrei; nach Komponenten-/Seitenänderungen zusätzlich `npm run dev` mit Browser-Check (alle Tabs, Desktop und Mobile ≤768px).
- Verhaltensanteile (Tastaturwege, Fokus, Rückrufe, Zeitgeber) werden per Vitest belegt: Testdatei neben der Komponente als `src/components/<Name>/<Name>.test.jsx`, Elemente über Rolle und Namen ansprechen, Zeitgeber mit `fireEvent` statt `userEvent`. Vor der Übergabe eine Zusicherung absichtlich verdrehen und den Lauf wiederholen — ein grüner Lauf, der nie rot werden kann, belegt nichts. Markup und Props weiterhin per `react-dom/server`; Farben und Abstände bleiben Sache des visuellen Abgleichs.
- **Komponenten mit `createPortal` lassen sich nicht über `react-dom/server` nachweisen** — Portale rendern serverseitig nicht, das Skript meldet stillschweigend leeres Markup und damit lauter Fehlschläge, die wie Portfehler aussehen. Solche Komponenten über echtes Client-Rendering prüfen (`createRoot` plus `flushSync`, gelesen wird der ganze `body`).
- Anzahl-Zusicherungen im Prüfskript auf ein Klassen-Token stützen (`class="[^"]*\btoken\b[^"]*"`), nie auf die nackte Zeichenkette: Klassennamen desselben Blocks sind Präfixe voneinander (`__dot`/`__dots`, `__line`/`__line--filled`), eine `split()`-Zählung liegt deshalb leise zu hoch. Vorhandensein-Prüfungen sind nicht betroffen.
- `vitest` bleibt auf 3.x (4.x zieht Rolldown mit gebrochenem nativem Binding ein) und `jsdom` auf 26.x (30.x lädt ESM per `require` und bricht auf Node 20). Beide Deckel nicht arglos anheben.
- Visueller Abgleich jeder portierten Komponente gegen ihre Spezifikationsseite `design-reference/components/<Name>.dc.html` (im Browser öffnen; sie ist eigenständig lauffähig und zeigt Varianten-, Zustands- und Größenmatrix). Die Vorschauen `design-reference/ui/*.card.html` rendern leer, weil das kompilierte Bündel `_ds_bundle.js` nicht übertragbar war — nicht als Abgleichsgrundlage verwenden.
- Jede fertige Komponente/Seite wird dem Inhaber mit einer Prüf-Checkliste übergeben (was prüfen, unter welcher Route, welche Varianten/Zustände/Viewports). Der Task gilt erst nach Abnahme als abgeschlossen; Feedback wird vorher eingearbeitet.

## Versionskontrolle

- Basis-Branch ist `main`. Vor jedem Task einen Feature-Branch davon anlegen: `type/kurze-beschreibung` (z.B. `feat/port-button-batch`).
- Commit-Konvention: `type: kurze beschreibung`. Typen: `feat`, `fix`, `refactor`, `docs`, `chore`. Betreff deutsch und kleingeschrieben, ohne Umlaute (`abstand am rechten rand`, nicht `Abstände`).
- Nie direkt auf `main` committen. Feature-Branch in `main` mergen, dann pushen: `git push origin main` ohne Rückfrage, wenn Build clean und Merge erfolgreich.
- Commit-Autor ist der Projektinhaber (ahmeeedo). Keine AI-Tool-Referenzen in Commits, Code-Kommentaren oder Doku.
- Bei paralleler Arbeit erhält jeder Arbeitsstrang einen eigenen Worktree unter `.apm/worktrees/`. Dort Shell-Befehle mit explizitem Verzeichnisbezug ausführen — die Shell ist in früheren Worktree-Betrieben mehrfach ins Hauptverzeichnis zurückgefallen.

## Scope-Grenzen

- Keine Nebenreparaturen an Alt-Code, der ohnehin ersetzt oder entfernt wird.
- Der Rücklauf der Dark-Palette ins medo-Design-Projekt wird protokolliert, nicht ausgeführt. Ebenso die in der Vorsession protokollierten Rückläufer (Präfix-Kollision, Select-Vertrag, Tabs-Befund `contained` + `scrollable`).
- Keine Veröffentlichung in einer npm-Registry, kein Umbau zu einer Monorepo-/Workspace-Struktur, keine Auslagerung der Bibliothek in ein eigenes Repository.
- Keine Vergleichsseite im Portal, die alle Tokens beider Themes samt Kontrastwerten gegenüberstellt. Kein neuer Eintrag auf der Releases-Seite.
- `worktrees-backup/` und die sechs lokalen Feature-Branches der Vorsessions bleiben unangetastet.

} //APM_RULES
