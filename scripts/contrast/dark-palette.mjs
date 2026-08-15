/* The proposed dark expression of the semantic layer.
   Brand and alias layers stay identical in both themes — every entry below
   either points at an existing brand step or is one of the nine special cases
   (five translucent literals, four shadows) argued individually.

   `ref` names the partner token a row's contrast number is measured against.
   `kind` picks the WCAG 2.2 threshold: text 4.5, ui 3.0, none = informational.

   Notes are user-facing German; they must not restate measured numbers, the
   report prints those next to them. */

export const THRESHOLDS = { text: 4.5, 'text-large': 3, ui: 3, none: 0 }

const s = (step) => ({ step })

export const DARK = new Map([
  // --- surfaces -----------------------------------------------------------
  ['medo-surface', { ...s('stone-1000'), ref: 'medo-text', kind: 'text',
    note: 'Grundfläche. Bewusst nicht die dunkelste Stufe, damit darunter Platz für vertiefte Flächen bleibt.' }],
  ['medo-surface-container', { ...s('stone-900'), ref: 'medo-text', kind: 'text',
    note: 'Karten liegen eine Stufe über der Grundfläche — im Dunkeln trägt Helligkeit die Höhe.' }],
  ['medo-surface-container-high', { ...s('stone-800'), ref: 'medo-text', kind: 'text',
    note: 'Zweite Höhenstufe.' }],
  ['medo-surface-sunken', { ...s('stone-1100'), ref: 'medo-text', kind: 'text',
    note: 'ABWEICHUNG: hell liegt sunken auf derselben Stufe wie container-high. Im Dunkeln muss eine vertiefte Fläche unter die Grundfläche, sonst wirkt sie erhoben.' }],
  ['medo-surface-hover', { ...s('stone-800'), ref: 'medo-text', kind: 'text',
    note: 'Gleiche Stufe wie container-high — dieselbe Gleichsetzung wie im hellen Theme.' }],
  ['medo-surface-selected', { ...s('teal-900'), ref: 'medo-text', kind: 'text',
    note: 'Ausgewählte Zeile: teal-Tiefton statt teal-Hellton.' }],
  ['medo-overlay', { ...s('stone-900'), ref: 'medo-text', kind: 'text',
    note: 'ABWEICHUNG: hell ist overlay mit surface identisch, die Trennung kommt vom Schatten. Auf dunklem Grund trägt kein Schatten — das Menü muss selbst heller sein.' }],

  // --- text ---------------------------------------------------------------
  ['medo-text', { ...s('stone-50'), ref: 'medo-surface', kind: 'text',
    note: 'Nicht reines Weiß: das reduziert das Ausblühen der Schrift auf dunklem Grund.' }],
  ['medo-text-muted', { literal: '#f7f7f6ad', ref: 'medo-surface', kind: 'text', special: 'alpha',
    note: 'stone-50 bei 68 % — dieselbe Deckkraft wie hell, gespiegelte Grundfarbe.' }],
  ['medo-text-subtle', { ...s('stone-300'), ref: 'medo-surface', kind: 'text',
    note: 'Eine Spur unter der Textfarbe, so wie hell stone-800 eine Spur über stone-1000 liegt.' }],
  ['medo-text-on-primary', { ...s('stone-1100'), ref: 'medo-action', kind: 'text',
    note: 'Kehrt sich um: die Primärfläche wird hell, ihre Beschriftung dunkel.' }],
  ['medo-text-disabled', { ...s('stone-500'), ref: 'medo-surface', kind: 'none',
    note: 'stone-500 bleibt in beiden Themes stehen — die Mitte der Skala trägt auf hellem wie auf dunklem Grund. Entscheidend ist die Dämpfung gegenüber dem Fließtext, nicht die absolute Zahl.' }],
  ['medo-text-link', { ...s('teal-400'), ref: 'medo-surface', kind: 'text',
    note: 'teal-600 verschwindet auf dunklem Grund; die 400er-Stufe hält Farbton und Lesbarkeit.' }],
  ['medo-text-link-hover', { ...s('teal-300'), ref: 'medo-surface', kind: 'text',
    note: 'Hover geht im Dunkeln heller, nicht dunkler.' }],

  // --- icons --------------------------------------------------------------
  ['medo-icon', { ...s('stone-100'), ref: 'medo-surface', kind: 'ui',
    note: 'Wie hell: eine Stufe neben der Textfarbe.' }],
  ['medo-icon-muted', { literal: '#f7f7f68c', ref: 'medo-surface', kind: 'ui', special: 'alpha',
    note: 'stone-50 bei 55 % — dieselbe Deckkraft wie hell, gespiegelte Grundfarbe.' }],
  ['medo-icon-on-primary', { ...s('stone-1100'), ref: 'medo-action', kind: 'ui',
    note: 'Folgt text-on-primary.' }],
  ['medo-icon-disabled', { ...s('stone-500'), ref: 'medo-surface', kind: 'none',
    note: 'Folgt text-disabled.' }],

  // --- borders ------------------------------------------------------------
  ['medo-border', { ...s('stone-700'), ref: 'medo-surface', kind: 'none',
    note: 'Trifft die Zurückhaltung, die stone-300 auf Weiß hat — siehe die beiden Kontrastspalten.' }],
  ['medo-border-strong', { ...s('stone-500'), ref: 'medo-surface', kind: 'ui',
    note: 'stone-500 trägt auf beiden Gründen. Im Dunkeln deutlicher als hell, wo die Kante knapp unter 3:1 bleibt.' }],
  ['medo-border-subtle', { ...s('stone-800'), ref: 'medo-surface', kind: 'none',
    note: 'Trifft die Zurückhaltung von stone-200 auf Weiß nahezu exakt.' }],
  ['medo-border-disabled', { ...s('stone-800'), ref: 'medo-surface', kind: 'none',
    note: 'Folgt border-subtle, wie hell.' }],

  // --- inputs -------------------------------------------------------------
  ['medo-input-bg', { ...s('stone-1100'), ref: 'medo-input-text', kind: 'text',
    note: 'Das Feld sitzt am äußeren Ende der Flächenleiter — hell am hellen Ende, dunkel am dunklen.' }],
  ['medo-input-bg-disabled', { ...s('stone-900'), ref: 'medo-input-text', kind: 'none',
    note: 'Das gesperrte Feld verliert die Vertiefung und liegt flach.' }],
  ['medo-input-text', { ...s('stone-50'), ref: 'medo-input-bg', kind: 'text',
    note: 'Folgt text.' }],
  ['medo-input-placeholder', { ...s('stone-400'), ref: 'medo-input-bg', kind: 'text',
    note: 'Trifft die Helligkeitsrelation, die stone-600 auf Weiß hat.' }],
  ['medo-input-border', { ...s('stone-600'), ref: 'medo-input-bg', kind: 'ui',
    note: 'Bewusst zurückhaltend — spiegelt die im hellen Theme gelockte Entscheidung für stone-400.' }],
  ['medo-input-border-hover', { ...s('stone-400'), ref: 'medo-input-bg', kind: 'ui',
    note: 'Trifft die Relation von stone-600 auf Weiß.' }],
  ['medo-input-border-focus', { ...s('teal-400'), ref: 'medo-input-bg', kind: 'ui',
    note: 'Dünne Linien liegen eine Stufe heller als Füllflächen, die auf teal-500 sitzen.' }],
  ['medo-input-border-error', { ...s('red-400'), ref: 'medo-input-bg', kind: 'ui',
    note: 'Dieselbe Regel wie border-focus, auf der Fehlerskala.' }],
  ['medo-input-border-disabled', { ...s('stone-800'), ref: 'medo-input-bg', kind: 'none',
    note: 'Folgt border-disabled.' }],

  // --- actions ------------------------------------------------------------
  ['medo-action', { ...s('teal-500'), ref: 'medo-surface', kind: 'ui',
    note: 'teal-600 verfehlt auf dunklem Grund die 3:1-Grenze für Bedienflächen — siehe Abwägung 1.' }],
  ['medo-action-hover', { ...s('teal-400'), ref: 'medo-surface', kind: 'ui',
    note: 'Hover heller statt dunkler.' }],
  ['medo-action-active', { ...s('teal-300'), ref: 'medo-surface', kind: 'ui',
    note: 'Aktiv noch eine Stufe heller.' }],
  ['medo-action-disabled', { ...s('stone-800'), ref: 'medo-surface', kind: 'none',
    note: 'Spiegelt stone-200 auf Weiß.' }],
  ['medo-action-text', { ...s('stone-1100'), ref: 'medo-action', kind: 'text',
    note: 'Folgt text-on-primary.' }],
  ['medo-action-text-disabled', { ...s('stone-500'), ref: 'medo-action-disabled', kind: 'none',
    note: 'Folgt text-disabled.' }],
  ['medo-action-neutral', { ...s('stone-800'), ref: 'medo-action-neutral-text', kind: 'text',
    note: 'Gleiche Stufe wie surface-hover — dieselbe Gleichsetzung wie hell.' }],
  ['medo-action-neutral-hover', { ...s('stone-700'), ref: 'medo-action-neutral-text', kind: 'text',
    note: 'Eine Stufe heller.' }],
  ['medo-action-neutral-active', { ...s('stone-600'), ref: 'medo-action-neutral-text', kind: 'text',
    note: 'Zwei Stufen heller.' }],
  ['medo-action-neutral-text', { ...s('stone-50'), ref: 'medo-action-neutral', kind: 'text',
    note: 'Folgt text.' }],

  // --- focus --------------------------------------------------------------
  ['medo-focus-ring', { literal: '#adccc88c', ref: 'medo-surface', kind: 'ui', special: 'alpha',
    note: 'teal-300 bei 55 %. Die einzige Stelle, an der die Deckkraft steigt — siehe Sonderfall 3.' }],
  ['medo-focus-ring-danger', { literal: '#e1bab58c', ref: 'medo-surface', kind: 'ui', special: 'alpha',
    note: 'red-300 bei 55 %, gleiche Herleitung wie focus-ring.' }],

  // --- states -------------------------------------------------------------
  ['medo-state-hover', { ...s('stone-800'), ref: 'medo-text', kind: 'text',
    note: 'Folgt surface-hover.' }],
  ['medo-state-pressed', { ...s('stone-700'), ref: 'medo-text', kind: 'text',
    note: 'Eine Stufe über hover, wie hell stone-200 über stone-100.' }],
  ['medo-state-selected', { ...s('teal-900'), ref: 'medo-text', kind: 'text',
    note: 'Folgt surface-selected.' }],
  ['medo-selection', { ...s('teal-800'), ref: 'medo-text', kind: 'text',
    note: 'Textmarkierung eine Stufe kräftiger als state-selected, wie hell teal-200 über teal-100.' }],
  ['medo-divider', { ...s('stone-800'), ref: 'medo-surface', kind: 'none',
    note: 'Folgt border-subtle, wie hell.' }],
  ['medo-scrim', { literal: 'rgba(0,0,0,0.5)', ref: 'medo-overlay', kind: 'none', special: 'alpha',
    note: 'Deckkraft bleibt bei 50 %, nur die Grundfarbe wechselt auf Schwarz — siehe Sonderfall 5.' }],

  // --- status sets --------------------------------------------------------
  ...statusSet('success', 'green'),
  ...statusSet('warning', 'amber'),
  ...statusSet('error', 'red'),
  ...statusSet('info', 'blue'),
])

function statusSet(role, scale) {
  return [
    [`medo-${role}-surface`, { ...s(`${scale}-1000`), ref: `medo-${role}-text`, kind: 'text',
      note: 'Meldungsfläche auf der tiefsten Tonstufe der eigenen Skala.' }],
    [`medo-${role}-text`, { ...s(`${scale}-300`), ref: `medo-${role}-surface`, kind: 'text',
      note: 'Heller Ton der eigenen Skala — behält den Farbton als Bedeutungsträger, statt ins Weiße zu gehen.' }],
    [`medo-${role}-border`, { ...s(`${scale}-700`), ref: 'medo-surface', kind: 'none',
      note: 'Spiegelt die Zurückhaltung der 300er-Kante im hellen Theme.' }],
    [`medo-${role}-solid`, { ...s(`${scale}-500`), ref: 'medo-surface', kind: 'ui',
      note: 'Wie action: die 600er-Stufe verfehlt auf dunklem Grund die 3:1-Grenze.' }],
    [`medo-${role}-solid-hover`, { ...s(`${scale}-400`), ref: 'medo-surface', kind: 'ui',
      note: 'Hover heller statt dunkler.' }],
    [`medo-${role}-solid-active`, { ...s(`${scale}-300`), ref: 'medo-surface', kind: 'ui',
      note: 'Aktiv noch eine Stufe heller.' }],
    [`medo-${role}-on-solid`, { ...s('stone-1100'), ref: `medo-${role}-solid`, kind: 'text',
      note: 'Alle vier Füllfarben tragen im Dunkeln dunkle Schrift — die helle Sonderregel für Warnung entfällt damit.' }],
  ]
}

/* Same geometry as the light shadows, base swapped to pure black, every alpha
   multiplied by four. One rule for all four steps, no per-shadow tuning. */
export const DARK_SHADOWS = new Map([
  ['medo-shadow-sm', '0 1px 2px rgba(0,0,0,0.24), 0 1px 3px rgba(0,0,0,0.16)'],
  ['medo-shadow-md', '0 2px 4px rgba(0,0,0,0.24), 0 6px 16px rgba(0,0,0,0.28)'],
  ['medo-shadow-lg', '0 4px 8px rgba(0,0,0,0.24), 0 14px 32px rgba(0,0,0,0.40)'],
  ['medo-shadow-xl', '0 8px 18px rgba(0,0,0,0.32), 0 28px 60px rgba(0,0,0,0.64)'],
])

/** Resolve a proposal entry to a concrete CSS colour value. */
export function darkValue(tokens, name) {
  const entry = DARK.get(name)
  if (!entry) throw new Error(`No dark proposal for --${name}`)
  if (entry.literal) return entry.literal
  const value = tokens.raw.get(`medo-color-${entry.step}`)
  if (value === undefined) throw new Error(`Unknown brand step ${entry.step} for --${name}`)
  return value
}
