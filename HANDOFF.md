# Handoff — med.o Design System

Dieses Dokument richtet sich an Teams, die das med.o Design System in ein
eigenes Projekt übernehmen und dabei keinen Zugriff auf die Menschen haben, die
es gebaut haben. Es beschreibt alles, was zwischen `npm install` und der ersten
gerenderten Komponente liegt — und die Grenzen des Systems, damit niemand sie
selbst herausfinden muss.

Die Schritte in den Abschnitten 3 bis 9 sind an einem frischen React-Projekt
außerhalb dieses Repositorys durchgeführt und nachgemessen worden. Wo eine
Angabe **nicht** aus dieser Probe stammt, sondern aus dem Quellcode abgeleitet
ist, steht es dabei.

---

## Inhalt

1. [Was Sie bekommen](#1-was-sie-bekommen)
2. [Voraussetzungen an Ihre Umgebung](#2-voraussetzungen-an-ihre-umgebung)
3. [Installation](#3-installation)
4. [Ein vollständiges Beispiel](#4-ein-vollständiges-beispiel)
5. [Stile einbinden](#5-stile-einbinden)
6. [Schrift und Icons](#6-schrift-und-icons)
7. [Theme steuern](#7-theme-steuern)
8. [Tokens verwenden](#8-tokens-verwenden)
9. [Komponenten verwenden](#9-komponenten-verwenden)
10. [TypeScript](#10-typescript)
11. [Versionierung](#11-versionierung)
12. [Grenzen des Systems](#12-grenzen-des-systems)
13. [Wo weitergelesen wird](#13-wo-weitergelesen-wird)

---

## 1. Was Sie bekommen

Das Paket heißt `@medo/design-system`, steht auf Version `1.0.0` und wird als
ES-Module ausgeliefert.

| | |
|---|---|
| Komponenten | 36 Module mit 46 benannten Exporten |
| Stile | Schriften, drei Token-Ebenen, Theme, CSS aller Komponenten |
| Typen | 35 Props-Verträge plus eine erzeugte Sammel-Deklaration |
| Schriften | DM Sans und DM Mono, sieben Schnitte als woff2 |
| React | Peer-Abhängigkeit `^18 || ^19`, wird von Ihnen gestellt |

**Was nicht dabei ist:** keine Internationalisierung, keine Icon-Schriftdatei
(sie kommt als eigene Abhängigkeit mit), keine Grundschrift-Regel für Ihr
Markup, keine Erweiterungspunkte an den Komponenten. Die Einzelheiten stehen in
[Grenzen des Systems](#12-grenzen-des-systems); lesen Sie den Abschnitt, bevor
Sie sich festlegen.

---

## 2. Voraussetzungen an Ihre Umgebung

Lesen Sie diesen Abschnitt vor der Installation. Er entscheidet, ob das Paket zu
Ihrem Aufbau passt.

### Ein Bundler ist nötig

Das Paket wird als ES-Module ausgeliefert und importiert CSS aus JavaScript.
Beides setzt einen Bundler voraus — Vite, webpack, Rspack, Parcel. Ein direkter
Import im Browser oder in Node ohne Bundler funktioniert nicht.

Die Probe lief mit **Vite 5 und React 18**. Andere Bundler sind nicht geprüft,
aber es wird nichts verwendet, was über gewöhnliche ES-Module und CSS-Importe
hinausgeht.

### React Server Components: ein zusätzlicher Schritt ist nötig

**Die Komponenten tragen keine `'use client'`-Direktive**, und 27 der 36 Module
benutzen React-Hooks. In einer Umgebung, die standardmäßig auf dem Server
rendert — **Next.js mit App Router**, ähnliche RSC-Aufbauten — schlägt ein
direkter Import deshalb fehl, und zwar beim Bauen mit einer Meldung in der Art
von *„You're importing a component that needs useState"*.

Das ist kein Fehler des Pakets, sondern eine bewusst nicht getroffene
Festlegung: die Direktive gehört dem Abnehmer, nicht der Bibliothek. Der
Ausweg ist eine eigene Datei, die die Grenze zieht:

```jsx
// src/ui.ts — Ihre Client-Grenze
'use client'
export * from '@medo/design-system'
```

Danach importieren Sie in Ihrer Anwendung aus `./ui` statt direkt aus dem Paket.

**In einer reinen Client-Anwendung** — Vite, Create React App, webpack ohne RSC
— betrifft Sie das nicht.

### Serverseitiges Rendern

`Modal`, `Popover` und `Tooltip` rendern ihren Inhalt über ein React-Portal.
**Portale erzeugen serverseitig kein Markup.** Diese drei Komponenten liefern im
Server-Durchgang leeres Markup und füllen sich erst im Browser. Für Dialoge und
Überlagerungen ist das in aller Regel unerheblich; wenn Sie deren Inhalt
indexiert oder ohne JavaScript sichtbar brauchen, ist es das nicht.

*Aus dem Quellcode abgeleitet, nicht in der Probe gemessen.*

### Paketmanager

Die Probe lief mit **npm**. Dabei landet die Abhängigkeit `material-symbols`
flach in Ihrem `node_modules`, weshalb der Icon-Import aus Ihrem eigenen Code
auflöst (siehe [Schrift und Icons](#6-schrift-und-icons)).

**Unter pnpm oder Yarn PnP** ist der Zugriff auf eine Abhängigkeit, die Sie
nicht selbst deklariert haben, nicht garantiert. Nehmen Sie
`material-symbols` dort in Ihre eigenen Abhängigkeiten auf:

```bash
pnpm add material-symbols
```

### Node

Der Paket-Build läuft beim Installieren mit (siehe [Installation](#3-installation))
und benutzt Vite 5; das verlangt **Node 18 oder neuer**. Das Paket selbst
schreibt keine Node-Fassung vor.

---

## 3. Installation

Das Paket liegt in **keiner Registry**. Es wird als Git-Abhängigkeit
eingebunden:

```bash
npm install github:ahmeeedo/medo-design_system
```

Das Repository ist öffentlich — die Adresse braucht **kein** Zugangstoken.

Beim Installieren läuft der `prepare`-Hook und baut das Paket aus den Quellen.
npm installiert dafür vorübergehend auch die Entwicklungsabhängigkeiten; die
Installation dauert deshalb länger als bei einem fertig gebauten Paket und
verlangt eine funktionierende Node-Umgebung, aber keine weitere Vorbereitung
Ihrerseits.

React und React DOM werden **nicht** mitgeliefert. Sie stellen beide selbst; npm
dedupliziert auf Ihre Fassungen. In der Probe erschien auf beiden geprüften
Installationswegen keine Peer-Warnung.

---

## 4. Ein vollständiges Beispiel

Zwei Dateien, mehr braucht es nicht. Genau dieser Aufbau lief in der Probe.

**`src/main.tsx`** — der Einstiegspunkt. Die Reihenfolge der beiden
CSS-Importe ist gleichgültig, aber beide müssen vor dem ersten Rendern stehen:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@medo/design-system/styles.css'
import 'material-symbols/rounded.css'
import './app.css'

import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**`src/app.css`** — die eine Zeile, die das Paket bewusst nicht setzt:

```css
body {
  font-family: var(--medo-font-sans);
  background: var(--medo-surface-container);
  color: var(--medo-text);
}
```

**`src/App.tsx`** — eine Komponente, die etwas tut:

```tsx
import { useState } from 'react'
import { Button, TextInput, Modal } from '@medo/design-system'

export function App() {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <main style={{ padding: 24 }}>
      <Button variant="primary" icon="calendar_month" onClick={() => setOpen(true)}>
        Termin anlegen
      </Button>

      <Modal
        open={open}
        title="Termin anlegen"
        onClose={() => setOpen(false)}
      >
        <TextInput
          label="Anlass"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </Modal>
    </main>
  )
}
```

Ohne weitere Konfiguration folgt die Darstellung der Systemeinstellung für Hell
und Dunkel. Wie Sie das übersteuern, steht in [Theme steuern](#7-theme-steuern).

---

## 5. Stile einbinden

Die Komponenten laden ihr CSS **nicht** selbst. Genau einer der beiden
Stil-Einstiegspunkte gehört einmalig in den Einstiegspunkt Ihrer Anwendung.

| Import | Inhalt |
|---|---|
| `@medo/design-system` | alle Komponenten als benannte ES-Exporte |
| `@medo/design-system/styles.css` | Schriften, Token-Ebenen, Theme **und** das CSS aller Komponenten |
| `@medo/design-system/tokens.css` | nur das Fundament — Schriften, Token-Ebenen, Theme, ohne Komponenten-CSS |

`styles.css` ist der Normalfall. `tokens.css` ist für den Fall gedacht, dass Sie
nur die Gestaltungsgrundlagen übernehmen und keine Komponenten verwenden.

Beide Einstiegspunkte enthalten das CSS **aller** Komponenten, unabhängig davon,
wie viele Sie importieren — Stylesheets lassen sich nicht nach Verwendung
auslesen. Das JavaScript dagegen ist baumschüttelfähig: was Sie nicht
importieren, landet nicht in Ihrem Bündel.

---

## 6. Schrift und Icons

### Icons

Die Icon-Zeile ist nicht optional, und sie braucht die Endung:

```js
import 'material-symbols/rounded.css'   // richtig
import 'material-symbols/rounded'       // löst nicht auf
```

Die Fassung ohne `.css` bricht den Entwicklungsserver mit „could not be
resolved" ab: das Paket `material-symbols` hat keine Exportkarte, und die Datei
heißt `rounded.css`. Als CSS-`@import` ergänzt ein Bundler die Endung, im
JavaScript-Einstiegspunkt nicht.

**Fehlt die Zeile ganz, erscheinen die Ligaturnamen als Text** — im Prüfaufbau
standen `calendar_month`, `description`, `euro`, `expand_more`, `close`, `add`
und `schedule` als Wörter in der Oberfläche statt als Glyphen. Es gibt keine
Fehlermeldung; der Fehler ist rein optisch.

Das Paket `material-symbols` wird als Abhängigkeit mitinstalliert — zur
Auflösung unter pnpm siehe [Paketmanager](#paketmanager). Die Schriftdatei liegt
bewusst nicht im Auslieferumfang: sie ist 5,3 MB groß und träte sonst in jedem
Bündel ein zweites Mal auf. Die Achseneinstellungen des Systems — weight 300,
FILL 0 — bringen beide Stil-Einstiegspunkte mit.

### Grundschrift

**Das Paket setzt keine `font-family` auf `html` oder `body`.** Eine Bibliothek
fasst das Markup der Anwendung nicht an. Die Komponenten bringen ihre Schrift
selbst mit; für Ihr übriges Markup gehört eine Zeile in Ihr Stylesheet — sie
steht im [Beispiel](#4-ein-vollständiges-beispiel) oben.

Ohne sie stehen Ihre Überschriften und Ihr Fließtext in der Standardschrift des
Browsers, während die Komponenten korrekt in DM Sans erscheinen — ein Zustand,
der beim ersten Blick wie ein Fehler des Pakets aussieht und keiner ist.

---

## 7. Theme steuern

Träger ist das Attribut `data-theme` am `<html>`-Element.

| `data-theme` | Verhalten |
|---|---|
| nicht gesetzt | folgt der Systemeinstellung |
| `light` | erzwingt hell |
| `dark` | erzwingt dunkel |

Ohne jede Konfiguration folgt die Darstellung also der Systemeinstellung. Wenn
Sie das wollen, ist nichts zu tun.

Intern wird über `color-scheme` geschaltet, damit die Token-Werte und die
nativen Bedienelemente — Bildlaufleisten, Auswahlfelder — nicht auseinanderlaufen
können.

### Umschalten zur Laufzeit

```ts
export function setTheme(theme: 'light' | 'dark' | 'system') {
  if (theme === 'system') {
    delete document.documentElement.dataset.theme
    localStorage.removeItem('medo-theme')
  } else {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('medo-theme', theme)
  }
}
```

Damit die gemerkte Wahl beim nächsten Aufruf nicht erst nach dem ersten Anstrich
greift — sichtbar als kurzes Aufblitzen des falschen Themes — gehört sie vor das
Anwendungsbündel in Ihre `index.html`:

```html
<script>
  var theme = localStorage.getItem('medo-theme')
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.dataset.theme = theme
  }
</script>
```

Ohne gemerkte Wahl ist nichts zu korrigieren: das Attribut bleibt weg, und die
Darstellung folgt von sich aus dem System.

### Die Aushebelung über `color-scheme` ist bedingt

Setzen Sie in Ihrer Anwendung selbst `color-scheme`, hängt das Ergebnis davon
ab, **wo** Sie es setzen. Gemessen, nicht geschlussfolgert:

| Ihre Angabe | mit `data-theme` | Ergebnis |
|---|---|---|
| inline am `<html>` | ohne Attribut | Ihre Angabe gewinnt |
| inline am `<html>` | `data-theme="light"` | **Ihre Angabe gewinnt** |
| im Stylesheet auf `:root` | ohne Attribut | Ihre Angabe gewinnt |
| im Stylesheet auf `:root` | `data-theme="light"` | **das Attribut gewinnt** |

Der Grund ist die Spezifität: `:root[data-theme="…"]` liegt bei 0,1,1 und
schlägt ein `:root` bei 0,1,0. Ein Inline-Stil steht darüber.

**Praktisch:** Wollen Sie das Theme aus Ihrer Anwendung heraus erzwingen, setzen
Sie `data-theme` — nicht `color-scheme`. Der umgekehrte Weg funktioniert nur,
solange kein `data-theme` gesetzt ist.

---

## 8. Tokens verwenden

Alle Gestaltungsentscheidungen liegen als CSS Custom Properties mit dem Präfix
`--medo-` vor, in drei Ebenen:

| Ebene | Beispiel | Zweck |
|---|---|---|
| Brand | `--medo-color-stone-900` | rohe Skalen |
| Alias | `--medo-primary-50` | benannte Stufen |
| Semantic | `--medo-surface`, `--medo-text`, `--medo-action` | Rollen |

**Verwenden Sie die semantische Ebene.** Das ist keine Stilfrage, sondern der
Unterschied zwischen einem Wert, der dem Theme folgt, und einem, der es nicht
tut:

> **Brand- und Alias-Ebene sind in beiden Themes identisch.** Nur die
> semantische Ebene wird für Hell und Dunkel unterschiedlich aufgelöst.

`var(--medo-color-white)` sieht wie eine saubere Token-Referenz aus, bleibt im
dunklen Theme aber weiß. Das ist die häufigste Verwechslung im Umgang mit diesem
System.

```css
.panel {
  background: var(--medo-surface);
  color: var(--medo-text);
  border: 1px solid var(--medo-border);
  border-radius: var(--medo-radius-md);
  padding: var(--medo-space-lg);
}
```

Die vollständige Liste der Rollen steht im Doku-Portal auf den Seiten
„Farben · Ebene 3 Semantic" und „Grundlagen".

---

## 9. Komponenten verwenden

36 Module, 46 benannte Exporte. Wo ein Modul mehr als seinen Namensgeber
exportiert, stehen die weiteren Exporte dahinter:

**Aktionen** — `Button` · `Link` · `MenuButtons` (`MenuButton`, `SplitButton`,
`IconMenuButton`) · `Dropdown` (`Dropdown`, `MenuList`) · `Menu`

**Formular-Eingabe** — `Field` · `TextInput` · `Textarea` · `NumberInput` ·
`Search` · `Select` · `Slider` · `DatePicker` (`DatePicker`, `TimeSlots`) ·
`FileUploader`

**Auswahl und Schalter** — `Checkbox` (`Checkbox`, `CheckboxGroup`) ·
`Radio` (`Radio`, `RadioGroup`) · `Toggle` · `ContentSwitcher` · `Tag`

**Navigation** — `Tabs` · `Breadcrumb` · `Pagination` · `ProgressIndicator`

**Feedback und Status** — `Notification` (`Notification`, `ToastHost`, `toast`) ·
`Tooltip` · `InlineLoading` · `Loading` (`Loading`, `Skeleton`) · `ProgressBar`

**Overlays** — `Popover` · `Modal`

**Daten und Inhalt** — `List` (`List`, `KeyValueList`) · `ContainedList` ·
`Accordion` · `DataTable` · `CodeSnippet` · `Icon`

### Wo der Props-Vertrag steht

Varianten, Zustände, Größen und die Anforderungen an die Barrierefreiheit stehen
pro Komponente im Doku-Portal dieses Repositorys — `npm run dev`, dann die Seite
der Komponente, Tab „Code". Dieses Dokument schreibt sie bewusst nicht ab: das
Portal entsteht aus den Spezifikationen unter `design-reference/components/` und
kann deshalb nicht mit der Umsetzung auseinanderlaufen, eine zweite Abschrift
hier könnte es.

Für die tägliche Arbeit reichen daneben die ausgelieferten Typen.

---

## 10. TypeScript

Die Typen liegen im Paket und werden über die Exportkarte gefunden; ein
zusätzliches `@types`-Paket gibt es nicht. Die Sammel-Deklaration wird beim Bauen
**aus dem Barrel erzeugt**, kann also nicht von der tatsächlich exportierten
Oberfläche abweichen.

Die Deklaration ist sowohl über die `exports`-Karte als auch über das
`types`-Feld auf oberster Ebene erreichbar — sie wird damit unter
`moduleResolution: "bundler"`, `"node16"` und dem älteren `"node"` gefunden.

### `skipLibCheck: true` ist Voraussetzung

```json
{ "compilerOptions": { "skipLibCheck": true } }
```

Ohne diese Einstellung bricht die Typprüfung mit **TS2430** in
`TextInput.d.ts` ab: der Vertrag erweitert die HTML-Attribute eines
`<input>` und deklariert `prefix` als `React.ReactNode`, während das
HTML-Attribut `prefix?: string` ist — eine unverträgliche Überschreibung. Der
Fehler liegt im Vertrag des Design-Projekts, nicht in der Umsetzung, und ist als
Änderungswunsch dorthin zurückgemeldet.

Die üblichen TypeScript- und Vite-Vorlagen setzen `skipLibCheck: true` ohnehin.
Mit der Einstellung läuft `tsc --noEmit` sauber durch.

### Vier Verträge lehnen funktionierenden Code ab

| Komponente | Was zur Laufzeit geht, die Typen aber nicht kennen |
|---|---|
| `Select` | `searchable`, `searchPlaceholder`, `children` |
| `Field` | `className`, `style` |
| `CheckboxGroup` | `className`, `style` |
| `RadioGroup` | `className`, `style` |

Am spürbarsten ist `Select`: **die Suchfunktion ist über die Typen nicht
erreichbar.** Alle vier sind als Änderungswunsch ins Design-Projekt
zurückgemeldet und hier bewusst nicht angepasst worden, damit Umsetzung und
Vertrag nicht ein zweites Mal auseinanderlaufen.

### `Textarea` hat keinen Vertrag

Für diese Komponente hat das Design-Projekt weder eine Typdeklaration noch
Referenzcode noch eine Spezifikationsseite. Sie wird als
`React.FC<Record<string, unknown>>` deklariert — sie lässt sich verwenden, aber
die Typen sagen nichts über ihre Props.

---

## 11. Versionierung

Die Paketversion steht auf `1.0.0`. Da die Auslieferung über Git läuft und nicht
über eine Registry, entscheidet **nicht** diese Nummer darüber, was Sie
bekommen, sondern die Git-Referenz in Ihrer `package.json`.

```bash
# folgt dem Hauptzweig — bewegt sich mit
npm install github:ahmeeedo/medo-design_system

# festgenagelt auf einen Stand
npm install github:ahmeeedo/medo-design_system#<commit-sha>
```

**Im Repository sind derzeit keine Tags gesetzt.** Wer einen reproduzierbaren
Stand braucht, nagelt ihn auf einen Commit fest; ohne Referenz folgt die
Installation dem Hauptzweig und ändert sich mit ihm. Ein Aktualisieren ist eine
Neuinstallation mit der gewünschten Referenz.

Wenn Sie das System dauerhaft übernehmen, ist eine Absprache über Tags mit dem
Inhaber der erste sinnvolle Schritt.

---

## 12. Grenzen des Systems

Diese Liste ist vollständig, soweit sie bekannt ist. Sie enthält Dinge, die
gegen eine Übernahme sprechen können — deshalb steht sie hier und nicht am Rand.

### Die Oberflächensprache ist Deutsch

Die Beschriftungen der Komponenten sind Deutsch und **nicht übersetzbar
angelegt**. Das System bringt keine Internationalisierung mit; das Portal in
diesem Repository benutzt eine, das ausgelieferte Paket nicht. Wer eine
mehrsprachige Oberfläche braucht, muss die betroffenen Beschriftungen über die
Props der jeweiligen Komponente setzen, soweit diese das vorsehen.

### Die Komponenten sind nicht als erweiterbar gedacht

Der Props-Vertrag der Spezifikation ist die Obergrenze. Es gibt keine
Erweiterungspunkte, keine Slot-Mechanik und keine Zusicherung, dass ein
Klassenname stabil bleibt. **Wer mehr braucht, löst es auf seiner Seite** —
etwa durch eine eigene Hülle um die Komponente. Änderungswünsche gehen an das
Design-Projekt zurück, nicht in einen Fork der Komponente.

### Umgebung

Ein Bundler ist nötig; React Server Components verlangen eine eigene
Client-Grenze; drei Komponenten rendern serverseitig kein Markup; unter pnpm
muss `material-symbols` selbst deklariert werden. Einzelheiten in
[Voraussetzungen an Ihre Umgebung](#2-voraussetzungen-an-ihre-umgebung).

### TypeScript

`skipLibCheck: true` ist derzeit Voraussetzung; vier Verträge lehnen
funktionierenden Code ab; `Textarea` hat keinen Vertrag. Einzelheiten in
[TypeScript](#10-typescript).

### Browser-Untergrenze

Das Theme benutzt `light-dark()`. Daraus folgt:

| Browser | ab Version |
|---|---|
| Chrome, Edge | 123 |
| Safari | 17.5 |
| Firefox | 120 |

Ältere Browser verwerfen die betroffenen Deklarationen und behalten die hellen
Werte darunter. **Der Rückfall ist das helle Aussehen, keine kaputte
Darstellung** — aber der dunkle Modus steht dort nicht zur Verfügung.

### Kontrast im hellen Theme

Eine Prüfung der Farbpaare gegen WCAG 2.2 hat im **hellen** Theme
**14 Kombinationen** gefunden, die unter ihrer Schwelle liegen. Zwei davon
deutlich:

| Kombination | Schwelle | erreicht |
|---|---|---|
| Warnknopf, Beschriftung auf Fläche im Hover | 4,50:1 | **3,70:1** |
| Warnknopf, Beschriftung auf Fläche im Aktiv-Zustand | 4,50:1 | **2,59:1** |

Die übrigen zwölf liegen knapp darunter und betreffen überwiegend den Fokusring
und Feldkanten. Das ist ein bekannter Rückläufer ins Design-Projekt und kein
Fehler dieses Pakets — aber wenn Ihr Projekt eine Barrierefreiheitsprüfung
durchlaufen muss, sollten Sie es vorher wissen.

Das **dunkle** Theme hebt zwölf dieser vierzehn Kombinationen über ihre Schwelle
und erbt zwei. Es ist in dieser Hinsicht die bessere der beiden Ausprägungen.

### Keine Registry

Es gibt keine Veröffentlichung auf npm und keine ist geplant. Wer eine interne
Registry braucht, muss das Paket selbst dorthin spiegeln.

---

## 13. Wo weitergelesen wird

| Frage | Ort |
|---|---|
| Wie sieht eine Komponente aus, welche Varianten und Zustände hat sie? | Doku-Portal — `npm run dev` |
| Wie arbeite ich **im** Repository? | `DEVELOPMENT.md` |
| Habe ich beim Arbeiten etwas vergessen? | `editors-doc.md` |
| Was ist die verbindliche Gestaltungsvorgabe? | `design-reference/` — ausschließlich lesend |

Das Doku-Portal ist der beste Einstieg: es zeigt jede Komponente bedienbar, in
beiden Themes, mit Props-Vertrag, Varianten, Zuständen und den Anforderungen an
die Barrierefreiheit.
