/* Renders the decision page: the same data as the markdown report, but with
   colour shown rather than spelled out, and with live specimens in both
   palettes side by side. */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { analyse } from './analysis.mjs'
import { runVerification } from './verify.mjs'
import { SPECIAL_CASES, SHADOW_CASE } from './specials.mjs'
import { REPO_ROOT } from './tokens.mjs'
import { parseColor, flatten } from './color.mjs'

const OUT = path.join(REPO_ROOT, 'docs', 'dark-palette-vorschlag.html')

const FONTS = [
  ['DM Sans', 400, 'normal', 'dm-sans-regular.woff2'],
  ['DM Sans', 500, 'normal', 'dm-sans-500.woff2'],
  ['DM Sans', 700, 'normal', 'dm-sans-700.woff2'],
  ['DM Mono', 400, 'normal', 'dm-mono-regular.woff2'],
  ['DM Mono', 500, 'normal', 'dm-mono-500.woff2'],
]

function fontFaces() {
  return FONTS.map(([family, weight, style, file]) => {
    const data = readFileSync(path.join(REPO_ROOT, 'src', 'fonts', file)).toString('base64')
    return `@font-face{font-family:"${family}";font-weight:${weight};font-style:${style};`
      + `font-display:swap;src:url(data:font/woff2;base64,${data}) format("woff2")}`
  }).join('\n')
}

const esc = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const num = (value) => value.toFixed(2).replace('.', ',')

/* Groups follow the order of semantic-colors.css, cut where the roles change. */
const GROUPS = [
  ['Flächen', (name) => name.startsWith('medo-surface') || name === 'medo-overlay'],
  ['Text', (name) => name.startsWith('medo-text')],
  ['Icons', (name) => name.startsWith('medo-icon')],
  ['Rahmen', (name) => name.startsWith('medo-border')],
  ['Eingabefeld', (name) => name.startsWith('medo-input')],
  ['Aktionen', (name) => name.startsWith('medo-action')],
  ['Fokus', (name) => name.startsWith('medo-focus')],
  ['Zustände und Markierung', (name) => name.startsWith('medo-state') || name === 'medo-selection'
    || name === 'medo-divider' || name === 'medo-scrim'],
  ['Erfolg', (name) => name.startsWith('medo-success')],
  ['Warnung', (name) => name.startsWith('medo-warning')],
  ['Fehler', (name) => name.startsWith('medo-error')],
  ['Hinweis', (name) => name.startsWith('medo-info')],
]

function groupRows(rows) {
  const used = new Set()
  const groups = GROUPS.map(([title, test]) => {
    const members = rows.filter((row) => !used.has(row.name) && test(row.name))
    members.forEach((row) => used.add(row.name))
    return { title, members }
  })
  const rest = rows.filter((row) => !used.has(row.name))
  if (rest.length) groups.push({ title: 'Weitere', members: rest })
  return groups.filter((group) => group.members.length)
}

/** A translucent value needs a ground before it can be shown as a solid chip. */
function chipColor(value, ground) {
  return parseColor(value).a === 1 ? value : flatten(value, ground)
}

function swatch(value, ground, label) {
  const solid = chipColor(value, ground)
  return `<span class="sw" style="--sw:${solid};--ring:${ground}" title="${esc(label)}"></span>`
}

function ratioBadge(value, threshold) {
  if (!threshold) return `<span class="ratio ratio--info">${num(value)}</span>`
  const state = value + 1e-9 >= threshold ? 'pass' : 'fail'
  return `<span class="ratio ratio--${state}">${num(value)}</span>`
}

function tokenRows(data) {
  const lightGround = data.light('medo-surface')
  const darkGround = data.dark('medo-surface')
  const threshold = { text: 4.5, ui: 3, none: 0 }

  return groupRows(data.rows).map((group) => {
    const body = group.members.map((row) => `
      <tr>
        <td class="mono tokname">--${esc(row.name)}</td>
        <td class="cell-sw">${swatch(row.lightValue, lightGround, row.lightValue)}<code>${esc(row.lightValue)}</code></td>
        <td class="cell-sw">${swatch(row.darkValue, darkGround, row.darkValue)}<code>${esc(row.darkValue)}</code></td>
        <td class="mono step">${row.step ? esc(row.step) : '<span class="special">Sonderfall</span>'}</td>
        <td class="num">${ratioBadge(row.lightRatio, threshold[row.kind])}</td>
        <td class="num">${ratioBadge(row.darkRatio, threshold[row.kind])}</td>
        <td class="note">${esc(row.note)}</td>
      </tr>`).join('')

    return `
      <section class="tokengroup">
        <h3>${esc(group.title)} <span class="count">${group.members.length}</span></h3>
        <div class="tablewrap">
          <table class="tokens">
            <thead>
              <tr>
                <th>Token</th><th>Hell</th><th>Dunkel</th><th>Stufe</th>
                <th class="num">Hell</th><th class="num">Dunkel</th><th>Anmerkung</th>
              </tr>
            </thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      </section>`
  }).join('')
}

/** Inline CSS custom properties so a specimen block renders one fixed palette. */
function paletteVars(theme, names) {
  return names.map((name) => `--${name}:${theme(name)}`).join(';')
}

const SPECIMEN_TOKENS = [
  'medo-surface', 'medo-surface-container', 'medo-surface-container-high', 'medo-surface-sunken',
  'medo-surface-hover', 'medo-surface-selected', 'medo-overlay', 'medo-text', 'medo-text-muted',
  'medo-text-subtle', 'medo-text-on-primary', 'medo-text-disabled', 'medo-text-link', 'medo-icon',
  'medo-icon-muted', 'medo-border', 'medo-border-strong', 'medo-border-subtle', 'medo-input-bg',
  'medo-input-text', 'medo-input-placeholder', 'medo-input-border', 'medo-input-border-focus',
  'medo-input-border-error', 'medo-action', 'medo-action-hover', 'medo-action-disabled',
  'medo-action-text', 'medo-action-text-disabled', 'medo-action-neutral', 'medo-action-neutral-text',
  'medo-focus-ring', 'medo-focus-ring-danger', 'medo-divider',
  'medo-success-surface', 'medo-success-text', 'medo-success-border', 'medo-success-solid',
  'medo-warning-surface', 'medo-warning-text', 'medo-warning-border', 'medo-warning-solid',
  'medo-error-surface', 'medo-error-text', 'medo-error-border', 'medo-error-solid',
  'medo-info-surface', 'medo-info-text', 'medo-info-border', 'medo-info-solid',
  'medo-success-on-solid', 'medo-warning-on-solid', 'medo-error-on-solid', 'medo-info-on-solid',
]

const STATUS_LABELS = [
  ['success', 'Termin wurde gespeichert.'],
  ['warning', 'Die Kartenlaufzeit endet am 30.09.2026. Bitte hinterlegen Sie eine neue Karte.'],
  ['error', 'Die Rechnung konnte nicht erzeugt werden, weil die Steuernummer fehlt. Ergänzen Sie sie in den Stammdaten.'],
  ['info', 'Die Auswertung berücksichtigt Buchungen bis 14.08.2026.'],
]

function specimens(theme, shadows, label, caption) {
  const vars = paletteVars(theme, SPECIMEN_TOKENS)
  const shadowVars = [...shadows].map(([name, value]) => `--${name}:${value}`).join(';')
  const alerts = STATUS_LABELS.map(([role, text]) => `
    <div class="alert" style="background:var(--medo-${role}-surface);
      border-top-color:var(--medo-${role}-border);border-right-color:var(--medo-${role}-border);
      border-bottom-color:var(--medo-${role}-border);border-left-color:var(--medo-${role}-border);
      color:var(--medo-${role}-text)">${esc(text)}</div>`).join('')

  return `
    <figure class="specimen" style="${vars};${shadowVars}">
      <figcaption><strong>${esc(label)}</strong> ${esc(caption)}</figcaption>
      <div class="stage">
        <div class="card">
          <p class="s-title">Terminübersicht</p>
          <p class="s-muted">Zuletzt aktualisiert am 15.08.2026 um 09:12 Uhr</p>

          <div class="field">
            <label>Patientennummer</label>
            <div class="input"><span class="ph">P-100482</span></div>
          </div>
          <div class="field">
            <label>Versicherung</label>
            <div class="input input--focus"><span class="val">AOK Nordost</span></div>
          </div>
          <div class="field">
            <label>Geburtsdatum</label>
            <div class="input input--error"><span class="ph">TT.MM.JJJJ</span></div>
            <p class="err">Das Datum fehlt. Tragen Sie es im Format 04.08.2026 ein.</p>
          </div>

          <div class="row">
            <button class="btn btn--primary" type="button">Termin anlegen</button>
            <button class="btn btn--neutral" type="button">Abbrechen</button>
            <button class="btn btn--disabled" type="button" disabled>Übernehmen</button>
          </div>

          <div class="list">
            <div class="li">Sprechstunde · 10:30 Uhr</div>
            <div class="li li--hover">Nachkontrolle · 11:15 Uhr</div>
            <div class="li li--selected">Erstgespräch · 13:00 Uhr</div>
          </div>

          <p class="s-link">Weitere Termine finden Sie in der <a href="#tokens">Wochenansicht</a>.</p>
        </div>

        <div class="menu">
          <div class="mi">Bearbeiten</div>
          <div class="mi mi--hover">Duplizieren</div>
          <div class="sep"></div>
          <div class="mi">Löschen</div>
        </div>

        <div class="alerts">${alerts}</div>

        <div class="solids">
          ${['success', 'warning', 'error', 'info'].map((role) => `
            <span class="pill" style="background:var(--medo-${role}-solid);color:var(--medo-${role}-on-solid)">
              ${role === 'success' ? 'Bezahlt' : role === 'warning' ? 'Offen' : role === 'error' ? 'Storniert' : 'Geplant'}
            </span>`).join('')}
        </div>
      </div>
    </figure>`
}

function ladder(data) {
  const steps = [
    ['medo-surface-sunken', 'sunken', 'vertiefte Fläche'],
    ['medo-surface', 'surface', 'Grundfläche'],
    ['medo-surface-container', 'container', 'Karte, Menü'],
    ['medo-surface-container-high', 'container-high', 'zweite Höhe'],
    ['medo-state-pressed', 'state-pressed', 'Druckzustand'],
  ]
  const column = (theme, title) => `
    <div class="ladder">
      <p class="laddertitle">${esc(title)}</p>
      ${steps.map(([name, short, role]) => `
        <div class="rung" style="background:${theme(name)};color:${theme('medo-text')};
          border-top-color:${theme('medo-border-subtle')};border-right-color:${theme('medo-border-subtle')};
          border-bottom-color:${theme('medo-border-subtle')};border-left-color:${theme('medo-border-subtle')}">
          <span class="mono">${esc(short)}</span>
          <span class="rungrole">${esc(role)}</span>
          <code>${esc(theme(name))}</code>
        </div>`).join('')}
    </div>`
  return `<div class="ladders">${column(data.light, 'Hell — Bestand')}${column(data.dark, 'Dunkel — Vorschlag')}</div>`
}

function specialCards(data) {
  const lightGround = data.light('medo-surface')
  const darkGround = data.dark('medo-surface')

  const alphaCards = SPECIAL_CASES.map((entry, index) => `
    <article class="special-card" id="sonderfall-${index + 1}">
      <header>
        <span class="idx">${index + 1}</span>
        <code class="mono">${esc(entry.token)}</code>
      </header>
      <div class="pair">
        <div><span class="lbl">Hell</span>${swatch(entry.light, lightGround, entry.light)}<code>${esc(entry.light)}</code></div>
        <div><span class="lbl">Dunkel</span>${swatch(entry.dark, darkGround, entry.dark)}<code>${esc(entry.dark)}</code></div>
      </div>
      <p class="headline">${esc(entry.headline)}</p>
      ${entry.text.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('')}
    </article>`).join('')

  const shadowCards = data.shadows.map((shadow, index) => `
    <article class="special-card" id="sonderfall-${index + 6}">
      <header>
        <span class="idx">${index + 6}</span>
        <code class="mono">--${esc(shadow.name)}</code>
      </header>
      <div class="shadowdemo">
        <div class="sd sd--light"><div class="chip" style="box-shadow:${shadow.lightValue}"></div><span>Hell</span></div>
        <div class="sd sd--dark"><div class="chip" style="box-shadow:${shadow.darkValue}"></div><span>Dunkel</span></div>
      </div>
      <p class="mono tiny">${esc(shadow.darkValue)}</p>
      <p>${esc(SHADOW_CASE.perShadow[shadow.name])}</p>
    </article>`).join('')

  const derivation = `
    <div class="callout">
      ${SHADOW_CASE.text.split('\n\n').map((p) => `<p>${p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`).join('')}
      <div class="tablewrap">
        <table class="plain">
          <thead><tr><th>Deckkraft hell</th><th class="num">Sprung auf Weiß</th>
            <th class="num">Nötig auf stone-1000</th><th class="num">Faktor</th></tr></thead>
          <tbody>${data.shadowDerivation.rows.map((row) => `
            <tr><td class="mono">${String(row.alpha).replace('.', ',')}</td>
              <td class="num mono">${num(row.target)}</td>
              <td class="num mono">${row.reachable ? String(row.needed).replace('.', ',') : '<span class="special">nicht erreichbar</span>'}</td>
              <td class="num mono">${row.reachable ? '× ' + String(row.factor).replace('.', ',') : '—'}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="tiny">Schwarz bei voller Deckung erreicht auf stone-1000 höchstens
        ${num(data.shadowDerivation.ceiling)}:1. Der stärkste helle Schatten liegt darüber.</p>
    </div>`

  const scrim = `
    <div class="callout">
      <p><strong>Der Scrim über die Deckkraft.</strong> „Trennung" ist der Dialog gegen die verschleierte
        Seite, „Hintergrund" die Lesbarkeit dessen, was dahinter liegt.</p>
      <div class="tablewrap">
        <table class="plain">
          <thead><tr><th>Deckkraft</th><th class="num">Hell: Trennung</th><th class="num">Hell: Hintergrund</th>
            <th class="num">Dunkel: Trennung</th><th class="num">Dunkel: Hintergrund</th></tr></thead>
          <tbody>${data.scrimCurve.light.map((row, index) => {
    const d = data.scrimCurve.dark[index]
    const current = row.alpha === 0.5
    return `<tr${current ? ' class="current"' : ''}>
              <td class="mono">${String(row.alpha).replace('.', ',')}${current ? ' <span class="tag">Bestand und Vorschlag</span>' : ''}</td>
              <td class="num mono">${num(row.separation)}</td><td class="num mono">${num(row.backdrop)}</td>
              <td class="num mono">${num(d.separation)}</td><td class="num mono">${num(d.backdrop)}</td></tr>`
  }).join('')}
          </tbody>
        </table>
      </div>
      <p class="tiny">Mit der hellen Grundfarbe stone-1100 käme der dunkle Scrim auf eine Trennung von
        ${num(data.scrimCurve.darkWithStone.separation)}:1 und einen Hintergrund von
        ${num(data.scrimCurve.darkWithStone.backdrop)}:1 — er täte also fast nichts.</p>
    </div>`

  return `${alphaCards}${scrim}${derivation}${shadowCards}`
}

function shortfallCards(data) {
  return data.shortfalls.map((row) => `
    <article class="shortfall">
      <h3>${esc(row.justification.title)}</h3>
      <p class="measure">
        <code class="mono">--${esc(row.fg)}</code> auf <code class="mono">--${esc(row.bg)}</code>
        <span class="ratio ratio--fail">${num(row.ratio)}</span>
        <span class="tiny">Schwelle ${num(row.threshold)} · hell ${num(row.lightRatio)}${row.lightPasses ? '' : ' (dort ebenfalls darunter)'}</span>
      </p>
      <p>${esc(row.justification.text)}</p>
    </article>`).join('')
}

function tradeoffs(data) {
  const ring = data.focusAlternative
  const action = data.actionAlternative
  return `
    <article class="tradeoff">
      <h3>1. Die Primärfläche wird hell, ihre Beschriftung dunkel</h3>
      <p>Das ist die sichtbarste Änderung am Charakter des Themes. Der Grund ist messbar: teal-600 als
        Füllfarbe erreicht auf stone-1000 nur <span class="ratio ratio--fail">${num(action.onSurface)}</span>
        und verfehlt die 3:1, die WCAG 2.2 für die Fläche eines Bedienelements verlangt — der Knopf
        verschwimmt mit der Seite. Der Vorschlag setzt teal-500
        (<span class="ratio ratio--pass">${num(action.chosenOnSurface)}</span>) mit dunkler Beschriftung
        (<span class="ratio ratio--pass">${num(action.chosenLabel)}</span>).</p>
      <p>Die Gegenrechnung: teal-600 mit weißer Schrift ergäbe
        <span class="ratio ratio--pass">${num(action.whiteLabel)}</span> für die Beschriftung — die wäre
        also in Ordnung, nur die Fläche nicht. Wer die Markenfarbe unverändert halten will, nimmt diese
        Unterschreitung in Kauf. Ich rate ab, halte die Variante aber für vertretbar, weil die
        Beschriftung das Element trägt.</p>
      <div class="btncompare" style="background:${data.dark('medo-surface')}">
        <div><span class="lbl">Vorschlag</span>
          <span class="btn btn--primary" style="--medo-action:${data.dark('medo-action')};--medo-action-text:${data.dark('medo-action-text')}">Termin anlegen</span></div>
        <div><span class="lbl">Gegenposition</span>
          <span class="btn btn--primary" style="--medo-action:${action.fill};--medo-action-text:#ffffff">Termin anlegen</span></div>
      </div>
    </article>

    <article class="tradeoff">
      <h3>2. Deckkraft des Fokusrings</h3>
      <p>Der Vorschlag hebt die Deckkraft von 35 auf 55 %. Nur so trägt der Ring auf allen vier
        Trägerflächen über 3:1. Bei unveränderten 35 % bliebe er darunter.</p>
      <div class="tablewrap">
        <table class="plain">
          <thead><tr><th>Variante</th><th>Wert</th>
            ${ring[0].per.map((p) => `<th class="num">${esc(p.surface.replace('medo-', ''))}</th>`).join('')}</tr></thead>
          <tbody>${ring.map((option) => `
            <tr><td>${esc(option.label)}</td><td class="mono">${esc(option.value)}</td>
              ${option.per.map((p) => `<td class="num">${ratioBadge(p.ratio, 3)}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </article>

    <article class="tradeoff">
      <h3>3. Textlink auf gedrückter Fläche</h3>
      <p>teal-400 erreicht dort <span class="ratio ratio--fail">4,11</span>. Eine Anhebung auf teal-300
        brächte <span class="ratio ratio--pass">5,25</span> und räumte die letzte AA-Unterschreitung bei
        Text aus, macht den Link im Ruhezustand aber spürbar blasser — bei Links ist ein Zuviel an
        Kontrast ein Verlust an Farbigkeit. Der Vorschlag bleibt bei teal-400.</p>
    </article>`
}

function lightFindings(data) {
  const fixed = data.lightShortfalls.filter((row) => row.darkPasses).length
  return `
    <p>Die Prüfung lief zuerst über die bestehende helle Palette. Dabei sind
      <strong>${data.lightShortfalls.length} Kombinationen</strong> aufgefallen, die schon heute unter
      ihrer Schwelle liegen. Das ist nicht Gegenstand dieser Aufgabe und steht hier nur zur Kenntnis.
      Der dunkle Vorschlag hebt ${fixed} davon über die Schwelle und erbt
      ${data.lightShortfalls.length - fixed}.</p>
    <div class="tablewrap">
      <table class="plain">
        <thead><tr><th>Vordergrund</th><th>Fläche</th><th class="num">Schwelle</th>
          <th class="num">Hell</th><th class="num">Dunkel</th></tr></thead>
        <tbody>${data.lightShortfalls.map((row) => `
          <tr><td class="mono">--${esc(row.fg)}</td><td class="mono">--${esc(row.bg)}</td>
            <td class="num mono">${num(row.threshold)}</td>
            <td class="num">${ratioBadge(row.lightRatio, row.threshold)}</td>
            <td class="num">${ratioBadge(row.darkRatio, row.threshold)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`
}

function checkList(checks) {
  return `<ul class="checks">${checks.map((check) => `
    <li><span class="tick">✓</span><span>${esc(check.name)}</span>
      <code class="mono">${esc(check.detail)}</code></li>`).join('')}</ul>`
}

export function buildPage() {
  const data = analyse()
  const checks = runVerification()
  if (checks.some((check) => !check.ok)) {
    throw new Error('Das Kontrastwerkzeug besteht seine eigene Prüfung nicht — keine Seite erzeugt.')
  }

  const lightShadows = new Map(data.tokens.shadows)

  return `<title>Dunkle Palette für medo</title>
<style>
${fontFaces()}

:root{
  --ground:#f7f7f6; --panel:#ffffff; --sunk:#ececeb;
  --ink:#24221e; --ink-soft:#4f4840; --ink-mute:#615951;
  --rule:#dbdad8; --rule-soft:#ececeb;
  --accent:#007265; --accent-strong:#007265; --accent-soft:#e2efed;
  --pass:#005f02; --warn:#a04800; --fail:#920000;
  --pass-bg:#e4efe6; --fail-bg:#f8e7e5;
  --shadow:0 1px 2px rgba(31,29,26,.06),0 1px 3px rgba(31,29,26,.04);
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ground:#24221e; --panel:#312d28; --sunk:#171513;
    --ink:#f7f7f6; --ink-soft:#c6c4c2; --ink-mute:#b0adaa;
    --rule:#3f3933; --rule-soft:#312d28;
    --accent:#619e96; --accent-strong:#adccc8; --accent-soft:#003b34;
    --pass:#93b89a; --warn:#ffae74; --fail:#d39e98;
    --pass-bg:#002c0b; --fail-bg:#420b09;
    --shadow:0 1px 2px rgba(0,0,0,.24),0 1px 3px rgba(0,0,0,.16);
  }
}
:root[data-theme="dark"]{
  --ground:#24221e; --panel:#312d28; --sunk:#171513;
  --ink:#f7f7f6; --ink-soft:#c6c4c2; --ink-mute:#b0adaa;
  --rule:#3f3933; --rule-soft:#312d28;
  --accent:#619e96; --accent-strong:#adccc8; --accent-soft:#003b34;
  --pass:#93b89a; --warn:#ffae74; --fail:#d39e98;
  --pass-bg:#002c0b; --fail-bg:#420b09;
  --shadow:0 1px 2px rgba(0,0,0,.24),0 1px 3px rgba(0,0,0,.16);
}

*{box-sizing:border-box}
body{
  margin:0; background:var(--ground); color:var(--ink);
  font-family:"DM Sans",system-ui,sans-serif; font-size:16px; line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.mono,code,.num,.ratio{font-family:"DM Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}
.wrap{max-width:1140px;margin:0 auto;padding:0 24px 96px}
.narrow{max-width:68ch}

h1,h2,h3{text-wrap:balance;margin:0;letter-spacing:-.02em;font-weight:700}
h1{font-size:39px;line-height:1.15}
h2{font-size:25px;line-height:1.35;margin-bottom:8px}
h3{font-size:20px;line-height:1.5;font-weight:600}
p{margin:0 0 12px}
a{color:var(--accent-strong)}
a:focus-visible,summary:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:4px}

header.masthead{border-bottom:1px solid var(--rule);margin-bottom:48px;padding:64px 0 40px}
.eyebrow{font-family:"DM Mono",monospace;font-size:12px;letter-spacing:.04em;text-transform:uppercase;
  color:var(--ink-mute);margin:0 0 16px}
.status{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:9999px;
  background:var(--accent-soft);color:var(--accent-strong);font-size:14px;font-weight:500;margin-bottom:24px}
.status::before{content:"";width:8px;height:8px;border-radius:9999px;background:currentColor}
.lede{font-size:20px;line-height:1.5;color:var(--ink-soft);margin-top:16px}

.decisions{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:32px}
.decision{background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:16px 18px;
  box-shadow:var(--shadow);text-decoration:none;color:inherit;display:block}
.decision:hover{border-color:var(--accent)}
.decision .n{font-family:"DM Mono",monospace;font-size:12px;color:var(--accent-strong);display:block;margin-bottom:6px}
.decision .t{font-weight:600;display:block;margin-bottom:4px}
.decision .d{font-size:14px;color:var(--ink-mute);line-height:1.45}

section.block{margin-top:64px;scroll-margin-top:24px}
section.block > .intro{margin-bottom:24px}

.tablewrap{overflow-x:auto;border:1px solid var(--rule);border-radius:12px;background:var(--panel)}
table{border-collapse:collapse;width:100%;font-size:14px}
th{text-align:left;font-weight:500;font-size:12px;letter-spacing:.04em;text-transform:uppercase;
  color:var(--ink-mute);padding:10px 12px;border-bottom:1px solid var(--rule);white-space:nowrap}
td{padding:9px 12px;border-bottom:1px solid var(--rule-soft);vertical-align:top}
tbody tr:last-child td{border-bottom:0}
th.num,td.num{text-align:right}
.plain td.mono{font-size:13px}
tr.current{background:var(--accent-soft)}
.tag{font-size:11px;color:var(--ink-mute);font-family:"DM Sans",sans-serif}

.tokengroup{margin-top:32px}
.tokengroup h3{display:flex;align-items:baseline;gap:10px;margin-bottom:12px}
.count{font-family:"DM Mono",monospace;font-size:12px;color:var(--ink-mute);font-weight:400}
.tokens td.note{font-size:13px;color:var(--ink-mute);line-height:1.45;min-width:22ch}
.tokname{font-size:13px;white-space:nowrap}
.step{font-size:13px;color:var(--ink-mute);white-space:nowrap}
.special{color:var(--warn);font-style:normal}
.cell-sw{white-space:nowrap}
.cell-sw code{font-size:12px;color:var(--ink-mute);margin-left:8px}
.sw{display:inline-block;width:20px;height:20px;border-radius:5px;background:var(--sw);
  box-shadow:inset 0 0 0 1px rgba(128,128,128,.35);vertical-align:-4px}

.ratio{display:inline-block;min-width:46px;text-align:right;padding:2px 7px;border-radius:5px;
  font-size:13px;font-weight:500}
.ratio--pass{background:var(--pass-bg);color:var(--pass)}
.ratio--fail{background:var(--fail-bg);color:var(--fail)}
.ratio--info{color:var(--ink-mute)}

.ladders{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.ladder{border:1px solid var(--rule);border-radius:12px;overflow:hidden}
.laddertitle{margin:0;padding:10px 14px;background:var(--panel);border-bottom:1px solid var(--rule);
  font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-mute);
  font-family:"DM Mono",monospace}
.rung{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom-width:1px;
  border-bottom-style:solid;font-size:14px}
.rung:last-child{border-bottom:0}
.rung .mono{font-size:13px;min-width:15ch}
.rungrole{flex:1;opacity:.75;font-size:13px}
.rung code{font-size:12px;opacity:.7}

.specimens{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px}
.specimen{margin:0}
.specimen figcaption{font-size:13px;color:var(--ink-mute);margin-bottom:10px}
.specimen figcaption strong{color:var(--ink);font-weight:600}
.stage{background:var(--medo-surface);border-radius:12px;padding:20px;display:flex;flex-direction:column;
  gap:20px;box-shadow:var(--shadow);border:1px solid var(--rule)}
.card{background:var(--medo-surface-container);border-radius:10px;padding:18px;
  color:var(--medo-text);box-shadow:var(--medo-shadow-sm)}
.s-title{font-weight:600;margin:0 0 2px}
.s-muted{color:var(--medo-text-muted);font-size:13px;margin:0 0 16px}
.field{margin-bottom:12px}
.field label{display:block;font-size:13px;color:var(--medo-text-subtle);margin-bottom:4px}
.input{background:var(--medo-input-bg);border:1px solid var(--medo-input-border);border-radius:8px;
  padding:9px 12px;font-size:14px;color:var(--medo-input-text)}
.input--focus{border-top-color:var(--medo-input-border-focus);border-right-color:var(--medo-input-border-focus);border-bottom-color:var(--medo-input-border-focus);border-left-color:var(--medo-input-border-focus);box-shadow:0 0 0 3px var(--medo-focus-ring)}
.input--error{border-top-color:var(--medo-input-border-error);border-right-color:var(--medo-input-border-error);border-bottom-color:var(--medo-input-border-error);border-left-color:var(--medo-input-border-error);box-shadow:0 0 0 3px var(--medo-focus-ring-danger)}
.ph{color:var(--medo-input-placeholder)}
.err{font-size:12px;color:var(--medo-error-text);margin:5px 0 0;line-height:1.45}
.row{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
.btn{border:0;border-radius:8px;padding:9px 16px;font-family:inherit;font-size:14px;font-weight:400;
  cursor:default;line-height:1.45;display:inline-block}
.btn--primary{background:var(--medo-action);color:var(--medo-action-text)}
.btn--neutral{background:var(--medo-action-neutral);color:var(--medo-action-neutral-text)}
.btn--disabled{background:var(--medo-action-disabled);color:var(--medo-action-text-disabled)}
.list{border-top:1px solid var(--medo-divider);margin-top:8px}
.li{padding:9px 10px;font-size:14px;border-bottom:1px solid var(--medo-divider);color:var(--medo-text)}
.li--hover{background:var(--medo-surface-hover)}
.li--selected{background:var(--medo-surface-selected)}
.s-link{font-size:14px;margin:14px 0 0;color:var(--medo-text-muted)}
.s-link a{color:var(--medo-text-link)}
.menu{background:var(--medo-overlay);border-radius:10px;padding:6px;box-shadow:var(--medo-shadow-md);
  color:var(--medo-text);max-width:220px}
.mi{padding:8px 12px;font-size:14px;border-radius:6px}
.mi--hover{background:var(--medo-surface-hover)}
.sep{height:1px;background:var(--medo-divider);margin:5px 8px}
.alerts{display:flex;flex-direction:column;gap:8px}
.alert{border-width:1px;border-style:solid;border-radius:8px;padding:10px 12px;font-size:13px;line-height:1.45}
.solids{display:flex;flex-wrap:wrap;gap:8px}
.pill{border-radius:9999px;padding:4px 14px;font-size:13px}

.special-card{background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:20px 22px;
  margin-bottom:16px}
.special-card header{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.idx{width:26px;height:26px;border-radius:9999px;background:var(--accent);color:var(--ground);
  display:grid;place-items:center;font-size:13px;font-weight:600;flex:0 0 auto;
  font-family:"DM Mono",monospace}
.special-card header code{font-size:15px;font-weight:500}
.special-card .pair{display:flex;gap:28px;flex-wrap:wrap;margin-bottom:14px}
.special-card .pair > div{display:flex;align-items:center;gap:8px}
.lbl{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-mute);
  font-family:"DM Mono",monospace}
.headline{font-weight:600;margin-bottom:10px}
.special-card p{font-size:14px;line-height:1.6;color:var(--ink-soft)}
.special-card p:last-child{margin-bottom:0}
.tiny{font-size:12px;color:var(--ink-mute)}

.shadowdemo{display:flex;gap:14px;margin-bottom:12px}
.sd{flex:1;border-radius:10px;padding:22px;display:flex;flex-direction:column;align-items:center;gap:12px;
  font-size:12px;font-family:"DM Mono",monospace}
.sd--light{background:#ffffff;color:#615951}
.sd--dark{background:#24221e;color:#b0adaa}
.sd .chip{width:100%;height:34px;border-radius:8px}
.sd--light .chip{background:#f7f7f6}
.sd--dark .chip{background:#312d28}

.callout{background:var(--sunk);border-radius:12px;padding:20px 22px;margin-bottom:16px}
.callout p{font-size:14px;color:var(--ink-soft)}
.callout .tablewrap{margin:14px 0;background:var(--panel)}

.shortfall,.tradeoff{background:var(--panel);border:1px solid var(--rule);border-radius:12px;
  padding:20px 22px;margin-bottom:16px}
.shortfall h3,.tradeoff h3{margin-bottom:10px}
.measure{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:12px}
.measure code{font-size:13px}
.shortfall p,.tradeoff p{font-size:14px;line-height:1.6;color:var(--ink-soft)}
.btncompare{display:flex;gap:24px;flex-wrap:wrap;margin-top:14px;padding:16px;border-radius:10px}
.btncompare > div{display:flex;flex-direction:column;gap:8px}
.btncompare .lbl{color:#b0adaa}

.checks{list-style:none;margin:0;padding:0;display:grid;gap:2px}
.checks li{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:baseline;
  padding:7px 12px;border-radius:7px;font-size:14px}
.checks li:nth-child(odd){background:var(--panel)}
.tick{color:var(--pass);font-weight:700}
.checks code{font-size:12px;color:var(--ink-mute);text-align:right}

footer{margin-top:80px;padding-top:24px;border-top:1px solid var(--rule);font-size:13px;
  color:var(--ink-mute)}

@media (max-width:720px){
  h1{font-size:31px}
  header.masthead{padding:40px 0 32px}
  .btncompare{flex-direction:column}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>

<div class="wrap">
  <header class="masthead">
    <p class="eyebrow">medo Design System · Ebene 3 — Semantic</p>
    <div class="status">Vorschlag — nicht umgesetzt</div>
    <h1>Dunkle Palette</h1>
    <p class="lede narrow">Alle ${data.rows.length} Token der Semantic-Ebene in dunkler Ausprägung, mit
      Kontrastzahlen nach WCAG 2.2. Brand- und Alias-Ebene bleiben in beiden Themes identisch. Diese
      Seite ändert keine Theme-Datei und kein Stylesheet — erst Ihre Freigabe macht die Werte
      verbindlich.</p>

    <div class="decisions">
      <a class="decision" href="#leiter">
        <span class="n">Entscheidung 1</span>
        <span class="t">Die Flächenleiter</span>
        <span class="d">Sie bestimmt den Grundcharakter. Stimmt die, folgt der Rest.</span>
      </a>
      <a class="decision" href="#sonderfaelle">
        <span class="n">Entscheidung 2</span>
        <span class="t">Die neun Sonderfälle</span>
        <span class="d">Die einzigen Werte außerhalb der Brand-Skalen: fünf mit Transparenz, vier Schatten.</span>
      </a>
      <a class="decision" href="#abwaegungen">
        <span class="n">Entscheidung 3</span>
        <span class="t">Drei Abwägungen</span>
        <span class="d">Je eine vertretbare Gegenposition, die Sie wählen könnten.</span>
      </a>
    </div>
  </header>

  <section class="block" id="muster">
    <div class="intro narrow">
      <h2>Zuerst das Ergebnis</h2>
      <p>Dieselbe Oberfläche, links im heutigen Bestand, rechts im Vorschlag. Alle Farben stammen aus
        den Token — nichts ist für die Ansicht nachgebessert.</p>
    </div>
    <div class="specimens">
      ${specimens(data.light, lightShadows, 'Hell', '— der heutige Bestand')}
      ${specimens(data.dark, new Map(data.shadows.map((s) => [s.name, s.darkValue])), 'Dunkel', '— der Vorschlag')}
    </div>
  </section>

  <section class="block" id="leiter">
    <div class="intro narrow">
      <h2>Entscheidung 1 · Die Flächenleiter</h2>
      <p>Im hellen Theme ist die Grundfläche das Hellste, was es gibt, und alles Weitere staffelt sich
        darunter. Diese Anordnung lässt sich nicht einfach spiegeln: im Dunkeln trägt
        <strong>Helligkeit die Höhe</strong>, und unterhalb der Grundfläche braucht es Platz für
        vertiefte Flächen.</p>
    </div>
    ${ladder(data)}
    <div class="intro narrow" style="margin-top:24px">
      <p>Zwei Abweichungen von der reinen Spiegelung stecken darin, beide unvermeidlich.
        <strong>surface-sunken</strong> liegt hell auf derselben Stufe wie container-high; im Dunkeln
        muss eine vertiefte Fläche unter die Grundfläche, sonst wirkt sie erhoben.
        <strong>overlay</strong> ist hell mit surface identisch — ein weißes Menü auf weißer Seite,
        getrennt allein durch den Schatten. Auf dunklem Grund trägt kein Schatten mehr, also muss das
        Menü selbst heller sein.</p>
    </div>
  </section>

  <section class="block" id="sonderfaelle">
    <div class="intro narrow">
      <h2>Entscheidung 2 · Die neun Sonderfälle</h2>
      <p>Fünf Transparenz-Literale und vier Schattendefinitionen. Nur hier sind Werte außerhalb der
        Brand-Skalen zulässig, und nur hier steht eine Setzung statt einer Ableitung — beim Faktor
        der Schatten.</p>
    </div>
    ${specialCards(data)}
  </section>

  <section class="block" id="abwaegungen">
    <div class="intro narrow">
      <h2>Entscheidung 3 · Drei Abwägungen</h2>
      <p>An diesen drei Stellen gibt es eine vertretbare Gegenposition. Der Vorschlag hat sich jeweils
        entschieden, aber die Wahl ist Ihre.</p>
    </div>
    ${tradeoffs(data)}
  </section>

  <section class="block" id="unterschreitungen">
    <div class="intro narrow">
      <h2>Unterschreitungen im Einzelnen</h2>
      <p>Zwei Kombinationen bleiben unter ihrer Schwelle. Beide erben eine Eigenschaft, die das helle
        Theme heute schon hat — keine ist neu.</p>
    </div>
    ${shortfallCards(data)}
  </section>

  <section class="block" id="tokens">
    <div class="intro narrow">
      <h2>Alle ${data.rows.length} Token</h2>
      <p>Vollständig und in der Reihenfolge der Quelldatei. Die beiden Zahlenspalten messen jedes Token
        gegen seinen natürlichen Partner: Flächen gegen den Text darauf, Text gegen die Fläche darunter.</p>
    </div>
    ${tokenRows(data)}
  </section>

  <section class="block" id="werkzeug">
    <div class="intro narrow">
      <h2>Prüfung des Werkzeugs</h2>
      <p>Bevor das Kontrastwerkzeug auf die dunkle Palette angesetzt wurde, musste es die
        <strong>helle</strong> korrekt bewerten. Geprüft wurden die Fixpunkte der WCAG-Formel, die in
        <code class="mono">design-reference/CLAUDE.md</code> festgehaltenen Herleitungen der fünf
        Transparenz-Literale, und eine dort dokumentierte, überprüfbare Aussage: dass Weiß auf Amber zu
        schwach ist und <code class="mono">warning-on-solid</code> deshalb stone-1000 trägt.</p>
    </div>
    ${checkList(checks)}
    <p class="tiny" style="margin-top:14px">Gegenprobe: mit verfälschtem Luminanz-Koeffizienten und mit
      vertauschter Kompositionsrichtung schlägt der Lauf jeweils fehl. Die Prüfung kann also rot werden.</p>
  </section>

  <section class="block" id="hellbefund">
    <div class="intro narrow">
      <h2>Was die Prüfung nebenbei am hellen Theme gefunden hat</h2>
    </div>
    <div class="narrow">${lightFindings(data)}</div>
  </section>

  <footer>
    <p>Erzeugt aus <code class="mono">src/styles/medo/</code> (nur gelesen) und dem Vorschlag in
      <code class="mono">scripts/contrast/dark-palette.mjs</code>. Neu erzeugen mit
      <code class="mono">npm run contrast</code>.</p>
  </footer>
</div>
`
}

function main() {
  const html = buildPage()
  mkdirSync(path.dirname(OUT), { recursive: true })
  writeFileSync(OUT, html, 'utf8')
  console.log(`Entscheidungsseite geschrieben: ${path.relative(REPO_ROOT, OUT)}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main()
