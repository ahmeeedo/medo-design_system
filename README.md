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

## Projektstruktur

```
src/
├── styles/
│   ├── tokens.css          # Alle Design-Tokens als CSS Custom Properties
│   └── global.css          # Tailwind + shadcn/ui Basis, @theme inline, :root
├── components/
│   ├── Button/Button.jsx
│   ├── Input/Input.jsx
│   ├── Toggle/Toggle.jsx
│   ├── Badge/Badge.jsx
│   ├── Alert/Alert.jsx
│   ├── Card/Card.jsx
│   ├── Table/Table.jsx
│   ├── Tabs/Tabs.jsx
│   ├── Avatar/Avatar.jsx
│   ├── Modal/Modal.jsx
│   ├── Accordion/Accordion.jsx
│   ├── Progress/Progress.jsx
│   ├── Skeleton/Skeleton.jsx
│   ├── Menu/Menu.jsx
│   ├── Navigation/Navigation.jsx   # Breadcrumb, Pagination, StatCard
│   └── index.js                    # Barrel-Export
├── docs/
│   ├── DocsLayout.jsx      # Sidebar + Hauptlayout
│   ├── PageLayout.jsx      # Seitenrahmen mit Tabs (Section, GridWrapper, Content)
│   ├── DocSection.jsx      # Hilfskomponenten (SubSection, Row, Grid2, TokenChip)
│   ├── CodeBlock.jsx       # Syntax-Highlight-Block
│   ├── TokensTable.jsx     # Token-Tabelle für Foundation-Seiten
│   ├── LanguageSwitcher.jsx
│   └── helpers.jsx
├── pages/                  # 24 Dokumentationsseiten
├── i18n/
│   ├── index.js            # i18next-Konfiguration
│   └── locales/
│       ├── de.json         # Deutsch (Standard)
│       └── en.json         # Englisch
├── lib/utils.js            # cn() Tailwind-Merge-Hilfsfunktion
├── App.jsx                 # Router + Routing-Tabelle
└── main.jsx                # React-Einstiegspunkt
```

---

## Design-Token-System

Alle Design-Entscheidungen leben in [`src/styles/tokens.css`](src/styles/tokens.css) als CSS Custom Properties im `:root`-Block. Tailwind liest diese Tokens über `@theme inline` in `global.css` ein — keine Werte in `tailwind.config.js`.

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

Alle Komponenten werden aus `src/components/index.js` importiert:

```jsx
import { Button, Input, Badge, Card, Modal, ... } from './components'
```

### Button

```jsx
<Button
  variant="primary"      // primary | secondary | ghost | outline | danger | accent
  size="md"              // xs | sm | md | lg | xl
  disabled={false}
  leadingIcon={<Icon />}
  trailingIcon={<Icon />}
  onClick={fn}
>
  Beschriftung
</Button>
```

### Input / Textarea / Select / InputWithAddon

```jsx
<Input
  label="Bezeichnung"
  placeholder="..."
  size="md"              // sm | md | lg
  error="Fehlermeldung"
  disabled={false}
/>

<Textarea label="Notizen" rows={4} />

<Select
  label="Kategorie"
  options={['Option A', 'Option B']}
  // oder: options={[{ value: 'a', label: 'Option A' }]}
  defaultValue="Option A"
/>

<InputWithAddon addon="https://" placeholder="domain.de" />
```

### Toggle / Checkbox / Radio

```jsx
<Toggle label="Benachrichtigungen" checked={bool} onChange={fn} />
<Checkbox label="Zustimmen" checked={bool} onChange={fn} disabled={false} />
<Radio label="Option A" name="gruppe" value="a" checked={bool} onChange={fn} />
```

### Badge / Tag

```jsx
<Badge
  variant="neutral"      // neutral | accent | success | warning | error
  size="md"              // sm | md
  dot={false}
>
  Label
</Badge>

<Tag onRemove={() => {}}>Entfernbar</Tag>
```

### Alert

```jsx
<Alert variant="info" title="Hinweis">
  Meldungstext
</Alert>
// variant: info | success | warning | error
// title ist optional
```

### Card

```jsx
<Card variant="flat">    {/* flat | raised */}
  <Card.Header title="Titel" subtitle="Untertitel">
    <Button size="sm">Aktion</Button>  {/* optionaler Action-Slot */}
  </Card.Header>
  <Card.Body>Inhalt</Card.Body>
  <Card.Footer>
    <Button variant="primary">Speichern</Button>
  </Card.Footer>
</Card>
```

### Table

```jsx
<Table
  columns={[
    { key: 'name',   label: 'Name' },
    { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> },
  ]}
  rows={[{ id: 1, name: 'Alice', status: 'Aktiv' }]}
  rowKey="id"
/>
```

### Tabs

```jsx
<Tabs
  variant="underline"    // underline | pill
  defaultTab="tab1"
  tabs={[
    { id: 'tab1', label: 'Übersicht', content: <div>...</div> },
    { id: 'tab2', label: 'Details',   content: <div>...</div> },
  ]}
/>

{/* Controlled: */}
<Tabs
  activeTab={activeTab}
  onTabChange={setActiveTab}
  tabs={...}
/>
```

### Avatar / AvatarGroup

```jsx
<Avatar
  size="md"              // xs | sm | md | lg | xl
  initials="AJ"
  color="#1C2855"
  textColor="#fff"
  src="/path/to/image.jpg"
  alt="Alice Jones"
/>

<AvatarGroup
  avatars={[{ initials: 'AJ', color: '#1C2855', textColor: '#fff' }, ...]}
  max={4}
  size="md"
/>
```

### Modal

```jsx
const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Öffnen</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Titel"
  size="md"              // sm | md | lg
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Abbrechen</Button>
      <Button variant="primary">Bestätigen</Button>
    </>
  }
>
  Modalinhalt
</Modal>
```

### Accordion

```jsx
<Accordion
  allowMultiple={false}
  items={[
    { id: 'item1', title: 'Frage 1', content: <p>Antwort 1</p> },
    { id: 'item2', title: 'Frage 2', content: <p>Antwort 2</p> },
  ]}
/>
```

### Progress

```jsx
<Progress
  value={75}             // 0–100
  variant="neutral"      // neutral | accent | success | warning | error
  size="md"              // sm | md | lg
  label="Ladefortschritt"
  showValue={true}
/>
```

### Skeleton / SkeletonCard

```jsx
<Skeleton variant="rect" width={200} height={120} />
<Skeleton variant="text" width="80%" height={14} />
<Skeleton variant="circle" width={40} height={40} />

<SkeletonCard />   {/* Vorgefertigtes Karten-Platzhalter-Layout */}
```

### Menu

```jsx
<Menu trigger={<Button variant="secondary">Optionen</Button>}>
  <Menu.Label>Abschnitt</Menu.Label>
  <Menu.Item icon="✏️" shortcut="⌘E" onClick={fn}>Bearbeiten</Menu.Item>
  <Menu.Item icon="📋">Kopieren</Menu.Item>
  <Menu.Separator />
  <Menu.Item icon="🗑️" danger onClick={fn}>Löschen</Menu.Item>
  <Menu.Item disabled>Gesperrt</Menu.Item>
</Menu>
```

### Breadcrumb / Pagination / StatCard

```jsx
<Breadcrumb items={[
  { label: 'Start', href: '/' },
  { label: 'Komponenten', href: '/components' },
  { label: 'Breadcrumb' },
]} />

<Pagination current={3} total={10} onChange={(page) => setPage(page)} />

<StatCard
  label="Aktive Nutzer"
  value="12.847"
  delta="↑ 4,2 %"
  deltaDir="up"          // up | down | neutral
/>
```

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
