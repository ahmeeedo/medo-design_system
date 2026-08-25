# Entwickler-Leitfaden — med.o Design System

Dieser Leitfaden beschreibt, wie in **diesem Repository** gearbeitet wird: Tokens
und Theme ändern, Komponenten bearbeiten, Doku-Seiten anlegen, Navigation und
Übersetzungen pflegen, Tests schreiben und die Abnahme fahren.

Er richtet sich an Mitarbeitende am Repository. Für den Einstieg und den
Überblick über das System siehe `README.md`. Für die Kurzreferenz — Skripte,
Pfade, Checklisten, Fallen auf einen Blick — siehe `editors-doc.md`; sie
wiederholt diesen Leitfaden nicht, sondern verweist auf ihn.

---

## Inhaltsverzeichnis

1. [Aufbau des Repositories](#1-aufbau-des-repositories)
2. [Einrichten und Skripte](#2-einrichten-und-skripte)
3. [Token und Theme ändern](#3-token-und-theme-ändern)
4. [Eine Komponente bearbeiten](#4-eine-komponente-bearbeiten)
5. [Eine Doku-Seite anlegen](#5-eine-doku-seite-anlegen)
6. [Navigation und Routen erweitern](#6-navigation-und-routen-erweitern)
7. [Übersetzungen pflegen](#7-übersetzungen-pflegen)
8. [Suchindex erzeugen](#8-suchindex-erzeugen)
9. [Tests schreiben](#9-tests-schreiben)
10. [Die Bibliothek bauen](#10-die-bibliothek-bauen)
11. [Abnahmeverfahren](#11-abnahmeverfahren)

---

## 1. Aufbau des Repositories

Das Repository enthält zwei Dinge, die getrennt bleiben: die **Komponenten** des
Design Systems und das **Portal**, das sie dokumentiert.

```
src/
  components/        36 Komponenten, je <Name>/<Name>.jsx + <Name>.css
    index.js         Barrel — die einzige Import-Adresse nach außen
  pages/             43 Doku-Seiten, je eine <Name>Page.jsx
  docs/              Portal-Gerüst: PageLayout, DemoPanel, Suche, Navigation
  styles/            Tokens, Theme, globale Stile
    medo/            8 Token-Dateien — Spiegel des Design-Projekts, unantastbar
  i18n/locales/      de.json und en.json
  config/            searchData.js und sectionData.js — erzeugt, nicht gepflegt
  lib/tokens.js      Stil-Einstiegspunkt des Pakets
scripts/             Suchindex-Generator, Kontrastwerkzeug, Paket-Build
design-reference/    Design-Wahrheit — ausschließlich lesend
```

### Die zwei Welten

Die Grenze verläuft an der Verzeichnisgrenze und ist verbindlich:

| | Komponenten (`src/components/`) | Portal (`src/docs/`, `src/pages/`) |
|---|---|---|
| Stile | klassenbasiertes CSS in `<Name>.css` | Utility-Klassen im JSX |
| Werte | ausschließlich `--medo-*`-Tokens | ausschließlich `--medo-*`-Tokens |
| Utility-Klassen | **nein** | ja |

Beide Welten beziehen jeden Farb-, Abstands-, Radius- und Schattenwert aus
Tokens. Der Unterschied liegt nur darin, wie der Wert an das Element kommt. Im
Portal geschieht das über die Klammerschreibweise:

```jsx
<div className="bg-[var(--medo-surface-container)] p-[var(--medo-space-lg)]">
```

Hartkodierte Werte sind in beiden Welten ausgeschlossen — auch in
Zwischenschritten.

### Der Alias `@`

`@` zeigt auf `src/`. Beides ist gesetzt: in `vite.config.js` als
`resolve.alias` und in `jsconfig.json` für die Auflösung im Editor. Innerhalb
einer Komponente werden Geschwister relativ importiert (`../Icon/Icon`), von
außen läuft alles über das Barrel:

```jsx
import { Button, Icon } from '@/components'
```

---

## 2. Einrichten und Skripte

```bash
npm ci
npm run dev
```

| Skript | Wirkung |
|---|---|
| `npm run dev` | Entwicklungsserver für das Portal |
| `npm run build` | Portal-Build nach `dist/` |
| `npm run build:lib` | Paket-Build nach `dist-lib/` (Kapitel 10) |
| `npm run preview` | gebautes Portal lokal ausliefern |
| `npm test` | gesamte Testsuite, einmalig |
| `npm run test:watch` | Testsuite im Beobachtungsmodus |
| `npm run search-index` | `src/config/searchData.js` und `sectionData.js` neu erzeugen |
| `npm run contrast` | Kontrastbericht nach `docs/dark-palette-vorschlag.md` und `.html` |
| `npm run contrast:verify` | prüft das Kontrastwerkzeug gegen die helle Palette |

`prepare` ist auf `build:lib` gesetzt. Ein `npm install` ohne Argumente löst den
Paket-Build deshalb mit aus; `npm ci` tut das nicht.

**Nur ein Entwicklungsserver zur Zeit.** Mehrere parallel laufende Instanzen
liefern unterschiedliche Stände an denselben Browser-Tab und haben in diesem
Projekt bereits eine Abnahme verfälscht. Vor dem Start prüfen, ob noch einer
läuft.

---

## 3. Token und Theme ändern

Das Farbsystem hat drei Ebenen: **Brand** (Rohskalen), **Alias** (benannte
Stufen) und **Semantic** (Rollen). Doku-Seiten und Komponenten greifen auf die
semantische Ebene zu; Brand-Stufen nur dort, wo die Referenz sie selbst nutzt.

### Die Ladekette

`src/styles/global.css` lädt in dieser Reihenfolge, und die Reihenfolge ist der
Punkt — später Geladenes gewinnt:

```css
@import "./fonts.css";
@import "./medo-tokens.css";            /* die drei Token-Ebenen, helle Werte */
@import "./medo-theme.css";             /* dieselben Rollen als hell/dunkel-Paare */
@import "./medo-theme-components.css";  /* Theme-Nachbesserungen an Komponenten */

@import "tailwindcss";
@import 'material-symbols/rounded';
@import "./icons.css";                  /* Achsenregel der Icon-Schrift */
```

Darunter steht **ein** `@theme inline`-Block und **ein** `:root`-Block. Beide
bleiben einzeln; eine zweite Instanz bricht die Auflösung still.

### Was wo geändert wird

| Datei | Inhalt | Änderbar? |
|---|---|---|
| `src/styles/medo/*.css` (8 Dateien) | die Token-Werte selbst | **nein** — Spiegel des Design-Projekts |
| `src/styles/medo-tokens.css` | nur die Importliste | nur bei neuer Token-Datei |
| `src/styles/medo-theme.css` | die dunklen Werte | ja |
| `src/styles/medo-theme-components.css` | Theme-Nachbesserung an Komponentenklassen | ja |
| `src/styles/global.css` | Docs-Zwischenwerte, Basisstile | ja |

Die acht Dateien unter `src/styles/medo/` sind inhaltsgleiche Kopien von
`design-reference/tokens/`. Sie werden hier **nie** geändert — ein neuer oder
geänderter Wert entsteht im Design-Projekt und kommt von dort zurück. Die Kopien
tragen CRLF, die Referenz LF; rohe Prüfsummen weichen deshalb immer ab, gleich
ist der Inhalt erst nach Normalisierung der Zeilenenden.

### Der Dark Mode liegt allein auf der semantischen Ebene

Brand- und Alias-Ebene sind in beiden Themes identisch. Das ist die häufigste
Stolperstelle des Projekts: `var(--medo-color-white)` und
`var(--medo-primary-50)` sehen wie saubere Token-Referenzen aus, folgen aber
keinem Theme und bleiben im Dunkeln stehen, wo sie standen.

**Regel:** Alles, was mit dem Theme wechseln soll, referenziert ein semantisches
Token — `--medo-surface`, `--medo-text`, `--medo-border`, `--medo-action` und
ihresgleichen.

In `medo-theme.css` steht jedes semantische Token als **ein** Paar:

```css
--medo-surface: light-dark(var(--medo-color-white), var(--medo-color-stone-1000));
```

Geschaltet wird über `color-scheme`, nicht über Klassen:

```css
:root                     { color-scheme: light dark; }  /* folgt dem System */
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }
```

Träger ist das Attribut `data-theme` auf `<html>`. Fehlt es, folgt die
Darstellung dem System. Eine ausdrückliche Wahl merkt sich das Portal im
`localStorage` unter `medo-theme` und setzt das Attribut über ein Inline-Skript
in `index.html`, bevor der erste Anstrich passiert.

Browser ohne `light-dark()` verwerfen diese Deklarationen und behalten die
hellen Werte darunter — der Rückfall ist das heutige Aussehen, kein kaputtes.

**Einen dunklen Wert ändern:**

1. Das Paar in `src/styles/medo-theme.css` anpassen — nur der zweite Zweig. Der
   erste Zweig wiederholt exakt, was der Spiegel deklariert, und darf nicht
   abweichen; `src/styles/dark-theme.test.js` prüft genau das.
2. `npm test` — die Kontrastprüfung liest die Werte aus `medo-theme.css` selbst
   und fällt, wenn ein Wert seine WCAG-2.2-Schwelle unterschreitet.
3. Sichtprüfung in beiden Themes.

### Theme-Nachbesserung an einer Komponente

Portierte Komponenten tragen die wörtlichen Farbwerte der Referenz und werden
**nicht angefasst** — weder ihr `.jsx` noch ihr `.css`. Braucht eine solche
Farbe ein dunkles Gegenstück, wird die vorhandene Klasse von außen adressiert,
in `src/styles/medo-theme-components.css`:

```css
:root .medo-btn--secondary {
  background-color: light-dark(#f7f7f6, var(--medo-color-stone-800));
}
```

Zwei Schreibweisen, je nach Ausgangslage:

- Der helle Wert der Referenz ist **exakt** der helle Wert eines Tokens: dann
  wird unbedingt auf das Token gesetzt. Hell rendert es identisch, dunkel folgt
  es dem Token.
- Der helle Wert liegt **neben** der Palette: dann wird nur die Farbe in
  `light-dark()` gefasst, und der helle Zweig wiederholt das Literal der
  Referenz wörtlich. Die helle Darstellung kann sich so nicht ändern.

Der `:root`-Präfix ist kein Schmuck: er hebt die Spezifität über die des
Komponenten-Stylesheets, sodass die Regel unabhängig von der Bündelreihenfolge
gewinnt. `src/styles/component-theme.test.js` löst jede Deklaration dieser Datei
für das helle Theme auf und fällt, wenn sie von dem abweicht, was das
Komponenten-Stylesheet für denselben Selektor und dieselbe Eigenschaft sagt.

### Zwischenwerte

Werte, die auf keiner Token-Stufe liegen, werden im CSS **aus Tokens gerechnet**,
nie hartkodiert:

```css
--docs-header-height: calc(var(--medo-space-2xl) + var(--medo-space-xs)); /* 56 */
--docs-hit-target:    calc(var(--medo-space-xl) + var(--medo-space-sm));  /* 44 */
```

Ein Zwischenwert, der mehrfach vorkommt, bekommt eine Definition im
`:root`-Block von `src/styles/global.css` und wird überall darüber referenziert.
Zweimal ausrechnen heißt zweimal nachziehen.

Diese Regel gilt für selbst geschriebenen Code. **1:1 portiertes Komponenten-CSS
behält die Zahlenwerte der Referenz** — dort umzurechnen hieße, den Nachweis der
Portierungstreue aufzugeben.

---

## 4. Eine Komponente bearbeiten

Jede Komponente liegt als Paar:

```
src/components/Toggle/Toggle.jsx
src/components/Toggle/Toggle.css
```

Das `.jsx` importiert sein Stylesheet selbst (`import './Toggle.css'`) und
exportiert benannt. Der Export wird in `src/components/index.js` durchgereicht:

```js
export { Toggle } from './Toggle/Toggle'
```

Eine Komponente, die nicht im Barrel steht, existiert für den Rest des Systems
nicht — der Paket-Build zieht seinen Inhalt aus dieser Datei.

### Was den Rahmen bestimmt

`design-reference/` ist die alleinige Quelle, keine Anregung. Die Verbindlichkeit
fällt absteigend so:

1. `design-reference/CLAUDE.md` — gelockte Beschlüsse
2. `design-reference/components/<Name>.dc.html` — die Spezifikation
3. `design-reference/ui/<Name>.jsx` / `.d.ts` / `.prompt.md` — Referenzcode,
   Props-Vertrag, Nutzungsregeln

Die Spezifikationsdateien heißen in Bindestrich-Schreibweise mit
kleingeschriebenem zweiten Wort: `Code-snippet.dc.html`, `Text-input.dc.html`,
`Radio-button.dc.html`. Vor dem Zugriff den Namen im Verzeichnis nachsehen.

Daraus folgt für jede Änderung:

- **Jede in der `.d.ts` deklarierte Prop und Variante muss funktionieren.**
- **Keine Prop, die die `.d.ts` nicht kennt** — auch nicht als dokumentierte
  Abweichung, auch nicht, wenn sie einen echten Bedarf löst. Braucht der
  Aufrufer mehr, löst er es auf seiner Seite, oder der Bedarf geht als
  Änderungswunsch ins Design-Projekt zurück.
- Fehlt ein Token oder eine Angabe, oder widerspricht sich das Material: nicht
  nachrechnen, nicht improvisieren — klären lassen.

### Stilregeln in Komponenten

**Der Klassenpräfix ist projektweit eindeutig.** Anders als in der Referenz, wo
jede Spezifikationsseite für sich läuft, landen hier alle Stylesheets in einem
Bündel. Ein doppelt belegter Präfix lässt zwei Komponenten einander
stillschweigend überschreiben, ohne Build-Fehler. Vor dem Anlegen einer neuen
CSS-Datei den Präfix gegen die vorhandenen prüfen:

```bash
grep -rn "medo-tg" src/components/
```

**Inline-Stile mit Token-Werten nur in Längsformen.** Kurzformen mit
`var()`-Werten kommen unvollständig an, und der Fehler ist stumm — ein Teil der
Kanten färbt sich, der Rest bleibt neutral:

```jsx
// richtig
style={{ borderTopColor: 'var(--medo-border)', borderRightColor: 'var(--medo-border)' }}

// falsch — färbt nicht vollständig, ohne Fehlermeldung
style={{ borderColor: 'var(--medo-border)' }}
```

### Icons

Ausschließlich Material Symbols Rounded, weight 300, FILL 0, immer über die
`Icon`-Komponente. Keine eingebetteten Vektorgrafiken, keine Emojis als Icons,
keine weitere Icon-Bibliothek.

```jsx
import { Icon } from '@/components'

<Icon name="calendar_month" size={20} />
```

`size` ist eine freie Zahl. Standardgrößen sind 18 neben kleinem Text, 20 neben
normalem Text (Vorgabe) und 24 alleinstehend. Kleinere Werte wie 16 nur dort, wo
die Referenz sie selbst setzt — Meldungszeilen, Chips, dichte Kontexte.

**Maßgeblich ist die Auslösefläche, nicht die Komponente.** Icons, die eine
Auslösefläche begleiten — Button, Link, Dropdown-Auslöser, MenuButton,
SplitButton, IconMenuButton — liegen auf sm 20 / md 22 / lg 24. Alle übrigen
Icons behalten die Größen ihrer Referenzimplementierung: Menü- und
Listeneinträge, Feld-Icons, Chips, Meldungszeilen, Tabellen. Eine Komponente
kann beides enthalten.

Bedienbare Icons in Feldern — Leeren, Passwort anzeigen, Kopieren — haben
Icon-Button-Optik und immer ein `aria-label`. Dekorative Icons stehen flach im
Text.

Die Achsenregel der Icon-Schrift steht in `src/styles/icons.css` und ist bewusst
ungeschichtet: das Schriftpaket liefert eine ebenfalls ungeschichtete Regel mit,
gegen die eine Regel in einer Schicht verlöre. Die Datei muss deshalb nach dem
Schriftpaket geladen werden.

---

## 5. Eine Doku-Seite anlegen

Eine neue Seite berührt **fünf** Stellen. Keine ist optional; fehlt eine, fällt
entweder die Testsuite oder die Suche.

1. `src/pages/<Name>Page.jsx` — die Seite
2. `src/App.jsx` — Import und Zeile in `ROUTES`
3. `src/docs/DocsLayout.jsx` — Eintrag in `NAV`
4. `src/i18n/locales/de.json` und `en.json` — alle Texte
5. `npm run search-index` — der Suchindex

### Das Seitengerüst

Jede Komponenten-Seite folgt dem Vier-Tab-Muster: **Overview**, **Usage**,
**Code**, **Accessibility**. Die Inhalte entstehen aus der jeweiligen
Spezifikation in `design-reference/components/`, nicht aus einer Altfassung.

```jsx
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Toggle } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [line-height:var(--medo-leading-relaxed)]'

const BASIC_CODE = `import { Toggle } from '@/components'

<Toggle label="Terminerinnerung senden" defaultChecked />`

export default function TogglePage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Toggle size={values.size} disabled={values.disabled} label={t('toggle.demo.reminder')} />
            )}
            controls={[
              { id: 'size',     type: 'dropdown', label: t('toggle.controls.size'), options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'disabled', type: 'toggle',   label: t('toggle.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('toggle.overview.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.overview.whenText')}</p>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <Section title={t('toggle.code.basicTitle')}>
          <CodeBlock>{BASIC_CODE}</CodeBlock>
        </Section>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('toggle.page.title')}
      description={t('toggle.page.description')}
      tabs={tabs}
    />
  )
}
```

Die Seite exportiert **default**. Die Tab-Bezeichner sind gesetzt und tragen je
ein Icon: `overview`, `usage`, `tokens`, `code`, `accessibility`, `style`. Die
Labels kommen aus dem reservierten Namensraum `tabs.*`.

### Bausteine aus `src/docs/`

| Baustein | Import | Zweck |
|---|---|---|
| `PageLayout` | `../docs/PageLayout` | Kopf, Tab-Leiste, Inhaltsverzeichnis |
| `Section` | `../docs/PageLayout` | Abschnitt mit `h2` und Anker |
| `Content` | `../docs/PageLayout` | Fließtextblock mit Listen- und Link-Stilen |
| `GridWrapper` | `../docs/PageLayout` | Raster, Spaltenzahl aus der Kinderzahl |
| `DemoPanel` | `../docs/PageLayout` | bedienbare Vorschau mit Reglern |
| `CodeBlock` | `../docs/CodeBlock` | Codeblock mit Kopierschalter |
| `TokensTable` | `../docs/TokensTable` | Token-Tabelle, Werte zur Laufzeit gelesen |

`TokensTable` bekommt **nur Token-Namen**. Jeder angezeigte Wert wird aus der
geladenen Token-Kette zurückgelesen, nie in die Seite geschrieben — eine
Änderung an den Tokens schlägt dadurch ohne Zutun bis in die Doku durch.

### DemoPanel

`<DemoPanel>` ist das **erste JSX-Element im Overview-Tab**, vor allen
`<Section>`-Elementen und ohne eigenen `Section`-Wrapper — es bringt seine
eigene `h2` mit. Info-Seiten (Impressum, Datenschutz, Releases) haben kein
DemoPanel.

| Prop | Typ | Bedeutung |
|---|---|---|
| `component` | `(values) => ReactNode` | rendert die Komponente mit den aktuellen Reglerwerten |
| `controls` | `Control[]` | Regler; ein leeres Array blendet die Reglerzeile aus |

```ts
{ id: string, type: 'dropdown', label: string, options: string[], default: string }
{ id: string, type: 'toggle',   label: string, default: boolean }
```

Die Regler decken die Varianten und Props aus der `.d.ts` der Komponente ab, und
`options` enthält die tatsächlichen Prop-Werte — nichts, was die Komponente
nicht kennt.

### Die Ankerregel

**Jede `h2` gehört in einen `<Section>`-Wrapper.** `Section` erzeugt aus dem
Titel eine ID und hängt sie an das umschließende `div`. Steht eine `h2`
außerhalb, greift die Ankersuche über `el.closest('[id]')` die ID des nächsten
Vorfahren ab, statt einen eigenen Anker zu erzeugen — Inhaltsverzeichnis und
Suchtreffer springen dann ins Ungefähre.

Der Algorithmus steht in `src/docs/anchors.js` und ist die einzige Quelle:

```js
export const generateId = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
```

Er wird **importiert, nie kopiert** — auch der Suchindex-Generator liest genau
diese Funktion, damit vorerzeugte Anker nicht von den gerenderten abweichen
können. Umlaute fallen ersatzlos heraus: aus „Größen" wird `gren`. Das ist kein
Fehler, sondern der vereinbarte Stand; Anker sind dadurch sprachabhängig.

---

## 6. Navigation und Routen erweitern

### Route

Routen stehen als **Datenzeile** in `ROUTES` in `src/App.jsx`, nicht als
`<Route>`-Element. `ROUTES` ist die einzige Quelle des Seitenbestands: der
Suchindex-Generator läuft diese Liste ab, und ein Test hält sie mit der
Navigation im Gleichstand.

```jsx
import TogglePage from './pages/TogglePage'

export const ROUTES = [
  // ...
  { path: '/toggle', element: <TogglePage /> },
]
```

Der Wurzelpfad ist die einzige Zeile mit `redirect` statt `element`.

### Navigation

Der Seitenstreifen zieht seinen Inhalt aus `NAV` in `src/docs/DocsLayout.jsx`.
Drei Gruppen: `about`, `foundations`, `components`. Die `id` eines Eintrags
**ist** der Pfad ohne führenden Schrägstrich — daraus baut der Streifen sein
Ziel, deshalb müssen beide zusammenpassen.

```js
{ id: 'toggle', label: 'nav.items.toggle' },
```

`label` ist ein i18n-Schlüssel, kein Text.

### Bewusst nicht geführte Routen

Drei Routen stehen absichtlich nicht im Seitenstreifen: der Wurzel-Umzug und die
beiden Rechtstexte, die über die Fußzeile erreichbar sind. Sie stehen in
`NAV_EXEMPT` in `src/config/searchData.test.jsx`:

```js
const NAV_EXEMPT = ['/', '/impressum', '/datenschutz']
```

Eine neue Route, die nicht in die Navigation soll, gehört dort eingetragen —
sonst fällt der Test, der jeden Pfad im Seitenstreifen sehen will.

---

## 7. Übersetzungen pflegen

Jeder Text, den ein Mensch zu sehen bekommt, läuft über `t()`:

```jsx
const { t } = useTranslation()

<h3>{t('toggle.overview.whenTitle')}</h3>
```

Deutsch ist der Standard und die Rückfallsprache; Englisch ist die Übersetzung.
Beide Dateien — `src/i18n/locales/de.json` **und** `en.json` — bekommen jeden
neuen Schlüssel. Ein Schlüssel, der nur in einer der beiden steht, zeigt in der
anderen Sprache seinen eigenen Namen an.

### Aufbau

Pro Seite ein Namensraum auf oberster Ebene, darin `page`, `controls`, `demo`
und die Abschnittsblöcke:

```json
"toggle": {
  "page": {
    "title":       "Toggle",
    "description": "Schaltet eine Einstellung sofort um."
  },
  "controls": { "size": "Größe" },
  "demo":     { "reminder": "Terminerinnerung" }
}
```

`tabs.*` ist reserviert für die globalen Tab-Labels und wird nicht pro Seite
erweitert.

### Die Dateien vertragen keinen Rundlauf

Beide Locale-Dateien sind **spaltenausgerichtet** — die Werte stehen
untereinander. Ein `JSON.parse` mit anschließendem `JSON.stringify` wirft diese
Ausrichtung weg und erzeugt eine Änderung über alle 3175 Zeilen, in der die
eigentliche Änderung nicht mehr auffindbar ist.

**Vorgehen:** an einem eindeutigen Anker einfügen oder ersetzen, die Ausrichtung
der Nachbarzeilen übernehmen, danach gegenprüfen:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/locales/de.json','utf8')); console.log('ok')"
```

### Demo-Inhalte

Demo-Inhalte in Komponenten-Vorschauen sind Deutsch mit „Sie"-Anrede:

- Buttons tragen Verb-Infinitive — „Termin anlegen", nie „OK"
- keine Ausrufezeichen, keine Werbesprache, keine Emojis
- deutsche Formate: `1.234,56 €`, `04.08.2026`, 24-Stunden-Uhrzeit
- Zahlen, Beträge, IDs und Daten stehen in der dicktengleichen Schrift
- Fehlermeldungs-Demos benennen Ursache **und** nächsten Schritt, nie nur den
  Zustand

---

## 8. Suchindex erzeugen

`src/config/searchData.js` und `src/config/sectionData.js` werden **erzeugt,
nicht gepflegt**. Beide tragen den Hinweis im Kopf und werden nicht von Hand
angefasst.

```bash
npm run search-index
```

Der Generator rendert jede Seite aus `ROUTES` in jeder Sprache und jedem Tab und
liest die Anker aus, die die Seiten tatsächlich erzeugen. Von Hand geschriebene
Anker gingen still veraltet, weil sie aus übersetzten Überschriften entstehen.

**Wann er laufen muss:** nach jeder neuen, umbenannten oder entfernten Seite und
nach jeder geänderten Abschnittsüberschrift. Sonst fällt `npm test` — und zwar
deutlich:

```
× search index > matches what the pages actually render
  → expected [ …(1104) ] to deeply equal [ …(1110) ]
× search index > finds every page in both languages
  → expected [ '/pruefung' ] to deeply equal []
```

---

## 9. Tests schreiben

```bash
npm test          # einmalig
npm run test:watch
```

Die Suite läuft gegen eine DOM-Nachbildung; die Einrichtung steht in
`vite.config.js` unter `test`, die Vorbereitung in `src/test/setup.js`. Gefunden
wird alles unter `src/**/*.test.{js,jsx}`.

Die Option `css: true` ist gesetzt und bleibt es: die Token-Doku liest
Stylesheets als Rohtext ein, um beide Zweige eines Tokens zu zeigen. Ohne sie
kommt jeder CSS-Import als leere Zeichenkette an, und die Seiten rendern nichts.

### Was belegt wird — und was nicht

**Verhalten wird getestet:** Tastaturwege, Fokusführung, Rückrufe, Zeitgeber,
Zustandswechsel. Markup und Props werden über gerendertes Markup geprüft.

**Farben und Abstände werden nicht getestet.** Sie bleiben dem visuellen Abgleich
vorbehalten. Die einzige maschinelle Farbaussage ist die Kontrastzahl
(Kapitel 11).

Die Testdatei liegt neben der Komponente:

```
src/components/Tabs/Tabs.jsx
src/components/Tabs/Tabs.test.jsx
```

### Muster

Elemente werden über **Rolle und Namen** angesprochen, nie über Klassennamen
oder Testkennungen:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from './Tabs'

it('skips disabled tabs with the arrow keys and wraps around', async () => {
  const onChange = vi.fn()
  const user = userEvent.setup()
  render(<Tabs items={items} value="usage" onChange={onChange} />)

  screen.getByRole('tab', { name: 'Usage' }).focus()
  await user.keyboard('{ArrowRight}')

  expect(onChange).toHaveBeenLastCalledWith('accessibility')
})
```

Testtexte und Beschreibungen sind Englisch.

### Vier Fallen

**Zeitgeber.** Wo Zeit im Spiel ist, mit `fireEvent` arbeiten, nicht mit
`userEvent` — dessen eigene Zeitsteuerung kommt der künstlichen Uhr in die Quere.

**Portale.** Sie liegen ausschließlich in `Modal`, `Popover` und `Tooltip`.
`Menu` entkommt der Beschneidung über `position: fixed` mit `z-index: 1000`,
**nicht** über ein Portal — wer sich auf eine Portal-Einteilung stützt, prüfe sie
am Code nach. Komponenten mit Portal lassen sich nicht über serverseitiges
Rendern nachweisen: Portale rendern dort nicht, das Markup kommt leer zurück und
alles sieht nach einem Portierungsfehler aus. Solche Komponenten über echtes
Rendern im Browserkontext prüfen und den ganzen `body` lesen.

**Anzahl-Zusicherungen.** Auf ein Klassen-Token stützen, nie auf die nackte
Zeichenkette. Klassennamen desselben Blocks sind Präfixe voneinander —
`__dot`/`__dots`, `__line`/`__line--filled` — eine Zählung über die Zeichenkette
liegt deshalb leise zu hoch:

```js
const count = (html, token) =>
  (html.match(new RegExp(`class="[^"]*\\b${token}\\b[^"]*"`, 'g')) ?? []).length
```

Vorhandensein-Prüfungen sind davon nicht betroffen.

**Versionsdeckel.** Der Testläufer bleibt auf 3.x und die DOM-Nachbildung auf
26.x. Die jeweils nächste Hauptversion zieht ein gebrochenes natives Modul
beziehungsweise einen Ladefehler auf der eingesetzten Laufzeit nach sich. Beide
Deckel nicht arglos anheben.

### Die Gegenprobe

Vor der Übergabe **eine Zusicherung absichtlich verdrehen und den Lauf
wiederholen.** Ein grüner Lauf, der nie rot werden kann, belegt nichts — ein
Test, der am falschen Element hängt oder auf ein nie erfülltes Versprechen
wartet, läuft ebenso grün durch. Danach zurückdrehen.

### Was die Suite außerdem hält

| Testdatei | Zusicherung |
|---|---|
| `src/config/searchData.test.jsx` | Index, Routen und Navigation stimmen überein |
| `src/styles/dark-theme.test.js` | die dunkle Palette hält ihre Kontrastschwellen |
| `src/styles/component-theme.test.js` | die Theme-Nachbesserungen ändern hell nichts |
| `src/docs/themeTokens.test.js` | beide Zweige eines Tokens werden korrekt gelesen |

---

## 10. Die Bibliothek bauen

Das Repository liefert die Komponenten zusätzlich als Paket aus.

```bash
npm run build:lib
```

Der Lauf besteht aus zwei Schritten: ein eigener Build nach `dist-lib/`, dann
`scripts/build-package.mjs`, das die Stile zusammensetzt und das Ergebnis prüft.
Die Portal-Konfiguration bleibt davon unberührt — sie baut das Portal und muss
unverändert weiterlaufen.

Zwei Einstiegspunkte:

- `src/components/index.js` — das Barrel; die Komponenten-Stylesheets reisen als
  Nebenwirkung mit
- `src/lib/tokens.js` — das Fundament: Schriften, die drei Token-Ebenen, das
  Theme, die Achsenregel der Icon-Schrift

Ausgeliefert werden `index.js`, `styles.css`, `tokens.css` und `fonts/`.
`styles.css` ist die Verkettung von Fundament, Komponenten-Stylesheets und
Theme-Nachbesserungen, in dieser Reihenfolge.

Der zweite Schritt ist **keine Meldung, sondern eine Schranke.** Er bricht ab,
wenn Portal-Abhängigkeiten in das Paket geraten sind, wenn eine deklarierte
Eigenschaft oder Klasse einer Quelldatei den Weg in `styles.css` nicht gefunden
hat, wenn eine Schriftdatei fehlt oder wenn die Achsenregel der Icon-Schrift
nicht mitgekommen ist. Geprüft wird gegen die Quellen, nicht gegen eine
aufgeschriebene Liste — die Schranke kann deshalb nicht veralten.

Ein erfolgreicher Lauf meldet:

```
package build: fonts, index.js, styles.css, tokens.css
  no portal dependencies in index.js
  style entry point complete: 47 stylesheets, 7 font faces
```

`dist/` und `dist-lib/` sind Bau-Ergebnisse und nicht versioniert.

---

## 11. Abnahmeverfahren

### Vor jedem Commit

```bash
npm run build
npm test
```

Beides fehlerfrei. Die Warnung zur Bündelgröße im Portal-Build ist bekannt und
unkritisch.

### Nach Änderungen an Komponenten oder Seiten

```bash
npm run dev
```

Im Browser prüfen — und zwar vollständig:

- alle Tabs der geänderten Seite
- **beide Themes**, hell und dunkel
- Desktop und Mobil (≤ 768 px, dort klappt der Seitenstreifen um)

Farbergebnisse sind maschinell nur als Kontrastzahl prüfbar. Lesbarkeit,
Tiefenwirkung und der Eindruck einer Fläche bleiben der Sichtprüfung vorbehalten
— ein grüner Kontrastlauf ist eine Untergrenze, keine Abnahme.

### Portierte Komponenten

Der visuelle Abgleich läuft gegen die Spezifikationsseite in
`design-reference/components/`. Sie ist eigenständig lauffähig, im Browser zu
öffnen und zeigt die Varianten-, Zustands- und Größenmatrix.

Die Vorschauen `design-reference/ui/*.card.html` rendern **leer**, weil das
kompilierte Bündel nicht übertragbar war. Sie sind keine Abgleichsgrundlage.

### Kontrast

Die Kontrastprüfung läuft in `npm test` mit. Für den ausführlichen Bericht:

```bash
npm run contrast:verify   # prüft das Werkzeug gegen die helle Palette
npm run contrast          # erzeugt den Bericht in docs/
```

Das Werkzeug weigert sich zu schreiben, solange es seine eigene Prüfung gegen
die helle Palette nicht bestanden hat.

### Checklisten

Die abzuhakenden Listen stehen in `editors-doc.md` — je eine für die neue
Doku-Seite, die neue oder geänderte Komponente, die Token- oder
Theme-Änderung und den Commit. Sie stehen dort und nicht hier, damit sie an
**einer** Stelle nachgezogen werden.

### Versionskontrolle

Basis ist `main`. Vor jeder Aufgabe ein eigener Zweig davon:
`type/kurze-beschreibung`. Commit-Konvention `type: kurze beschreibung` mit
`feat`, `fix`, `refactor`, `docs` oder `chore`; der Betreff ist deutsch,
kleingeschrieben und ohne Umlaute. Nie direkt auf `main` committen.
