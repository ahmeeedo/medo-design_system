# Entwickler-Leitfaden — med.o Design System

Dieser Leitfaden beschreibt, wie das Projekt bearbeitet wird: Farben und Tokens anpassen, Komponenten ändern oder neu anlegen, Dokumentationsseiten bearbeiten und die Navigation erweitern.

---

## Inhaltsverzeichnis

1. [Farben und Design-Tokens ändern](#1-farben-und-design-tokens-ändern)
2. [Eine bestehende Komponente bearbeiten](#2-eine-bestehende-komponente-bearbeiten)
3. [Eine neue Komponente anlegen](#3-eine-neue-komponente-anlegen)
4. [Eine Dokumentationsseite bearbeiten](#4-eine-dokumentationsseite-bearbeiten)
5. [Eine neue Dokumentationsseite anlegen](#5-eine-neue-dokumentationsseite-anlegen)
6. [Die Seitennavigation erweitern](#6-die-seitennavigation-erweitern)
7. [Übersetzungen (i18n) pflegen](#7-übersetzungen-i18n-pflegen)
8. [Docs-Infrastruktur: PageLayout und Hilfskomponenten](#8-docs-infrastruktur-pagelayout-und-hilfskomponenten)
9. [CSS und Tailwind](#9-css-und-tailwind)
10. [Responsive Anpassung](#10-responsive-anpassung)
11. [States: Hover, Active, Focus und mehr](#11-states-hover-active-focus-und-mehr)
12. [Qualitätssicherung](#12-qualitätssicherung)

---

## 1. Farben und Design-Tokens ändern

**Alle** Farb-, Abstands-, Radius-, Schatten- und Motion-Werte leben in einer einzigen Datei:

**[`src/styles/tokens.css`](src/styles/tokens.css)**

Das Farbsystem hat drei Schichten:

```
Basis-Palette                  Semantische Aliase              Funktionale Tokens
--color-brand-navy-500         --color-brand-primary-500       --color-text-primary
(konkreter Hex-Wert)       →   (Alias auf Basis)           →   (Alias auf Semantisch)
```

### Bestehende Farbe ändern

Um z.B. die Primärfarbe (Navy) heller zu machen:

```css
/* In src/styles/tokens.css */
--color-brand-navy-500: #2A3F70;   /* Wert anpassen */
```

Alle Komponenten, die `--color-brand-primary-500` oder `--color-text-primary` verwenden, übernehmen die Änderung automatisch.

### Neue Farbpalette hinzufügen

```css
/* 1. Basis-Palette eintragen */
--color-brand-teal-100: #E0F7FA;
--color-brand-teal-500: #00897B;
--color-brand-teal-900: #004D40;

/* 2. Semantischen Alias anlegen (falls nötig) */
--color-brand-tertiary-500: var(--color-brand-teal-500);
```

**Regel:** Im Komponenten-Code nur semantische oder funktionale Tokens referenzieren, nie Basis-Palette direkt.

### Spacing, Radius, Shadows, Motion

Gleiches Prinzip — Werte in `tokens.css` ändern:

```css
--space-4: 16px;       /* Abstände */
--radius-lg: 8px;      /* Radius */
--shadow-md: 0 4px ... /* Schatten */
--duration-normal: 200ms;
```

---

## 2. Eine bestehende Komponente bearbeiten

Jede Komponente liegt als einzelne JSX-Datei in `src/components/<Name>/<Name>.jsx`.

### Beispiel: Button — neue Variante hinzufügen

```jsx
// src/components/Button/Button.jsx
const variants = cva('...Basis-Klassen...', {
  variants: {
    variant: {
      primary:   '...',
      secondary: '...',
      // Neue Variante:
      brand: 'bg-[var(--color-brand-accent-500)] text-white hover:bg-[var(--color-brand-accent-600)]',
    },
  },
})
```

Danach die neue Variante in der Dokumentationsseite ([`src/pages/ButtonsPage.jsx`](src/pages/ButtonsPage.jsx)) demonstrieren und den i18n-Schlüssel eintragen.

### Styling-Regeln

- Tailwind-Utility-Klassen verwenden, **keine** neuen `.module.css`-Dateien anlegen
- Farbwerte immer als `text-[var(--color-*)]` oder `bg-[var(--color-*)]` — nie als `text-blue-500`
- Schriftgrößen als `text-xs`, `text-sm`, `text-md` etc. — **nicht** `text-[var(--text-*)]`
- Für bedingte Klassen: `cn()` aus `src/lib/utils.js` verwenden

```jsx
import { cn } from '@/lib/utils'

<div className={cn('base-class', condition && 'optional-class')} />
```

---

## 3. Eine neue Komponente anlegen

### Schritt 1 — shadcn/ui-Primitiv installieren (falls vorhanden)

```bash
cd c:/Programming/medo-design_system
npx shadcn@latest add <komponent-name>
# Erzeugt src/components/ui/<komponent-name>.tsx
```

### Schritt 2 — Komponenten-Datei anlegen

```
src/components/MeineKomponente/MeineKomponente.jsx
```

```jsx
import { cn } from '@/lib/utils'

export function MeineKomponente({ variant = 'default', children, className }) {
  return (
    <div className={cn(
      'bg-[var(--surface_100)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--space-4)]',
      variant === 'raised' && 'shadow-[var(--shadow-md)]',
      className
    )}>
      {children}
    </div>
  )
}
```

**Wichtig:** Keine hardcodierten Farb- oder Abstands-Werte. Nur Token-Referenzen aus `tokens.css`.

### Schritt 3 — In index.js exportieren

```js
// src/components/index.js
export { MeineKomponente } from './MeineKomponente/MeineKomponente.jsx'
```

### Schritt 4 — Dokumentationsseite anlegen

Siehe [Abschnitt 5](#5-eine-neue-dokumentationsseite-anlegen).

---

## 4. Eine Dokumentationsseite bearbeiten

Alle Seiten liegen in [`src/pages/`](src/pages/). Sie folgen dem PageLayout-Muster mit 4 Tabs.

### Aufbau einer Seite

```jsx
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, GridWrapper, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Button } from '../components'

export default function ButtonsPage() {
  const { t } = useTranslation()

  const tabs = [
    { id: 'overview',     label: t('tabs.overview'),     content: <OverviewTab t={t} /> },
    { id: 'usage',        label: t('tabs.usage'),        content: <UsageTab t={t} /> },
    { id: 'code',         label: t('tabs.code'),         content: <CodeTab t={t} /> },
    { id: 'accessibility',label: t('tabs.accessibility'),content: <A11yTab t={t} /> },
  ]

  return (
    <PageLayout
      title={t('buttons.page.title')}
      description={t('buttons.page.description')}
      tabs={tabs}
    />
  )
}
```

### Tab-Struktur mit Section und GridWrapper

```jsx
function OverviewTab({ t }) {
  return (
    <>
      {/* Abschnitt mit Titel */}
      <Section title={t('buttons.overview.anatomyTitle')}>
        <Content>
          <ol>
            <li>{t('buttons.overview.anatomy1')}</li>
            <li>{t('buttons.overview.anatomy2')}</li>
          </ol>
        </Content>
      </Section>

      {/* Live-Demo-Grid (automatische Spaltenanzahl) */}
      <Section title={t('buttons.overview.variantsTitle')}>
        <GridWrapper>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </GridWrapper>
      </Section>
    </>
  )
}
```

### Do/Don't-Paare

```jsx
<GridWrapper>
  {/* Do */}
  <div className="border border-[var(--color-success-500)] rounded-[var(--radius-lg)] p-[var(--space-4)]">
    <div className="text-xs font-semibold text-[var(--color-success-700)] mb-2">✓ Do</div>
    <p className="text-sm text-[var(--color-text-secondary)]">{t('buttons.usage.do1')}</p>
  </div>
  {/* Don't */}
  <div className="border border-[var(--color-error-500)] rounded-[var(--radius-lg)] p-[var(--space-4)]">
    <div className="text-xs font-semibold text-[var(--color-error-700)] mb-2">✗ Don't</div>
    <p className="text-sm text-[var(--color-text-secondary)]">{t('buttons.usage.dont1')}</p>
  </div>
</GridWrapper>
```

### Code-Snippets

```jsx
<Section title="Beispiele">
  <CodeBlock language="jsx" code={`<Button variant="primary">Speichern</Button>`} />
</Section>
```

### Keyboard-Tabelle (Accessibility-Tab)

```jsx
<table className="w-full text-sm border-collapse">
  <thead>
    <tr className="border-b border-[var(--color-border)]">
      <th className="text-left py-2 pr-4 font-semibold">Taste</th>
      <th className="text-left py-2 font-semibold">Funktion</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-[var(--color-border-subtle)]">
      <td className="py-2 pr-4 font-mono text-xs">Tab</td>
      <td className="py-2 text-[var(--color-text-secondary)]">{t('buttons.a11y.keyTab')}</td>
    </tr>
    <tr>
      <td className="py-2 pr-4 font-mono text-xs">Enter / Space</td>
      <td className="py-2 text-[var(--color-text-secondary)]">{t('buttons.a11y.keyEnter')}</td>
    </tr>
  </tbody>
</table>
```

---

## 5. Eine neue Dokumentationsseite anlegen

### Schritt 1 — Seite anlegen

Neue Datei erstellen: `src/pages/MeineSeite.jsx`

Ausgangspunkt (vollständige 4-Tab-Struktur):

```jsx
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, GridWrapper, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { MeineKomponente } from '../components'

export default function MeinePage() {
  const { t } = useTranslation()

  const CODE = `<MeineKomponente variant="default">Inhalt</MeineKomponente>`

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('meine.overview.anatomyTitle')}>
            <Content>
              <ol>
                <li>{t('meine.overview.anatomy1')}</li>
                <li>{t('meine.overview.anatomy2')}</li>
              </ol>
            </Content>
          </Section>
          <Section title={t('meine.overview.demoTitle')}>
            <MeineKomponente>Demo-Inhalt</MeineKomponente>
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <Section title={t('meine.usage.title')}>
          <Content>
            <p>{t('meine.usage.description')}</p>
          </Content>
          <GridWrapper>
            {/* Do/Don't-Paare */}
          </GridWrapper>
        </Section>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <Section title={t('meine.code.exampleTitle')}>
          <CodeBlock language="jsx" code={CODE} />
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <Section title={t('meine.a11y.title')}>
          <Content>
            <p>{t('meine.a11y.description')}</p>
          </Content>
        </Section>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('meine.page.title')}
      description={t('meine.page.description')}
      tabs={tabs}
    />
  )
}
```

### Schritt 2 — Route in App.jsx eintragen

```jsx
// src/App.jsx
import MeinePage from './pages/MeinePage'

// In der Routes-Liste:
<Route path="/meine" element={<MeinePage />} />
```

### Schritt 3 — Navigation eintragen

Siehe [Abschnitt 6](#6-die-seitennavigation-erweitern).

### Schritt 4 — i18n-Keys eintragen

Siehe [Abschnitt 7](#7-übersetzungen-i18n-pflegen).

---

## 6. Die Seitennavigation erweitern

Die Sidebar-Navigation wird in [`src/docs/DocsLayout.jsx`](src/docs/DocsLayout.jsx) definiert:

```jsx
const NAV = [
  {
    section: 'nav.sections.foundations',
    items: [
      { id: 'colors',     label: 'nav.items.colors' },
      // ...
    ],
  },
  {
    section: 'nav.sections.components',
    items: [
      { id: 'buttons', label: 'nav.items.buttons' },
      // Neuer Eintrag:
      { id: 'meine', label: 'nav.items.meine' },
    ],
  },
]
```

`id` entspricht dem URL-Pfad (`/meine`). Den Label-Schlüssel in `de.json` und `en.json` eintragen:

```json
// de.json → "nav": { "items": { "meine": "Meine Seite" } }
// en.json → "nav": { "items": { "meine": "My Page" } }
```

---

## 7. Übersetzungen (i18n) pflegen

### Keys eintragen

Beide Dateien müssen immer synchron sein:

```json
// src/i18n/locales/de.json
{
  "meine": {
    "page": {
      "title": "Meine Komponente",
      "description": "Kurze Beschreibung."
    },
    "overview": {
      "anatomyTitle": "Anatomie",
      "anatomy1": "Container-Element",
      "anatomy2": "Inhalt"
    }
  }
}
```

```json
// src/i18n/locales/en.json
{
  "meine": {
    "page": {
      "title": "My Component",
      "description": "Short description."
    },
    "overview": {
      "anatomyTitle": "Anatomy",
      "anatomy1": "Container element",
      "anatomy2": "Content"
    }
  }
}
```

### Bestehende Namespaces

| Namespace | Seite |
|---|---|
| `tabs.*` | Globale Tab-Labels (reserviert — nicht überschreiben) |
| `nav.*` | Sidebar-Navigation |
| `buttons.*` | ButtonsPage |
| `inputs.*` | InputsPage |
| `selects.*` | SelectsPage |
| `toggle.*` | TogglePage |
| `badges.*` | BadgesPage |
| `alerts.*` | AlertsPage |
| `cards.*` | CardsPage |
| `tables.*` | TablesPage |
| `tabsPage.*` | TabsPage (nicht `tabs.*`!) |
| `navigation.*` | NavigationPage |
| `overlays.*` | OverlaysPage |
| `accordion.*` | AccordionPage |
| `menus.*` | MenusPage |
| `lists.*` | ListsPage |
| `stats.*` | StatsPage |
| `feedback.*` | FeedbackPage |
| `avatar.*` | AvatarPage |
| `skeleton.*` | SkeletonPage |

---

## 8. Docs-Infrastruktur: PageLayout und Hilfskomponenten

### PageLayout

```jsx
import { PageLayout, Section, GridWrapper, Grid, Content } from '../docs/PageLayout'

// Seitenrahmen mit Tab-Navigation:
<PageLayout title="..." description="..." tabs={[...]} />

// Abschnitt mit optionalem Titel (max-w: 980px, px-8):
<Section title="Anatomie">...</Section>

// Auto-Grid (1–6 Spalten je nach Kindanzahl, responsive):
<GridWrapper>
  <ComponentA />
  <ComponentB />
  <ComponentC />
</GridWrapper>

// Fließtext-Container mit Listenformatierung:
<Content>
  <p>Absatz</p>
  <ul><li>Punkt</li></ul>
</Content>
```

### CodeBlock

```jsx
import { CodeBlock } from '../docs/CodeBlock'

<CodeBlock
  language="jsx"
  code={`<Button variant="primary">Speichern</Button>`}
/>
```

### TokensTable (für Foundation-Seiten)

```jsx
import { TokensTable } from '../docs/TokensTable'

<TokensTable tokens={[
  { name: '--color-brand-primary-500', value: '#1C2855', description: 'Primärfarbe Navy' },
]} />
```

### DocSection (ältere Hilfskomponenten)

```jsx
import { SubSection, Row, Grid2, TokenChip } from '../docs/DocSection'
```

---

## 9. CSS und Tailwind

### global.css — was sich nie ändern sollte

[`src/styles/global.css`](src/styles/global.css) enthält **einen** `@theme inline`-Block und **einen** `:root`-Block. Folgende Regeln sind kritisch:

```css
/* RICHTIG: Literal-String, kein var() */
--font-sans: 'Geist Variable', sans-serif;

/* RICHTIG: Konkreter Pixel-Wert */
--radius: 8px;

/* FALSCH — erzeugt zirkuläre Referenz: */
--font-sans: var(--font-sans);   /* ← NIE so */
--radius: var(--radius-lg);      /* ← NIE so */
```

**Kein `@import "shadcn/tailwind.css"`** — der Inhalt ist bereits inline in `global.css`.  
**Kein `@source`** — `@tailwindcss/vite` scannt automatisch alle Projektdateien.

### shadcn/ui-Komponenten aktualisieren

Neue shadcn/ui-Primitiven installieren:

```bash
npx shadcn@latest add <name>
```

Das erzeugt Dateien in `src/components/ui/`. Danach **manuell prüfen**, ob `global.css` verändert wurde — falls shadcn einen neuen `@theme`- oder `@import`-Block eingefügt hat, diesen entfernen und ggf. nötigen Inhalt in den bestehenden Block integrieren.

### med.o-Overrides in global.css

Eigene Token-Überschreibungen kommen **nach** dem shadcn/ui-Block im `@theme inline`:

```css
@theme inline {
  /* shadcn Defaults */
  ...
  /* med.o Overrides */
  --color-primary: var(--color-brand-primary-500);
}
```

---

## 10. Responsive Anpassung

Tailwind v4 verwendet Breakpoint-Modifier direkt als Klassen-Präfix. Im Projekt wird ausschließlich der **Mobile-First**-Ansatz gebrochen durch `max-*`-Varianten — d.h. Stile gelten standardmäßig für Desktop und werden bei kleineren Viewports überschrieben.

### Verwendete Breakpoints

| Modifier | Breakpoint | Einsatz im Projekt |
|---|---|---|
| `max-md:` | ≤ 767 px | Sidebar → Hamburger-Navigation; Hauptinhalt ohne left margin |
| `max-[640px]:` | ≤ 640 px | GridWrapper: mehrspaltig → einspaltig |
| `max-[1024px]:` | ≤ 1024 px | GridWrapper: 3–6-spaltig → 2–3-spaltig |

### Responsive Klassen schreiben

```jsx
{/* Desktop: 3 Spalten, Tablet: 2 Spalten, Mobil: 1 Spalte */}
<div className="grid grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
  ...
</div>

{/* Text größer auf Desktop, kleiner auf Mobil */}
<h1 className="text-5xl max-md:text-3xl">Überschrift</h1>

{/* Element auf Desktop sichtbar, auf Mobil ausgeblendet */}
<div className="block max-md:hidden">Nur Desktop</div>

{/* Element nur auf Mobil sichtbar */}
<div className="hidden max-md:block">Nur Mobil</div>
```

### GridWrapper — automatisches responsives Grid

`GridWrapper` aus `PageLayout.jsx` übernimmt die Spaltenanzahl automatisch basierend auf der Anzahl der Kinder:

```jsx
{/* 3 Kinder → 3 Spalten Desktop, 2 Tablet, 1 Mobil — automatisch */}
<GridWrapper>
  <KindA />
  <KindB />
  <KindC />
</GridWrapper>
```

Für manuelle Kontrolle ein eigenes `<div>` mit expliziten Grid-Klassen verwenden.

### Sidebar und Navigation

Die Sidebar (`DocsLayout.jsx`) wechselt bei `max-md` (≤ 767 px) zu einer Hamburger-Navigation. Der Hauptinhalt erhält dann keinen `ml-[220px]` mehr und nutzt den vollen Viewport. Das `pt-[56px]` kompensiert den fixen Mobile-Header.

```jsx
{/* Aus DocsLayout.jsx — Muster für responsive Layout-Anpassung */}
<nav className="fixed w-[220px] max-md:w-[280px] max-md:-translate-x-full max-md:data-[mobile-open=true]:translate-x-0" />
<main className="ml-[220px] max-md:ml-0 max-md:pt-[56px]" />
```

### Eigene Breakpoints definieren

Für einmalige Sonderfälle kann ein beliebiger Pixel-Wert als Breakpoint angegeben werden:

```jsx
<div className="grid-cols-4 max-[900px]:grid-cols-2">...</div>
```

Wiederkehrende Breakpoints besser als Token in `tokens.css` dokumentieren und per `@custom-variant` in `global.css` registrieren:

```css
/* global.css */
@custom-variant tablet (&:is([data-viewport="tablet"] *));
```

---

## 11. States: Hover, Active, Focus und mehr

Tailwind-State-Modifier werden als Klassen-Präfix geschrieben. Alle Farbwerte bleiben Token-Referenzen — auch in State-Klassen.

### Hover

```jsx
{/* Hintergrundfarbe bei Hover */}
<button className="hover:bg-[var(--surface_200)]">...</button>

{/* Textfarbe bei Hover */}
<a className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Link</a>

{/* Mehrere Eigenschaften kombinieren */}
<div className="hover:bg-[var(--color-neutral-100)] hover:shadow-[var(--shadow-md)] transition-[background,box-shadow] duration-[var(--duration-fast)]">
  ...
</div>
```

### Active (Gedrückt)

```jsx
<button className="active:scale-95 active:bg-[var(--color-brand-primary-600)] transition-transform duration-[var(--duration-fast)]">
  Klick mich
</button>
```

### Focus und Focus-Visible

`focus-visible` ist gegenüber `focus` zu bevorzugen — es greift nur bei Tastatur-Navigation, nicht bei Mausklick:

```jsx
{/* Tastatur-Fokus-Ring (WCAG-konform) */}
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-500)] focus-visible:ring-offset-2">
  Barrierefrei
</button>

{/* Fokus ohne sichtbaren Ring (nur wenn anderer Indikator vorhanden) */}
<input className="focus:outline-none focus:border-[var(--color-focus-500)] focus:ring-1 focus:ring-[var(--color-focus-500)]" />
```

**Regel:** Niemals `outline-none` oder `ring-0` setzen ohne gleichwertigen visuellen Fokus-Indikator — das verletzt WCAG 2.4.7.

### Disabled

```jsx
{/* Visuelle Deaktivierung */}
<button
  disabled
  className="disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
>
  Gesperrt
</button>

{/* Für nicht-native Elemente (div, span) mit aria-disabled */}
<div
  aria-disabled="true"
  className="aria-disabled:opacity-40 aria-disabled:cursor-not-allowed"
>
  ...
</div>
```

### Checked / Selected (Toggle, Checkbox, Radio)

```jsx
{/* Zustand über data-Attribut steuern (shadcn/ui-Muster) */}
<button
  data-checked={isChecked}
  className="data-[checked=true]:bg-[var(--color-brand-primary-500)] data-[checked=true]:text-white"
>
  ...
</button>
```

### Group-Hover (übergeordnetes Element steuert Kind)

```jsx
{/* Klasse 'group' am Container, 'group-hover:' am Kind */}
<div className="group flex items-center gap-3 p-[var(--space-3)] rounded-[var(--radius-md)]">
  <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
    Label
  </span>
  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)]">
    Aktion
  </button>
</div>
```

Reales Beispiel aus `Table.jsx`: Tabellenzeilen zeigen Hover-Hintergrund, alle Zellen reagieren auf das `group`-Element der Zeile.

```jsx
<tr className="group">
  <td className="group-hover:bg-[var(--surface_200)]">...</td>
</tr>
```

### Transitions

State-Übergänge immer mit Token-Werten für Dauer und Easing:

```jsx
{/* Einzelne Eigenschaft */}
<div className="transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]">

{/* Mehrere Eigenschaften */}
<div className="transition-[color,background,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out)]">

{/* Alle Eigenschaften (Performance-Vorsicht bei transform/opacity) */}
<div className="transition-all duration-[var(--duration-slow)]">
```

### State-Token-Referenz

| State | Empfohlene Tokens |
|---|---|
| Hover Hintergrund | `--surface_200`, `--color-neutral-100` |
| Hover Text | `--color-text-primary` |
| Fokus-Ring | `--color-focus-500` |
| Aktiv / Gedrückt | `--color-brand-primary-600` (dunkler als 500) |
| Disabled | `opacity-40` + `cursor-not-allowed` |
| Selected / Checked | `--color-brand-primary-500` als Hintergrund |
| Danger / Error | `--color-error-500`, `--color-error-container-100` |

---

## 12. Qualitätssicherung

### Vor jedem Commit

```bash
npm run build
```

Der Build muss fehlerfrei durchlaufen. Warnungen wegen Chunk-Größe sind bekannt und unkritisch.

### Visueller Check

```bash
npm run dev
```

Geänderte Seiten im Browser aufrufen, alle Tabs durchklicken, verschiedene Viewport-Breiten prüfen (Desktop / Mobile ≤ 768 px — Sidebar klappt zur Hamburger-Navigation um).

### Checkliste für neue Inhalte

- [ ] Alle User-facing Strings in `t()` — kein hardcodiertes Deutsch in JSX
- [ ] Neue Keys in `de.json` **und** `en.json` eingetragen
- [ ] Nur Token-Referenzen aus `tokens.css` — keine hardcodierten Farbwerte
- [ ] Schriftgrößen als `text-xs/sm/md/lg` — nicht `text-[var(--text-*)]`
- [ ] `npm run build` fehlerfrei
- [ ] Route in `App.jsx` und Navigation in `DocsLayout.jsx` eingetragen (falls neue Seite)
- [ ] Barrel-Export in `src/components/index.js` (falls neue Komponente)
