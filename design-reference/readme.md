# medo Design System

Design System für **medo** — Einzelunternehmen von Ahmet Dağlar, Bahnhofstr. 16A, 76646 Bruchsal.
Oberflächensprache ist durchgehend **Deutsch**. Aktuell **nur Light Mode**, die Token-Struktur ist
aber so gebaut, dass ein Dark Mode später als zweiter Scope ergänzt werden kann.

## Produktkontext

medo baut und betreibt Webanwendungen für kleine, fachlich spezialisierte Zielgruppen. Das erste
Produkt ist das **Spezialistennetzwerk**: eine Plattform, auf der selbstständige
Versicherungsvermittler ein fachliches Profil hinterlegen, andere Spezialisten finden, sich
vernetzen und ihre Verbindungen verwalten. Zielgruppe sind also keine Konzern-Nutzer, sondern
Einzelunternehmer, die die Anwendung zwischen Kundenterminen benutzen — daraus folgt die gesamte
Haltung des Systems: ruhig, erklärend, ohne Lernkurve, ohne Effekte, die Aufmerksamkeit kosten.

Die Anwendungen laufen auf Deutsch, sind für Smartphone, Tablet und Desktop ausgelegt und erfüllen
**WCAG 2.2 Stufe AA** als Grundlinie, nicht als Ziel.

## Herkunft dieses Systems

Dieses Projekt ist die kompilierte Fassung des medo Design Systems. Quelle ist das Aufbau-Projekt
`https://claude.ai/design/p/66feb346-231d-4772-b24d-6068259cd03f` — von dort stammen alle Tokens,
Schriften, Dokumentationsseiten, Foundation-Karten und React-Bausteine unverändert. Angepasst wurde
nur die Verpackung: die `ui/*.jsx` exportieren jetzt zusätzlich per ESM (`export { … }`), damit der
Compiler sie unter `window.<Namespace>` bereitstellt, und die Karten laden `_ds_bundle.js` statt der
`.jsx`-Dateien direkt. Die Komponentengruppe `MenuButtons` heißt hier `MenuButton` (Dateiname =
Exportname); `MenuButton`, `SplitButton` und `IconMenuButton` liegen unverändert darin.

Es gab **keinen Bestandscode und keine Figma-Datei** als Quelle. Das System ist in einem
schrittweisen Dialog mit dem Inhaber entstanden: jede Entscheidung — Farbwinkel, Chroma-Intensität,
Skalenverhältnis, jeder einzelne semantische Token — wurde einzeln vorgeschlagen, geprüft und
festgeschrieben. Die verbindlichen Beschlüsse stehen in `CLAUDE.md`, der Verlauf in `STATUS.md`.
Beides ist die Vertragsgrundlage des Systems; bei Widersprüchen gewinnt `CLAUDE.md`.

Vom Inhaber gelieferte Materialien: die Wortmarke als Vektor (`uploads/logo-rgb.svg`, koloriert als
`logo-medo.svg`) sowie inhaltliche Vorgaben zum Spezialistennetzwerk.

## Prinzipien

1. **Klarheit vor Dekoration** — jedes Element muss seine Fläche verdienen.
2. **Für alle gemacht** — WCAG 2.2 AA ist die Grundlinie.
3. **Einmal entschieden, überall verlässlich** — Tokens statt Einzelfallwerte.
4. **Freundlich und menschlich** — sachlich, aber nie kalt.
5. **Ein System, viele Produkte** — nichts wird auf ein einzelnes Produkt zugeschnitten.
6. **Der Inhalt führt** — die Oberfläche tritt zurück.

---

## CONTENT FUNDAMENTALS

**Sprache.** Deutsch, durchgehend. Auch technische Begriffe werden eingedeutscht, wo es eine
etablierte Form gibt: „Anmelden" statt „Login", „Abbrechen" statt „Cancel", „Löschen" statt
„Delete". Englisch bleibt nur, wo die deutsche Form gekünstelt wirkt (etwa „Upload" in
Fachkontexten) — im Zweifel deutsch.

**Anrede.** Nutzer werden mit **Sie** angesprochen. Das System spricht nicht in der Ich-Form über
sich selbst („Ihre Daten werden gespeichert", nicht „Ich speichere Ihre Daten"). In Dokumenten, die
der Inhaber persönlich verantwortet — Angebote, Verträge — ist die Ich-Form dagegen richtig und
gewollt.

**Ton.** Sachlich und vollständig, aber nicht behördlich. Ein Satz erklärt lieber eine Konsequenz
als eine Funktion: „Der Termin wird für alle Standorte sichtbar" ist besser als „Termin
veröffentlichen". Keine Werbesprache, keine Superlative, keine Ausrufezeichen.

**Fehlermeldungen** benennen die Ursache und den nächsten Schritt, nie nur den Zustand.
Gut: „Die E-Mail-Adresse ist bereits vergeben. Melden Sie sich an oder verwenden Sie eine andere
Adresse." Schlecht: „Ungültige Eingabe."

**Bestätigungen** sind kurz und beschreiben das Ergebnis: „Profil gespeichert." Kein „Erfolg!",
kein „Super!".

**Buttons** tragen ein Verb im Infinitiv, das die Handlung benennt — „Termin anlegen", nicht
„Weiter", nicht „OK". Zerstörende Aktionen benennen das Objekt: „Konto löschen".

**Groß- und Kleinschreibung.** Normale deutsche Rechtschreibung, kein Title Case. Ausnahme sind
Mono-Labels über Abschnitten: die stehen in Versalien mit `letter-spacing: 0.12em`.

**Zahlen und Daten.** Deutsches Format: `1.234,56 €`, `04.08.2026`, 24-Stunden-Uhrzeit. Alle Zahlen,
Beträge, IDs und Datumsangaben stehen in DM Mono, damit Spalten untereinander stehen.

**Emoji** werden nicht verwendet — weder in der Oberfläche noch in Dokumenten.

**Leere Zustände** erklären, was hier entstehen wird, und bieten die anlegende Aktion an. Sie
entschuldigen sich nicht und sind nie nur „Keine Daten".

---

## VISUAL FOUNDATIONS

**Grundcharakter.** Warm-neutral, flächig, ruhig. Das System sieht aus wie sauber gesetztes Papier,
nicht wie eine App-Oberfläche: viel Weißraum, dünne Linien, sparsame Farbe, keine Verläufe.

**Farbe.** Drei Ebenen. Ebene 1 sind rohe Skalen mit je zwölf Stufen (50–1100), erzeugt aus einer
OKLCH-Rampe mit `chromaIntensity 1.25`; Stufe **600 ist immer die Volltonfarbe**. Ebene 2 bildet
Rollen darauf ab (primary → teal, neutral → grey, neutral-alt → stone, error → red, warning → amber,
success → green, info → blue; es gibt bewusst **kein secondary**). Ebene 3 sind semantische Tokens
in Material-Nomenklatur — nur diese werden in Komponenten benutzt.

Der Primärton ist **Teal `#007265`** (Hue 185) — gedeckt, nicht leuchtend. Das Basis-Neutral ist
**Stone** (Hue 70), also warmgrau; reines Grey existiert für kühle Kontexte, wird aber selten
gebraucht. Farbe trägt nie Dekoration, sondern nur Bedeutung: Aktion, Status, Auswahl. Pro Fläche
gibt es höchstens einen farbigen Akzent.

Zwei Tokens sind absichtlich **transparent** statt einer festen Mischfarbe, damit sie auf jeder
Fläche funktionieren: `text-muted` (stone-1000 @ 68 %) und `icon-muted` (@ 55 %).

**Flächen.** Basis ist Weiß. Abstufung nach unten, nicht nach oben: `surface-container` = stone-50,
`surface-container-high` / `surface-sunken` = stone-100. Karten liegen also heller auf hellem Grund
und werden durch Rahmen getrennt, nicht durch Schlagschatten. Seitenhintergrund in Dokumenten und
Beispielen ist `#faf9f7`.

**Typografie.** Zwei Familien, mehr nie: **DM Sans** für alles Lesbare, **DM Mono** für Zahlen,
Codes, IDs und Versal-Labels. Skala im Verhältnis 1.25 ab 16px Basis, T-Shirt-Namen von `text-xs`
(12px) bis `text-4xl` (49px). Überschriften ab 25px bekommen `letter-spacing: -0.02em`; darunter
bleibt das Tracking neutral. Gewichte 400/500/600/700 — 600 ist das Standardgewicht für
Überschriften in der Oberfläche, 700 nur für Seitentitel. Fließtext läuft mit 1.6, Überschriften mit
1.1–1.35.

**Abstände.** 4px-Basis, T-Shirt-Namen von `space-3xs` (2px) bis `space-4xl` (96px). Gruppen werden
mit `gap` gesetzt, nicht mit Rändern an Einzelelementen. Innenabstand einer Karte ist `space-lg`
(24px), Abstand zwischen Feldern `space-sm` (12px).

**Radien.** `none 0 · sm 4 · md 8 · lg 12 · xl 18 · 2xl 24 · full 9999`. Standard für Steuerelemente
ist `md` (8px), für Karten `lg` (12px). **Chips und Tags sind immer `full`** — das ist eine feste
Regel, keine Stilfrage.

**Elevation.** Vier Stufen, alle zweilagig und mit **warmer** Schattenbasis `rgba(31,29,26,…)` —
niemals neutralgrau, das wirkt auf dem warmen Neutral schmutzig. Schatten dienen der Höhe
(Menü, Dialog, Popover), nicht der Zierde; ruhende Karten tragen keinen Schatten, sondern einen
Rahmen.

**Rahmen.** 1px ist der Normalfall (`border-thin`), 2px nur für Fokus und Auswahl (`border-thick`).
Vier Abstufungen: `border-subtle` (stone-200) für Trenner innerhalb einer Fläche, `border`
(stone-300) für Karten und Felder, `border-strong` (stone-500) für Hervorhebung, `divider`
(stone-200) für waagerechte Linien. Eingabefelder tragen `input-border` = stone-400 — bewusst hell,
das war eine ausdrückliche Entscheidung des Inhabers.

**Zustände.** Hover hellt nicht auf, sondern legt eine warme Fläche unter (`state-hover` = stone-100);
gedrückt geht eine Stufe tiefer (stone-200); ausgewählt wechselt in `state-selected` = teal-100.
Farbige Aktionen wandern in der Skala nach unten: `action` 600 → hover 700 → active 800. Es gibt
keine Deckkraft-Hovers und keine Skalierungssprünge.

**Fokus.** Immer sichtbar, immer gleich: ein 3px-Ring in primary-600 mit rund 35 % Alpha
(`--medo-focus-ring`), außen am Element. Fokus wird nie entfernt, auch nicht bei Mausbedienung.

**Bewegung.** Sehr zurückhaltend. Zustandswechsel 120–180ms mit `ease-out`, Ein- und Ausblenden von
Überlagerungen 180–240ms. Keine Bounces, keine Federn, keine Aufmerksamkeits-Animationen. Die
einzige Dauerbewegung im System ist der Lade-Spinner.

**Transparenz und Blur** werden praktisch nicht eingesetzt. Überlagerungen liegen auf einem festen
Scrim `rgba(23,21,19,0.5)`; dahinter wird nichts weichgezeichnet.

**Bildsprache.** Es gibt keine Illustrationsbibliothek und keine Markenfotografie. Wo Bild nötig
ist, stehen echte Inhalte (Porträts, Banner) oder klar markierte Platzhalter. Es werden **keine
Bilder generiert und keine Illustrationen gezeichnet**.

**Raster.** 12 Spalten, Gutter 24px, Container maximal 1200px. Breakpoints 640 / 768 / 1024 / 1280 /
1536.

**Hit-Targets** sind mindestens 44×44px, wo mit dem Finger bedient wird.

---

## ICONOGRAPHY

**Ausschließlich Material Symbols Rounded**, Weight **300**, `FILL 0`, `GRAD 0`. Das ist verbindlich:
im ganzen System gibt es **keine handgezeichneten SVG-Icons** und keine zweite Icon-Familie. Die
Schrift kommt über `styles.css` vom Google-Fonts-CDN; lokale Binärdateien liegen nicht im Projekt.

Verwendung:

```html
<span style="font-family:'Material Symbols Rounded';font-weight:300;font-size:18px;line-height:1">search</span>
```

Größen sind 18, 20 und 24px — 18px neben Text in `text-sm`, 20px neben `text-base`, 24px für
alleinstehende Schaltflächen. Icons erben die Textfarbe; eigene Farbe bekommen sie nur über
`--medo-icon`, `--medo-icon-muted` oder eine Statusfarbe.

Dekorative Icons stehen flach im Text. **Bedienbare Icons in Eingabefeldern** (Leeren, Passwort
anzeigen, Kopieren) sehen dagegen wie kleine Schaltflächen aus: ruhende Fläche stone-100, Hover
stone-200, immer mit `aria-label`. Auch das ist eine feste Regel.

Emoji und Unicode-Zeichen werden nicht als Icons verwendet. Die einzige Ausnahme von der
Glyph-Regel ist der Lade-Spinner: ein CSS-Kreis (`medo-spin`), weil eine Icon-Schrift keine
Rotation mit definierter Geschwindigkeit liefert.

---

## Index

**Grundlagen und Verbindliches**

| Datei | Inhalt |
| --- | --- |
| `CLAUDE.md` | Verbindliche Beschlüsse. Bei Widersprüchen maßgeblich. |
| `SKILL.md` | Einstieg für Agenten (Agent-Skill-kompatibel). |
| `thumbnail.html` | Kachel des Systems auf der Übersichtsseite. |
| `STATUS.md` | Fortschritt und Entscheidungsverlauf. |
| `styles.css` | Globaler CSS-Einstiegspunkt. Nur `@import`-Zeilen. |
| `tokens/*.css` | Quelle der Wahrheit für alle Tokens, nach Thema getrennt. |
| `tokens.css` | Flacher Ein-Datei-Export für Entwickler. Abgeleitet, nicht bearbeiten. |
| `tokens.json` | Flacher JSON-Export für Tailwind, Style Dictionary, Figma-Plugins. |
| `logo-medo.svg` | Wortmarke, Schrift in stone-1000, Punkt in primary-600. |
| `fonts.css` | `@font-face` für DM Sans und DM Mono aus `fonts/`. |
| `fonts/*.woff2` | Lokale Schriftdateien, Subset latin. |

**Foundation-Karten** (`guidelines/`) — 41 Karten, jede lädt `styles.css` und zeigt damit die echten
Tokens. Der Dateiname trägt die Sortierung (`10-…` bis `60-…`), die Gruppe steht im `@dsCard`-Kommentar:

| Reihenfolge | Gruppe | Inhalt |
| --- | --- | --- |
| `10-` | Marke | Logo, Iconografie |
| `20-` | Farben · Ebene 1 · Brand | 15 rohe Skalen zu je 12 Stufen |
| `30-` | Farben · Ebene 2 · Alias | 7 Rollen-Rampen |
| `40-` | Farben · Ebene 3 · Semantic | Flächen, Text, Icon, Rahmen, Eingabefelder, Aktion, Zustände, Status |
| `50-` | Typografie | Familien, Display, Body, Gewichte |
| `60-` | Grundlagen | Abstände, Radien, Elevation |
| — | Komponenten | 33 Bausteine aus `ui/` |

**Dokumentationsseiten** (Wurzel) — `Übersicht.dc.html` als Einstieg, dazu `Brand-Palette`,
`Alias-Palette`, `Semantic-Palette`, `Typografie`, `Grundlagen` und `Handoff`.

**Komponenten** (`components/`) — 33 Dokumentationsseiten, je Komponente eine Datei mit Varianten,
Zustandsmatrix, Größen, Anwendungsbeispiel und Do/Don't.

**Bausteine** (`ui/`) — React-Primitives zum Verwenden. Je Komponente eine eigene Vierergruppe:
`<Name>.jsx` (Implementierung), `<Name>.d.ts` (Props-Vertrag), `<Name>.prompt.md`
(Anwendungsregeln) und `<Name>.card.html` (lebende Vorschau, eine Karte pro Komponente). Die
`.jsx`-Dateien sind absichtlich in `React.createElement` geschrieben — kein JSX-Syntax, kein
Build-Schritt nötig; JSX-Beispiele in den `.prompt.md`-Dateien gelten für Projekte mit Bundler.

Einbinden: `styles.css`, dann React (UMD), dann `_ds_bundle.js`. Die Bausteine liegen danach sowohl
unter dem Compiler-Namespace als auch unter `window.MedoUI`. Ohne Bundle geht es weiterhin per
`<script src>` in dieser Reihenfolge: `ui/inject.js`, `ui/Icon.jsx`, `ui/Field.jsx`, dann die
übrigen; `ui/Dropdown.jsx` liefert die gemeinsame Menüfläche `MenuList` und muss vor `ui/Menu.jsx`
und `ui/MenuButton.jsx` geladen werden.

## Stand der Bibliothek

Fertig: `Icon`, `Button`, `Field`, `TextInput`, `Select`, `Checkbox`, `Radio`, `Search`, `NumberInput`, `Link`, `Tag`, `Notification` (+ `ToastHost`, `toast`), `Tooltip`, `Toggle`, `Tabs`, `ContentSwitcher`, `Breadcrumb`, `List`, `KeyValueList`, `ContainedList`, `Accordion`, `Pagination`, `Dropdown` (+ `MenuList`), `Menu`, `MenuButton`/`SplitButton`/`IconMenuButton`, `Popover`, `Modal`, `Loading` (+ `Skeleton`), `InlineLoading`, `ProgressBar`, `ProgressIndicator`, `CodeSnippet`, `DataTable`, `DatePicker`, `FileUploader`, `Slider`. Damit ist jede in `components/`
dokumentierte Komponente auch als Baustein vorhanden.

**Templates** (Startordner für konsumierende Projekte) gibt es noch keine. Sinnvolle Kandidaten
wären eine Formularseite, eine Übersichtsseite mit `DataTable` und ein Dialogfluss — auf Zuruf.

**UI-Kits gibt es bewusst nicht.** Es liegt kein Produkt-Code und kein Screendesign des
Spezialistennetzwerks vor; nachgebaute Screens wären erfunden. Sobald echte Ansichten vorliegen,
gehören sie als `ui_kits/<produkt>/` dazu.

## Bekannte Einschränkungen

- **Material Symbols Rounded liegt nicht lokal vor** und kommt vom Google-Fonts-CDN. DM Sans und
  DM Mono sind lokal in `fonts/` und funktionieren offline.
- **Nur Light Mode.** Die semantische Ebene ist auf einen zweiten Scope vorbereitet, aber nicht
  belegt.
- `tokens.css` und `tokens.json` sind abgeleitete Exporte. Ändern sich Tokens, müssen beide neu
  erzeugt werden, sonst laufen sie gegen `tokens/*.css` auseinander.
