# med.o Design System

Vollständige Komponenten-Bibliothek und Styling-Richtlinien von med.o, gebaut mit Vite + React, Tailwind CSS v4 und shadcn/ui.

## Schnellstart

```bash
npm install
npm run dev      # Dev-Server auf http://localhost:5173
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal vorschauen
```

---

## Einbindung als Paket

Das Repository liefert neben dem Doku-Portal das Paket `@medo/design-system`. Es
wird als Git-Abhängigkeit eingebunden, nicht über eine Registry:

```bash
npm install github:<organisation>/medo-design_system
```

Der Paket-Build läuft beim Installieren über das `prepare`-Skript; im Repository
selbst startet ihn `npm run build:lib`. Der Portal-Build (`npm run build`) bleibt
davon unberührt.

React und React DOM sind Peer-Abhängigkeiten (`^18 || ^19`) und werden vom
Abnehmer gestellt.

### Einstiegspunkte

| Import | Inhalt |
|---|---|
| `@medo/design-system` | alle Komponenten als benannte ES-Exporte |
| `@medo/design-system/styles.css` | vollständige Stile: Schriften, die drei Token-Ebenen, das Theme und das CSS aller Komponenten |
| `@medo/design-system/tokens.css` | nur Fundament — Schriften, Token-Ebenen, Theme, ohne Komponenten-CSS |

Die Komponenten laden ihr CSS nicht selbst. Genau einer der beiden Stil-Einstiegspunkte
gehört einmalig in den Einstiegspunkt der Anwendung:

```js
import '@medo/design-system/styles.css'
import 'material-symbols/rounded'

import { Button, Icon } from '@medo/design-system'
```

Die Icon-Schrift kommt aus dem Paket `material-symbols`, das als Abhängigkeit
mitinstalliert wird. Sie liegt bewusst nicht im Auslieferumfang: die Datei ist
5,3 MB groß und würde in jedem Abnehmerbündel ein zweites Mal auftauchen. Die
Achseneinstellungen des Systems (weight 300, FILL 0) bringen beide
Stil-Einstiegspunkte mit; ohne den Import oben erscheinen Icons als Ligaturnamen.

### Theme

Geschaltet wird über `data-theme` am `<html>`-Element:

| Wert | Verhalten |
|---|---|
| nicht gesetzt | folgt dem Systemtheme |
| `light` | erzwingt hell |
| `dark` | erzwingt dunkel |

Der Schalter arbeitet über `color-scheme`, damit Token-Werte und native
Bedienelemente nicht auseinanderlaufen können. **Eine Anwendung, die
`color-scheme` selbst auf `:root` setzt, hebelt das Theme aus** — die
`light-dark()`-Paare folgen dann ihrem Wert statt dem `data-theme`-Attribut.

---

## Projektstruktur

```
src/
├── components/             # 36 portierte Komponenten, je <Name>/<Name>.jsx + .css
│   └── index.js            # Barrel-Export, zugleich Einstiegspunkt des Pakets
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
├── i18n/                   # i18next-Konfiguration und locales/de.json, en.json
├── fonts/                  # woff2-Schnitte
├── App.jsx                 # Routing-Tabelle
└── main.jsx                # React-Einstiegspunkt des Portals
```

Der Suchindex unter `config/` wird erzeugt, nicht gepflegt: nach neuen, umbenannten
oder entfernten Seiten `npm run search-index` laufen lassen.

---

## Design-Token-System

Alle Design-Entscheidungen leben als CSS Custom Properties in den acht Dateien unter [`src/styles/medo/`](src/styles/medo/), die [`src/styles/medo-tokens.css`](src/styles/medo-tokens.css) in der Reihenfolge Brand → Alias → Semantic einbindet. Tailwind liest sie über `@theme inline` in `global.css` ein — keine Werte in einer Tailwind-Konfigurationsdatei.

**Goldene Regel:** Niemals Farb-, Abstands-, Radius- oder Schatten-Werte in JSX oder CSS hardcoden. Immer auf einen Token referenzieren.

### Farb-Tokens

Das Farbsystem besteht aus drei Schichten:

**1. Basis-Palette** (konkrete Hex-Werte, nicht direkt im Code verwenden):
```
--color-brand-navy-*      (100–1000)  Dunkles Navy
--color-brand-orange-*    (100–1000)  Orange-Töne
--color-brand-cobalt-*    (100–1000)  Kobaltblau
--color-brand-grey-*      (100–1000)  Graustufen
--color-brand-red-*       (100–1000)
--color-brand-green-*     (100–1000)
--color-brand-yellow-*    (100–1000)
--color-brand-blue-*      (100–1000)
```

**2. Semantische Aliase** (im Code verwenden):
```
--color-brand-primary-*   (100–1000)  → Navy  (Hauptmarkenfarbe)
--color-brand-secondary-* (100–1000)  → Orange
--color-brand-accent-*    (100–1000)  → Orange (Alias auf Secondary)
--color-neutral-*         (0, 50, 100–1000)
--color-success-*         (100–1000)  → Grün
--color-warning-*         (100–1000)  → Gelb
--color-error-*           (100–1000)  → Rot
--color-info-*            (100–1000)  → Blau
--color-focus-*           (100–1000)  → Kobalt
```

**3. Funktionale Tokens** (bevorzugt im Code verwenden):
```
--color-text-primary        Haupttext
--color-text-secondary      Sekundärtext (Beschriftungen, Hinweise)
--color-text-tertiary       Tertiärtext
--color-text-on-color       Weißer Text auf farbigem Hintergrund
--color-border              Standard-Rahmenfarbe
--color-border-subtle       Subtiler Rahmen
--color-link-primary        Linkfarbe
--color-link-primary-hover  Linkfarbe bei Hover
--surface_100 / --surface_200 / --surface_brand   Oberflächenfarben
```

### Typografie-Tokens

```
--font-sans           'DM Sans', system-ui, sans-serif
--font-mono           'DM Mono', monospace

--weight-light        300
--weight-regular      400
--weight-medium       500
--weight-semibold     600
--weight-bold         700
--weight-extrabold    800

--leading-none / --leading-tight / --leading-snug / --leading-normal
--leading-relaxed / --leading-loose

--tracking-tight / --tracking-normal / --tracking-wide / --tracking-wider
--tracking-widest
```

**Achtung:** `text-xs`, `text-sm`, `text-md`, `text-lg`, `text-xl` etc. für Schriftgrößen verwenden — **nicht** `text-[var(--text-*)]` (das würde eine Farb-Utility erzeugen, nicht eine Größen-Utility).

### Abstands-Tokens

```
--space-1 (4px) bis --space-32 (128px)
```

Verwendung in Tailwind: `px-[var(--space-4)]`, `mb-[var(--space-6)]` etc.

### Radius-Tokens

```
--radius-xs (2px) → --radius-sm (4px) → --radius-md (6px) → --radius-lg (8px)
--radius-xl (12px) → --radius-2xl (16px) → --radius-3xl (24px) → --radius-full (9999px)
```

### Schatten-Tokens

```
--shadow-sm / --shadow-md / --shadow-lg / --shadow-xl
```

### Motion-Tokens

```
--duration-fast / --duration-normal / --duration-slow
--ease-in / --ease-out / --ease-in-out / --ease-elastic
```

---

## Komponenten-Bibliothek

Im Repository werden die Komponenten aus dem Barrel importiert, beim Abnehmer des
Pakets über dessen Einstiegspunkt:

```jsx
import { Button, TextInput, Modal } from './components'      // im Repository
import { Button, TextInput, Modal } from '@medo/design-system' // als Paket
```

36 Module mit 46 benannten Exporten. Wo ein Modul mehr als seinen Namensgeber
exportiert, stehen die Exporte dahinter:

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

Der Props-Vertrag jeder Komponente steht im Doku-Portal (`npm run dev`) auf der
Seite der Komponente im Tab „Code", daneben Varianten, Zustände und
Barrierefreiheit. Diese Datei wiederholt ihn bewusst nicht: das Portal entsteht aus
den Spezifikationen in `design-reference/components/` und kann deshalb nicht mit der
Implementierung auseinanderlaufen, eine zweite Abschrift hier könnte es.

---

## Internationalisierung

Alle User-facing Strings in JSX werden über `t()` aus `react-i18next` übersetzt:

```jsx
import { useTranslation } from 'react-i18next'

function MyPage() {
  const { t } = useTranslation()
  return <h1>{t('myPage.title')}</h1>
}
```

Neue Keys müssen in **beiden** Dateien eingetragen werden:

- [`src/i18n/locales/de.json`](src/i18n/locales/de.json) — Deutsch (Standard)
- [`src/i18n/locales/en.json`](src/i18n/locales/en.json) — Englisch

**Reservierter Namespace:** `tabs.*` enthält die globalen Tab-Labels (`overview`, `usage`, `code`, `accessibility`, `tokens`). Für Seiteninhalte eigene Namespaces verwenden (z.B. `buttons.*`, `cardsPage.*`).

---

## Technologie-Stack

| Technologie | Version | Zweck |
|---|---|---|
| React | 18 | UI-Framework |
| Vite | 6 | Build-Tool + Dev-Server |
| Tailwind CSS | v4 | Utility-First-CSS |
| shadcn/ui | aktuell | Barrierefreie UI-Primitiven |
| react-router-dom | 7 | Client-Side-Routing |
| react-i18next | aktuell | Internationalisierung |
| Geist Variable | — | Schriftart |
| radix-ui | aktuell | shadcn/ui-Basis |
| lucide-react | aktuell | Icons |
