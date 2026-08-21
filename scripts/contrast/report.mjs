/* Renders the decision document. Refuses to write anything while the tool
   itself has not passed its check against the light palette. */

import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { analyse } from './analysis.mjs'
import { runVerification, report as reportVerification } from './verify.mjs'
import { SPECIAL_CASES, SHADOW_CASE } from './specials.mjs'
import { REPO_ROOT } from './tokens.mjs'
import { THRESHOLDS } from './roles.mjs'

const OUT = path.join(REPO_ROOT, 'docs', 'dark-palette-vorschlag.md')

const num = (value) => String(value.toFixed(2)).replace('.', ',')
const ratio = (value) => `${num(value)}:1`
const token = (name) => `\`--${name}\``
const swatch = (value) => `\`${value}\``

function mark(entry) {
  if (entry.threshold === 0) return ''
  return entry.passes ? '' : ' ⚠'
}

function tokenTable(rows) {
  const lines = [
    '| Token | Hell | Dunkel | Stufe dunkel | Kontrast hell | Kontrast dunkel | Gemessen gegen | Anmerkung |',
    '|---|---|---|---|---|---|---|---|',
  ]
  for (const row of rows) {
    lines.push([
      token(row.name),
      swatch(row.lightValue),
      swatch(row.darkValue),
      row.step ? `\`${row.step}\`` : '—',
      ratio(row.lightRatio),
      ratio(row.darkRatio),
      token(row.ref),
      row.note,
    ].join(' | ').replace(/^/, '| ').concat(' |'))
  }
  return lines.join('\n')
}

function matrixTable(matrix) {
  const head = ['Vordergrund \\ Fläche', ...matrix.surfaces.map((s) => s.replace('medo-', ''))]
  const lines = [
    `| ${head.join(' | ')} |`,
    `|${head.map(() => '---').join('|')}|`,
  ]
  for (const row of matrix.rows) {
    const cells = row.cells.map((cell) => `${num(cell.dark.ratio)}${mark(cell.dark)}`)
    lines.push(`| ${token(row.fg)} | ${cells.join(' | ')} |`)
  }
  return lines.join('\n')
}

function matrixTableLight(matrix) {
  const head = ['Vordergrund \\ Fläche', ...matrix.surfaces.map((s) => s.replace('medo-', ''))]
  const lines = [
    `| ${head.join(' | ')} |`,
    `|${head.map(() => '---').join('|')}|`,
  ]
  for (const row of matrix.rows) {
    const cells = row.cells.map((cell) => `${num(cell.light.ratio)}${mark(cell.light)}`)
    lines.push(`| ${token(row.fg)} | ${cells.join(' | ')} |`)
  }
  return lines.join('\n')
}

function contextTables(context) {
  const blocks = []
  for (const [group, pairs] of context) {
    const lines = [
      `### ${group}`,
      '',
      '| Vordergrund | Fläche | Schwelle | Kontrast hell | Kontrast dunkel |',
      '|---|---|---|---|---|',
    ]
    for (const pair of pairs) {
      const threshold = pair.dark.threshold === 0 ? '— (informativ)' : ratio(pair.dark.threshold)
      lines.push(`| ${token(pair.fg)} | ${token(pair.bg)} | ${threshold} | `
        + `${num(pair.light.ratio)}${mark(pair.light)} | ${num(pair.dark.ratio)}${mark(pair.dark)} |`)
    }
    blocks.push(lines.join('\n'))
  }
  return blocks.join('\n\n')
}

function specialSection(data) {
  const blocks = SPECIAL_CASES.map((entry, index) => [
    `### ${index + 1}. ${entry.token}`,
    '',
    `| Hell | Dunkel |`,
    `|---|---|`,
    `| ${swatch(entry.light)} | ${swatch(entry.dark)} |`,
    '',
    `**${entry.headline}**`,
    '',
    entry.text,
  ].join('\n'))

  const shadowRows = data.shadows.map((shadow, index) => [
    `### ${index + 6}. \`--${shadow.name}\``,
    '',
    `| Hell | Dunkel |`,
    `|---|---|`,
    `| ${swatch(shadow.lightValue)} | ${swatch(shadow.darkValue)} |`,
    '',
    SHADOW_CASE.perShadow[shadow.name],
  ].join('\n'))

  const scrimTable = [
    '**Der Scrim über die Deckkraft, beide Themes.** „Trennung" ist der Dialog gegen die verschleierte',
    'Seite, „Hintergrund" die Lesbarkeit dessen, was hinter dem Scrim liegt.',
    '',
    '| Deckkraft | Hell: Trennung | Hell: Hintergrund | Dunkel: Trennung | Dunkel: Hintergrund |',
    '|---|---|---|---|---|',
    ...data.scrimCurve.light.map((row, index) => {
      const d = data.scrimCurve.dark[index]
      const flag = row.alpha === 0.5 ? ' ←' : ''
      return `| ${String(row.alpha).replace('.', ',')}${flag} | ${num(row.separation)} | `
        + `${num(row.backdrop)} | ${num(d.separation)} | ${num(d.backdrop)} |`
    }),
    '',
    'Die markierte Zeile ist der Bestand beziehungsweise der Vorschlag. Zum Vergleich: würde die helle '
      + `Grundfarbe stone-1100 unverändert übernommen, käme der dunkle Scrim auf eine Trennung von `
      + `${ratio(data.scrimCurve.darkWithStone.separation)} und einen Hintergrund von `
      + `${ratio(data.scrimCurve.darkWithStone.backdrop)} — er täte also fast nichts.`,
  ].join('\n')

  const derivation = [
    '### Warum der Schatten im Dunkeln nicht mehr die Hauptlast trägt',
    '',
    SHADOW_CASE.text,
    '',
    '| Deckkraft hell | Helligkeitssprung auf Weiß | Dafür nötige Deckkraft auf stone-1000 | Faktor |',
    '|---|---|---|---|',
    ...data.shadowDerivation.rows.map((row) => {
      const needed = row.reachable ? String(row.needed).replace('.', ',') : 'nicht erreichbar'
      const factor = row.reachable ? `× ${String(row.factor).replace('.', ',')}` : '—'
      return `| ${String(row.alpha).replace('.', ',')} | ${num(row.target)} | ${needed} | ${factor} |`
    }),
    '',
    `Schwarz bei voller Deckung erreicht auf stone-1000 höchstens ${ratio(data.shadowDerivation.ceiling)}. `
      + 'Der stärkste helle Schatten liegt darüber — er lässt sich im Dunkeln mit keiner Deckkraft '
      + 'nachbilden.',
  ].join('\n')

  return [...blocks, scrimTable, derivation, ...shadowRows].join('\n\n')
}

function shortfallSection(data) {
  if (!data.shortfalls.length) return 'Keine. Jede geprüfte Kombination erreicht ihre Schwelle.'
  const blocks = data.shortfalls.map((row) => {
    const j = row.justification
    return [
      `### ${j.title}`,
      '',
      `${token(row.fg)} auf ${token(row.bg)} — **${ratio(row.ratio)}** bei einer Schwelle von `
        + `${ratio(row.threshold)}. Im hellen Theme: ${ratio(row.lightRatio)}`
        + `${row.lightPasses ? '' : ' (dort ebenfalls unter der Schwelle)'}.`,
      '',
      j.text,
    ].join('\n')
  })
  return blocks.join('\n\n')
}

function lightBaselineSection(data) {
  const fixed = data.lightShortfalls.filter((row) => row.darkPasses)
  const lines = [
    '| Vordergrund | Fläche | Schwelle | Hell | Dunkel |',
    '|---|---|---|---|---|',
    ...data.lightShortfalls.map((row) => `| ${token(row.fg)} | ${token(row.bg)} | ${ratio(row.threshold)} | `
      + `${num(row.lightRatio)} ⚠ | ${num(row.darkRatio)}${row.darkPasses ? '' : ' ⚠'} |`),
  ]
  return [
    `Die Prüfung lief zuerst über die bestehende helle Palette. Dabei sind ${data.lightShortfalls.length} `
      + 'Kombinationen aufgefallen, die schon heute unter ihrer Schwelle liegen. Das ist nicht Gegenstand '
      + `dieser Aufgabe und wird hier nur festgehalten. Der dunkle Vorschlag hebt ${fixed.length} davon `
      + `über die Schwelle und erbt ${data.lightShortfalls.length - fixed.length}.`,
    '',
    lines.join('\n'),
  ].join('\n')
}

function tradeoffSection(data) {
  const ring = data.focusAlternative
  const ringTable = [
    '| Variante | Wert | surface | container | container-high | overlay |',
    '|---|---|---|---|---|---|',
    ...ring.map((option) => `| ${option.label} | ${swatch(option.value)} | `
      + option.per.map((p) => num(p.ratio)).join(' | ') + ' |'),
  ].join('\n')

  const action = data.actionAlternative

  return [
    '### 1. Die Primärfläche wird hell, ihre Beschriftung dunkel',
    '',
    'Das ist die sichtbarste Änderung am Charakter des Themes. Der Grund ist messbar: teal-600 als '
      + `Füllfarbe erreicht auf stone-1000 nur ${ratio(action.onSurface)} und verfehlt damit die 3:1, die `
      + 'WCAG 2.2 für die Fläche eines Bedienelements verlangt — der Knopf verschwimmt mit der Seite. '
      + `Der Vorschlag setzt teal-500 (${ratio(action.chosenOnSurface)}) mit dunkler Beschriftung `
      + `(${ratio(action.chosenLabel)}).`,
    '',
    `Die Gegenrechnung: teal-600 mit weißer Schrift ergäbe ${ratio(action.whiteLabel)} für die `
      + 'Beschriftung — die wäre also in Ordnung, nur die Fläche nicht. Wer die Markenfarbe im dunklen '
      + 'Theme unverändert halten will, nimmt diese Unterschreitung in Kauf. Ich rate ab, halte die '
      + 'Variante aber für vertretbar, weil die Beschriftung das Element trägt.',
    '',
    '### 2. Deckkraft des Fokusrings',
    '',
    'Der Vorschlag hebt die Deckkraft von 35 auf 55 %. Nur so trägt der Ring auf allen vier '
      + 'Trägerflächen über 3:1. Bei unveränderten 35 % bliebe er darunter:',
    '',
    ringTable,
    '',
    '### 3. Textlink auf gedrückter Fläche',
    '',
    'teal-400 erreicht dort 4,11:1. Eine Anhebung auf teal-300 brächte 5,25:1 und räumte die letzte '
      + 'AA-Unterschreitung bei Text aus, macht den Link im Ruhezustand aber spürbar blasser '
      + '(9,26:1 statt 7,25:1 — bei Links ist ein Zuviel an Kontrast ein Verlust an Farbigkeit). '
      + 'Der Vorschlag bleibt bei teal-400.',
  ].join('\n')
}

export function buildDocument() {
  const data = analyse()
  const checks = runVerification()
  if (checks.some((check) => !check.ok)) {
    throw new Error('Das Kontrastwerkzeug besteht seine eigene Pruefung nicht — kein Bericht erzeugt.')
  }

  const checkTable = [
    '| Prüfung | Ergebnis |',
    '|---|---|',
    ...checks.map((check) => `| ${check.name} | ${check.detail} |`),
  ].join('\n')

  return `# Dunkle Palette — Entscheidungsvorlage

> **Status: Vorschlag.** Nichts davon ist umgesetzt. Diese Vorlage ändert keine Theme-Datei und kein
> Stylesheet; \`src/styles/medo/\` und \`design-reference/\` sind unberührt. Erst Ihre Freigabe macht die
> Werte verbindlich.

Der Dark Mode wird allein über die Semantic-Ebene getragen. Brand- und Alias-Ebene bleiben in beiden
Themes identisch — jeder dunkle Wert unten zeigt entweder auf eine **vorhandene Brand-Stufe** oder ist
einer der neun Sonderfälle mit Transparenz beziehungsweise Schatten, die einzeln begründet sind.

## 1. Was zu entscheiden ist

Drei Dinge, in dieser Reihenfolge:

1. **Die Flächenleiter** (Abschnitt 3) — sie bestimmt den Grundcharakter. Wenn die stimmt, folgt der Rest.
2. **Die neun Sonderfälle** (Abschnitt 7) — dort liegen die einzigen Werte außerhalb der Brand-Skalen.
3. **Die drei Abwägungen** (Abschnitt 9) — dort gibt es je eine vertretbare Gegenposition.

Die Tabellen dazwischen sind Beleg, nicht Lesestoff. Ein ⚠ markiert eine Kombination unter ihrer
WCAG-2.2-Schwelle; jede davon ist in Abschnitt 8 einzeln begründet.

Schwellen: Fließtext ${ratio(THRESHOLDS.text)}, Bedienelemente und Icons ${ratio(THRESHOLDS.ui)}.
Zeilen ohne Schwelle sind informativ — deaktivierte Zustände und reine Flächenabsetzungen kennt
WCAG nicht als Anforderung.

## 2. Prüfung des Werkzeugs

Die Zahlen in dieser Vorlage stammen aus einem eigens gebauten Werkzeug (\`scripts/contrast/\`, keine
neue Abhängigkeit). Bevor es auf die dunkle Palette angesetzt wurde, musste es die **helle** korrekt
bewerten. Geprüft wurden die Fixpunkte der WCAG-Formel, die in \`design-reference/CLAUDE.md\`
festgehaltenen Herleitungen der fünf Transparenz-Literale, und eine dort dokumentierte, überprüfbare
Aussage über die helle Palette: dass Weiß auf Amber zu schwach ist und \`warning-on-solid\` deshalb
stone-1000 trägt. Ein Werkzeug, das dieses Urteil nicht reproduziert, taugt für die dunkle Palette nicht.

${checkTable}

Gegenprobe: mit verfälschtem Luminanz-Koeffizienten und mit vertauschter Kompositionsrichtung schlägt
der Lauf jeweils fehl. Die Prüfung kann also rot werden.

## 3. Die Flächenleiter

Im hellen Theme ist die Grundfläche das Hellste, was es gibt, und alles Weitere staffelt sich darunter.
Diese Anordnung lässt sich nicht spiegeln, ohne sie zu durchdenken: im Dunkeln trägt **Helligkeit die
Höhe**, und darunter braucht es Platz für vertiefte Flächen.

| Rolle | Hell | Dunkel | Richtung |
|---|---|---|---|
| \`surface-sunken\` | stone-100 | **stone-1100** | tiefer als die Grundfläche |
| \`surface\` | white | **stone-1000** | Grundfläche |
| \`surface-container\`, \`overlay\` | stone-50 / white | **stone-900** | Karten, Menüs, Dialoge |
| \`surface-container-high\`, \`surface-hover\` | stone-100 | **stone-800** | zweite Höhe, Überfahren |
| \`state-pressed\` | stone-200 | **stone-700** | Druckzustand |

Zwei Abweichungen von der reinen Spiegelung stecken darin, beide unvermeidlich:

- \`surface-sunken\` liegt hell auf derselben Stufe wie \`surface-container-high\`. Im Dunkeln muss eine
  vertiefte Fläche **unter** die Grundfläche, sonst wirkt sie erhoben. Deshalb stone-1100.
- \`overlay\` ist hell mit \`surface\` identisch — ein weißes Menü auf weißer Seite, getrennt allein durch
  den Schatten. Auf dunklem Grund trägt kein Schatten mehr (Abschnitt 7). Das Menü muss selbst heller
  sein, sonst ist es nicht da.

## 4. Alle ${data.rows.length} Token der Semantic-Ebene

Vollständig und in der Reihenfolge der Quelldatei. Die Spalte „Gemessen gegen" nennt den Partner, auf
den sich die beiden Kontrastspalten beziehen — bei Flächen also der Text darauf, bei Text die Fläche
darunter.

${tokenTable(data.rows)}

## 5. Text und Icon auf Fläche

Jede Kombination aus Text- beziehungsweise Icon-Token und allgemeiner Fläche, durchgerechnet. Die
Tabelle wird erzeugt, nicht gepflegt — es kann keine Zeile fehlen.

**Dunkler Vorschlag:**

${matrixTable(data.matrix)}

**Heller Bestand zum Vergleich:**

${matrixTableLight(data.matrix)}

## 6. Kontextgebundene Paarungen

Kombinationen, bei denen die Komponente die Fläche vorgibt: Beschriftung auf gefüllten Flächen,
Feldinhalte, Statusfarben, Rahmen, Fokusring, Flächenabsetzungen.

${contextTables(data.context)}

## 7. Die neun Sonderfälle

Fünf Transparenz-Literale und vier Schattendefinitionen. Nur hier sind Werte außerhalb der Brand-Skalen
zulässig, und nur hier steht eine Setzung statt einer Ableitung — beim Faktor der Schatten.

${specialSection(data)}

## 8. Unterschreitungen im Einzelnen

${shortfallSection(data)}

## 9. Drei Abwägungen

${tradeoffSection(data)}

## 10. Was die Prüfung nebenbei am hellen Theme gefunden hat

${lightBaselineSection(data)}

## 11. Freigabe

Der Vorschlag gilt als angenommen, wenn Sie den drei Punkten aus Abschnitt 1 zustimmen. Teilfreigaben
sind möglich — die Flächenleiter trägt die Zuordnungen, die Sonderfälle und die Abwägungen lassen sich
unabhängig davon entscheiden. Rückmeldungen arbeite ich ein und lege erneut vor.

---

*Erzeugt von \`npm run contrast\`. Die Werte stammen aus \`src/styles/medo/\` (nur gelesen) und aus dem
Vorschlag in \`scripts/contrast/dark-palette.mjs\`.*
`
}

function main() {
  const checks = runVerification()
  const ok = reportVerification(checks)
  if (!ok) {
    console.error('\nDas Werkzeug hat die helle Palette nicht korrekt bewertet. Kein Bericht erzeugt.')
    process.exit(1)
  }
  const markdown = buildDocument()
  mkdirSync(path.dirname(OUT), { recursive: true })
  writeFileSync(OUT, markdown, 'utf8')
  console.log(`\nEntscheidungsvorlage geschrieben: ${path.relative(REPO_ROOT, OUT)}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main()
