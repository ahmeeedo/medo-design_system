# med.o Design System

Komponenten-Bibliothek und Gestaltungsgrundlagen von med.o: 36 React-Komponenten
auf einem dreistufigen Token-System mit hellem und dunklem Theme, dazu ein
Doku-Portal, das jede Komponente bedienbar zeigt.

Das Repository enthält zwei Dinge:

- **das Paket `@medo/design-system`** — die Komponenten und ihre Stile, zur
  Einbindung in andere Projekte
- **das Doku-Portal** — 43 Seiten, die jede Komponente mit Varianten, Zuständen,
  Props-Vertrag und Barrierefreiheit dokumentieren

---

## Schnellstart

```bash
npm ci
npm run dev      # Doku-Portal auf http://localhost:5173
```

| Skript | Wirkung |
|---|---|
| `npm run dev` | Entwicklungsserver für das Portal |
| `npm run build` | Portal-Build nach `dist/` |
| `npm run build:lib` | Paket-Build nach `dist-lib/` |
| `npm run preview` | gebautes Portal lokal ausliefern |
| `npm test` | Testsuite |
| `npm run search-index` | Suchindex des Portals neu erzeugen |
| `npm run contrast` | Kontrastbericht nach `docs/` |

---

## Wohin von hier

| Ihre Frage | Ort |
|---|---|
| Ich will das System **in einem anderen Projekt** verwenden. | **[HANDOFF.md](HANDOFF.md)** — Installation, Stile, Schrift und Icons, Theme, Tokens, Typen, Grenzen |
| Ich arbeite **in diesem Repository**. | **[DEVELOPMENT.md](DEVELOPMENT.md)** — Tokens und Theme ändern, Komponenten bearbeiten, Doku-Seiten anlegen, Tests, Abnahme |
| Habe ich beim Arbeiten etwas vergessen? | **[editors-doc.md](editors-doc.md)** — Checklisten und stumme Fallen |
| Wie sieht Komponente X aus, was kann sie? | Das Portal: `npm run dev` |
| Was ist die verbindliche Gestaltungsvorgabe? | [`design-reference/`](design-reference/) — ausschließlich lesend |

Diese Datei wiederholt den Inhalt der drei Dokumente nicht. Sie ist der
Einstieg, nicht die Anleitung.

---

## Einbindung als Paket — in Kürze

Das Paket wird als Git-Abhängigkeit eingebunden, nicht über eine Registry. Das
Repository ist öffentlich; die Adresse braucht kein Zugangstoken.

```bash
npm install github:ahmeeedo/medo-design_system
```

```js
import '@medo/design-system/styles.css'
import 'material-symbols/rounded.css'

import { Button, Icon } from '@medo/design-system'
```

Drei Dinge, an denen eine Einbindung erfahrungsgemäß scheitert — alle drei sind
in [HANDOFF.md](HANDOFF.md) ausgeschrieben:

1. **Der Icon-Import braucht die Endung `.css`.** Ohne ihn erscheinen die
   Ligaturnamen als Text.
2. **Das Paket setzt keine Grundschrift** auf `html` oder `body`. Eine Zeile
   `body { font-family: var(--medo-font-sans) }` gehört in Ihr Stylesheet.
3. **Nur die semantische Token-Ebene folgt dem Theme.** Brand- und Alias-Ebene
   sind in Hell und Dunkel identisch.

Das Theme wird über `data-theme` am `<html>`-Element gesteuert (`light`, `dark`,
oder nicht gesetzt — dann folgt es der Systemeinstellung).

---

## Projektstruktur

```
src/
├── components/             # 36 portierte Komponenten, je <Name>/<Name>.jsx + .css
│   └── index.js            # Barrel-Export, zugleich Einstiegspunkt des Pakets
├── types/                  # 35 Props-Vertraege, Kopien aus dem Design-Projekt
├── styles/
│   ├── medo/               # die acht Token-Dateien, Spiegel von design-reference/tokens/
│   ├── medo-tokens.css     # Token-Einstiegspunkt: Brand -> Alias -> Semantic
│   ├── medo-theme.css      # Semantic-Ebene als light-dark()-Paare
│   ├── medo-theme-components.css  # dunkle Entsprechung fuer feste Farbwerte im Komponenten-CSS
│   ├── fonts.css           # lokale DM Sans / DM Mono
│   ├── icons.css           # Achsenregel Material Symbols Rounded
│   └── global.css          # Portal: Ladekette, @theme inline, :root, Basis-Layer
├── lib/tokens.js           # Fundament-Einstiegspunkt des Paket-Builds
├── docs/                   # Portal-Rahmen: Layout, Suche, Tabs, Theme-Schalter
├── pages/                  # 43 Dokumentationsseiten
├── config/                 # erzeugter Suchindex (searchData.js, sectionData.js)
├── i18n/                   # Konfiguration und locales/de.json, en.json
├── fonts/                  # woff2-Schnitte
├── App.jsx                 # Routing-Tabelle
└── main.jsx                # React-Einstiegspunkt des Portals
scripts/                    # Suchindex-Generator, Kontrastwerkzeug, Paket-Build
design-reference/           # Gestaltungsvorgabe, ausschliesslich lesend
```

---

## Gestaltungsgrundlagen

Alle Gestaltungsentscheidungen liegen als CSS Custom Properties mit dem Präfix
`--medo-` in den acht Dateien unter [`src/styles/medo/`](src/styles/medo/), die
[`src/styles/medo-tokens.css`](src/styles/medo-tokens.css) in der Reihenfolge
Brand → Alias → Semantic einbindet. Diese acht Dateien sind ein Spiegel des
Design-Projekts und werden hier nicht geändert.

**Goldene Regel:** Keine Farb-, Abstands-, Radius- oder Schattenwerte hartkodieren
— immer auf ein Token referenzieren, bevorzugt auf die semantische Ebene.

Die vollständige Übersicht mit allen Rollen und ihren Werten in beiden Themes
steht im Portal auf den Seiten „Farben · Ebene 3 Semantic" und „Grundlagen".

---

## Komponenten

```jsx
import { Button, TextInput, Modal } from './components'       // im Repository
import { Button, TextInput, Modal } from '@medo/design-system' // als Paket
```

36 Module mit 46 benannten Exporten. Wo ein Modul mehr als seinen Namensgeber
exportiert, stehen die weiteren Exporte dahinter:

`Accordion` · `Breadcrumb` · `Button` · `Checkbox` (`Checkbox`, `CheckboxGroup`) ·
`CodeSnippet` · `ContainedList` · `ContentSwitcher` · `DataTable` ·
`DatePicker` (`DatePicker`, `TimeSlots`) · `Dropdown` (`Dropdown`, `MenuList`) ·
`Field` · `FileUploader` · `Icon` · `InlineLoading` · `Link` ·
`List` (`List`, `KeyValueList`) · `Loading` (`Loading`, `Skeleton`) · `Menu` ·
`MenuButtons` (`MenuButton`, `SplitButton`, `IconMenuButton`) · `Modal` ·
`Notification` (`Notification`, `ToastHost`, `toast`) · `NumberInput` ·
`Pagination` · `Popover` · `ProgressBar` · `ProgressIndicator` ·
`Radio` (`Radio`, `RadioGroup`) · `Search` · `Select` · `Slider` · `Tabs` · `Tag` ·
`Textarea` · `TextInput` · `Toggle` · `Tooltip`

Der Props-Vertrag jeder Komponente steht im Portal auf ihrer Seite im Tab „Code",
daneben Varianten, Zustände und Barrierefreiheit. Diese Datei wiederholt ihn
bewusst nicht: das Portal entsteht aus den Spezifikationen in
`design-reference/components/` und kann deshalb nicht mit der Umsetzung
auseinanderlaufen, eine zweite Abschrift hier könnte es.

---

## Technischer Rahmen

| Baustein | Version | Zweck |
|---|---|---|
| React | 18 | Komponenten |
| Vite | 5 | Build und Entwicklungsserver |
| Tailwind CSS | 4 | Utility-Klassen im Portal, ausschließlich auf `--medo-*`-Tokens |
| react-router-dom | 6 | Routing im Portal |
| react-i18next | 17 | Übersetzungen im Portal |
| Vitest | 3 | Tests |
| material-symbols | 0.44 | Icon-Schrift (Material Symbols Rounded, weight 300, FILL 0) |
| DM Sans, DM Mono | — | Schriften, lokal ausgeliefert |

Tailwind, Routing und Übersetzungen betreffen **nur das Portal**. Das
ausgelieferte Paket enthält keine dieser Abhängigkeiten; der Paket-Build bricht
ab, wenn eine davon hineingerät.
