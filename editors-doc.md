# editors-doc — Entwickler-Kurzanleitung

Handlungsorientierte Referenz für häufige Aufgaben im med.o Design System.

---

## 1. Neue Komponente anlegen

### Schritt 1 — Komponenten-Datei erstellen

```
src/components/<Name>/<Name>.jsx
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

Regeln:
- Nur Token-Referenzen aus `tokens.css` — keine hardcodierten Farbwerte
- Schriftgrößen als `text-xs/sm/md/lg` — **nicht** `text-[var(--text-*)]`
- Bedingte Klassen über `cn()` aus `src/lib/utils.js`

### Schritt 2 — Export in `src/components/index.js`

```js
export { MeineKomponente } from './MeineKomponente/MeineKomponente.jsx'
```

### Schritt 3 — Docs-Seite anlegen

Neue Datei: `src/pages/MeineKomponentePage.jsx` → siehe [Abschnitt 3](#3-neue-docs-page-anlegen).

### Schritt 4 — Route in `src/App.jsx` eintragen

```jsx
import MeineKomponentePage from './pages/MeineKomponentePage'

// In der <Routes>-Liste:
<Route path="/meine-komponente" element={<MeineKomponentePage />} />
```

### Schritt 5 — Nav-Eintrag in `src/docs/DocsLayout.jsx`

```jsx
const NAV = [
  {
    id: 'components',
    section: 'nav.sections.components',
    items: [
      // ...bestehende Einträge...
      { id: 'meine-komponente', label: 'nav.items.meineKomponente' },
    ],
  },
]
```

`id` entspricht dem URL-Pfad (ohne führenden Slash).

### Schritt 6 — i18n-Keys eintragen

→ Beide Locale-Dateien befüllen: `src/i18n/locales/de.json` und `src/i18n/locales/en.json`. Siehe [Abschnitt 4](#4-i18n-keys-ergänzen).

---

## 2. Neue Sektion auf bestehender Page

Alle Seiten liegen in `src/pages/`. Eine Sektion besteht aus `<Section>` mit optionalem `<Content>` oder `<GridWrapper>` darunter.

```jsx
import { Section, Content, GridWrapper } from '../docs/PageLayout'

<Section title={t('meine.overview.neueSektion')}>
  {/* Fließtext */}
  <Content>
    <p>{t('meine.overview.neuerAbsatz')}</p>
    <ul>
      <li>{t('meine.overview.punkt1')}</li>
    </ul>
  </Content>

  {/* Oder: Side-by-Side-Grid (Anzahl Kinder bestimmt Spaltenanzahl) */}
  <GridWrapper>
    <div>{/* Linke Spalte */}</div>
    <div>{/* Rechte Spalte */}</div>
  </GridWrapper>
</Section>
```

Neue i18n-Keys direkt in beiden Locale-Dateien eintragen (→ [Abschnitt 4](#4-i18n-keys-ergänzen)).

---

## 3. Neue Docs-Page anlegen

Neue Datei: `src/pages/MeinePage.jsx`

```jsx
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, GridWrapper } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { MeineKomponente } from '../components'

export default function MeinePage() {
  const { t } = useTranslation()

  return (
    <PageLayout
      title={t('meine.page.title')}
      description={t('meine.page.description')}
      tabs={[
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
                <MeineKomponente>Demo</MeineKomponente>
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
            </Section>
          ),
        },
        {
          id: 'code',
          label: t('tabs.code'),
          content: (
            <Section title={t('meine.code.exampleTitle')}>
              <CodeBlock language="jsx">{`<MeineKomponente variant="default">Inhalt</MeineKomponente>`}</CodeBlock>
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
      ]}
    />
  )
}
```

**Tab-IDs:** `overview`, `usage`, `code`, `accessibility` — immer alle vier anlegen.  
**`tabs.*`-Namespace ist reserviert** — nicht für eigene Seiteninhalte verwenden.

Danach Route und Nav-Eintrag ergänzen (→ [Abschnitt 1, Schritt 4–5](#1-neue-komponente-anlegen)).

---

## 4. i18n-Keys ergänzen

Beide Dateien müssen immer synchron gehalten werden:

- `src/i18n/locales/de.json` — Deutsch (Standardsprache)
- `src/i18n/locales/en.json` — Englisch

### Namespace-Konvention

Jede Seite erhält einen eigenen Top-Level-Namespace:

| Namespace | Seite |
|---|---|
| `tabs.*` | Globale Tab-Labels — **reserviert, nicht überschreiben** |
| `nav.*` | Sidebar-Navigation |
| `buttons.*` | ButtonsPage |
| `inputs.*` | InputsPage |
| `colors.*` | ColorsPage |
| `typography.*` | TypographyPage |
| `tabsPage.*` | TabsPage (nicht `tabs.*`!) |
| *(eigener Name)* | Neue Seite |

### Beispiel

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
  },
  "nav": {
    "items": {
      "meineKomponente": "Meine Komponente"
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
  },
  "nav": {
    "items": {
      "meineKomponente": "My Component"
    }
  }
}
```

Jeder in JSX verwendete `t('...')`-Key muss in **beiden** Dateien vorhanden sein.

---

## 5. DemoPanel-Konfiguration

_(folgt nach DemoPanel-Implementierung)_
