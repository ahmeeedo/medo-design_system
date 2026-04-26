# Design System — med.o

Vollständiges Design System und Styling Richtlinien von med.o (als Vite + React Projekt)

## Schnellstart

```bash
npm install
npm run dev
```

Öffne dann [http://localhost:5173](http://localhost:5173)

## Struktur

```
src/
├── styles/
│   ├── tokens.css          # Alle CSS Custom Properties (Design Tokens)
│   └── global.css          # Reset & Base Styles
├── components/
│   ├── Button/             # Button (6 Varianten, 5 Größen)
│   ├── Input/              # Input, Textarea, Select, InputWithAddon
│   ├── Toggle/             # Toggle, Checkbox, Radio
│   ├── Badge/              # Badge, Tag
│   ├── Alert/              # Alert (4 Typen), Toast
│   ├── Card/               # Card (flat/raised) + Header/Body/Footer
│   ├── Table/              # Table mit render-Funktion pro Spalte
│   ├── Tabs/               # Tabs (underline/pill)
│   ├── Avatar/             # Avatar, AvatarGroup
│   ├── Modal/              # Modal mit Keyboard-Support (Escape)
│   ├── Accordion/          # Accordion (single/multi-open)
│   ├── Progress/           # Progress Bar (5 Varianten, 3 Größen)
│   ├── Skeleton/           # Skeleton, SkeletonCard
│   ├── Menu/               # Menu.Item, Menu.Label, Menu.Separator
│   ├── Navigation/         # Breadcrumb, Pagination, StatCard
│   └── index.js            # Barrel Export aller Komponenten
└── docs/
    ├── DocsLayout.jsx      # Sidebar + Main Layout
    ├── DocSection.jsx      # Section, SubSection, Row, Grid2, TokenChip
    └── *.module.css
```

## Tokens anpassen

Alle Design-Entscheidungen sind in `src/styles/tokens.css` als CSS Custom Properties
definiert. Ändere dort die Werte — alle Komponenten übernehmen die Änderungen
automatisch.

## Komponenten nutzen

```jsx
import { Button, Input, Badge, Card, Modal } from "./components";

function MyPage() {
  return (
    <Card variant="raised">
      <Card.Header title="Titel" subtitle="Beschreibung" />
      <Card.Body>
        <Input label="Name" placeholder="Dein Name…" />
        <Badge variant="success" dot>
          Aktiv
        </Badge>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">Speichern</Button>
      </Card.Footer>
    </Card>
  );
}
```

## Build

```bash
npm run build
```

Die fertige App liegt dann in `dist/`.
