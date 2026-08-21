/* What each semantic token is for — not what colour it is.

   The values live in src/styles/medo-theme.css and nowhere else. This file
   carries only the evaluation metadata: which partner a token is measured
   against, which WCAG 2.2 threshold applies, and why the dark mapping is what
   it is. Nothing here can drift from the stylesheet, because nothing here
   states a colour.

   `ref` names the partner a row's contrast number is measured against.
   `kind` picks the threshold: text 4.5, ui 3.0, none = informational.
   Notes are user-facing German and must not restate measured numbers. */

export const THRESHOLDS = { text: 4.5, 'text-large': 3, ui: 3, none: 0 }

export const ROLES = new Map([
  // --- surfaces -----------------------------------------------------------
  ['medo-surface', { ref: 'medo-text', kind: 'text',
    note: 'Grundfläche. Bewusst nicht die dunkelste Stufe, damit darunter Platz für vertiefte Flächen bleibt.' }],
  ['medo-surface-container', { ref: 'medo-text', kind: 'text',
    note: 'Karten liegen eine Stufe über der Grundfläche — im Dunkeln trägt Helligkeit die Höhe.' }],
  ['medo-surface-container-high', { ref: 'medo-text', kind: 'text',
    note: 'Zweite Höhenstufe.' }],
  ['medo-surface-sunken', { ref: 'medo-text', kind: 'text',
    note: 'ABWEICHUNG: hell liegt sunken auf derselben Stufe wie container-high. Im Dunkeln muss eine vertiefte Fläche unter die Grundfläche, sonst wirkt sie erhoben.' }],
  ['medo-surface-hover', { ref: 'medo-text', kind: 'text',
    note: 'Gleiche Stufe wie container-high — dieselbe Gleichsetzung wie im hellen Theme.' }],
  ['medo-surface-selected', { ref: 'medo-text', kind: 'text',
    note: 'Ausgewählte Zeile: teal-Tiefton statt teal-Hellton.' }],
  ['medo-overlay', { ref: 'medo-text', kind: 'text',
    note: 'ABWEICHUNG: hell ist overlay mit surface identisch, die Trennung kommt vom Schatten. Auf dunklem Grund trägt kein Schatten — das Menü muss selbst heller sein.' }],

  // --- text ---------------------------------------------------------------
  ['medo-text', { ref: 'medo-surface', kind: 'text',
    note: 'Nicht reines Weiß: das reduziert das Ausblühen der Schrift auf dunklem Grund.' }],
  ['medo-text-muted', { ref: 'medo-surface', kind: 'text',
    note: 'stone-50 bei 68 % — dieselbe Deckkraft wie hell, gespiegelte Grundfarbe.' }],
  ['medo-text-subtle', { ref: 'medo-surface', kind: 'text',
    note: 'Eine Spur unter der Textfarbe, so wie hell stone-800 eine Spur über stone-1000 liegt.' }],
  ['medo-text-on-primary', { ref: 'medo-action', kind: 'text',
    note: 'Kehrt sich um: die Primärfläche wird hell, ihre Beschriftung dunkel.' }],
  ['medo-text-disabled', { ref: 'medo-surface', kind: 'none',
    note: 'stone-500 bleibt in beiden Themes stehen — die Mitte der Skala trägt auf hellem wie auf dunklem Grund. Entscheidend ist die Dämpfung gegenüber dem Fließtext, nicht die absolute Zahl.' }],
  ['medo-text-link', { ref: 'medo-surface', kind: 'text',
    note: 'teal-600 verschwindet auf dunklem Grund; die 400er-Stufe hält Farbton und Lesbarkeit.' }],
  ['medo-text-link-hover', { ref: 'medo-surface', kind: 'text',
    note: 'Hover geht im Dunkeln heller, nicht dunkler.' }],

  // --- icons --------------------------------------------------------------
  ['medo-icon', { ref: 'medo-surface', kind: 'ui',
    note: 'Wie hell: eine Stufe neben der Textfarbe.' }],
  ['medo-icon-muted', { ref: 'medo-surface', kind: 'ui',
    note: 'stone-50 bei 55 % — dieselbe Deckkraft wie hell, gespiegelte Grundfarbe.' }],
  ['medo-icon-on-primary', { ref: 'medo-action', kind: 'ui',
    note: 'Folgt text-on-primary.' }],
  ['medo-icon-disabled', { ref: 'medo-surface', kind: 'none',
    note: 'Folgt text-disabled.' }],

  // --- borders ------------------------------------------------------------
  ['medo-border', { ref: 'medo-surface', kind: 'none',
    note: 'Trifft die Zurückhaltung, die stone-300 auf Weiß hat — siehe die beiden Kontrastspalten.' }],
  ['medo-border-strong', { ref: 'medo-surface', kind: 'ui',
    note: 'stone-500 trägt auf beiden Gründen. Im Dunkeln deutlicher als hell, wo die Kante knapp unter 3:1 bleibt.' }],
  ['medo-border-subtle', { ref: 'medo-surface', kind: 'none',
    note: 'Trifft die Zurückhaltung von stone-200 auf Weiß nahezu exakt.' }],
  ['medo-border-disabled', { ref: 'medo-surface', kind: 'none',
    note: 'Folgt border-subtle, wie hell.' }],

  // --- inputs -------------------------------------------------------------
  ['medo-input-bg', { ref: 'medo-input-text', kind: 'text',
    note: 'Das Feld sitzt am äußeren Ende der Flächenleiter — hell am hellen Ende, dunkel am dunklen.' }],
  ['medo-input-bg-disabled', { ref: 'medo-input-text', kind: 'none',
    note: 'Das gesperrte Feld verliert die Vertiefung und liegt flach.' }],
  ['medo-input-text', { ref: 'medo-input-bg', kind: 'text',
    note: 'Folgt text.' }],
  ['medo-input-placeholder', { ref: 'medo-input-bg', kind: 'text',
    note: 'Trifft die Helligkeitsrelation, die stone-600 auf Weiß hat.' }],
  ['medo-input-border', { ref: 'medo-input-bg', kind: 'ui',
    note: 'Bewusst zurückhaltend — spiegelt die im hellen Theme gelockte Entscheidung für stone-400.' }],
  ['medo-input-border-hover', { ref: 'medo-input-bg', kind: 'ui',
    note: 'Trifft die Relation von stone-600 auf Weiß.' }],
  ['medo-input-border-focus', { ref: 'medo-input-bg', kind: 'ui',
    note: 'Dünne Linien liegen eine Stufe heller als Füllflächen, die auf teal-500 sitzen.' }],
  ['medo-input-border-error', { ref: 'medo-input-bg', kind: 'ui',
    note: 'Dieselbe Regel wie border-focus, auf der Fehlerskala.' }],
  ['medo-input-border-disabled', { ref: 'medo-input-bg', kind: 'none',
    note: 'Folgt border-disabled.' }],

  // --- actions ------------------------------------------------------------
  ['medo-action', { ref: 'medo-surface', kind: 'ui',
    note: 'teal-600 verfehlt auf dunklem Grund die 3:1-Grenze für Bedienflächen — siehe Abwägung 1.' }],
  ['medo-action-hover', { ref: 'medo-surface', kind: 'ui',
    note: 'Hover heller statt dunkler.' }],
  ['medo-action-active', { ref: 'medo-surface', kind: 'ui',
    note: 'Aktiv noch eine Stufe heller.' }],
  ['medo-action-disabled', { ref: 'medo-surface', kind: 'none',
    note: 'Spiegelt stone-200 auf Weiß.' }],
  ['medo-action-text', { ref: 'medo-action', kind: 'text',
    note: 'Folgt text-on-primary.' }],
  ['medo-action-text-disabled', { ref: 'medo-action-disabled', kind: 'none',
    note: 'Folgt text-disabled.' }],
  ['medo-action-neutral', { ref: 'medo-action-neutral-text', kind: 'text',
    note: 'Gleiche Stufe wie surface-hover — dieselbe Gleichsetzung wie hell.' }],
  ['medo-action-neutral-hover', { ref: 'medo-action-neutral-text', kind: 'text',
    note: 'Eine Stufe heller.' }],
  ['medo-action-neutral-active', { ref: 'medo-action-neutral-text', kind: 'text',
    note: 'Zwei Stufen heller.' }],
  ['medo-action-neutral-text', { ref: 'medo-action-neutral', kind: 'text',
    note: 'Folgt text.' }],

  // --- focus --------------------------------------------------------------
  ['medo-focus-ring', { ref: 'medo-surface', kind: 'ui',
    note: 'teal-300 bei 55 %. Die einzige Stelle, an der die Deckkraft steigt — siehe Sonderfall 3.' }],
  ['medo-focus-ring-danger', { ref: 'medo-surface', kind: 'ui',
    note: 'red-300 bei 55 %, gleiche Herleitung wie focus-ring.' }],

  // --- states -------------------------------------------------------------
  ['medo-state-hover', { ref: 'medo-text', kind: 'text',
    note: 'Folgt surface-hover.' }],
  ['medo-state-pressed', { ref: 'medo-text', kind: 'text',
    note: 'Eine Stufe über hover, wie hell stone-200 über stone-100.' }],
  ['medo-state-selected', { ref: 'medo-text', kind: 'text',
    note: 'Folgt surface-selected.' }],
  ['medo-selection', { ref: 'medo-text', kind: 'text',
    note: 'Textmarkierung eine Stufe kräftiger als state-selected, wie hell teal-200 über teal-100.' }],
  ['medo-divider', { ref: 'medo-surface', kind: 'none',
    note: 'Folgt border-subtle, wie hell.' }],
  ['medo-scrim', { ref: 'medo-overlay', kind: 'none',
    note: 'Deckkraft bleibt bei 50 %, nur die Grundfarbe wechselt auf Schwarz — siehe Sonderfall 5.' }],

  // --- status sets --------------------------------------------------------
  ...statusSet('success'),
  ...statusSet('warning'),
  ...statusSet('error'),
  ...statusSet('info'),
])

function statusSet(role) {
  return [
    [`medo-${role}-surface`, { ref: `medo-${role}-text`, kind: 'text',
      note: 'Meldungsfläche auf der tiefsten Tonstufe der eigenen Skala.' }],
    [`medo-${role}-text`, { ref: `medo-${role}-surface`, kind: 'text',
      note: 'Heller Ton der eigenen Skala — behält den Farbton als Bedeutungsträger, statt ins Weiße zu gehen.' }],
    [`medo-${role}-border`, { ref: 'medo-surface', kind: 'none',
      note: 'Spiegelt die Zurückhaltung der 300er-Kante im hellen Theme.' }],
    [`medo-${role}-solid`, { ref: 'medo-surface', kind: 'ui',
      note: 'Wie action: die 600er-Stufe verfehlt auf dunklem Grund die 3:1-Grenze.' }],
    [`medo-${role}-solid-hover`, { ref: 'medo-surface', kind: 'ui',
      note: 'Hover heller statt dunkler.' }],
    [`medo-${role}-solid-active`, { ref: 'medo-surface', kind: 'ui',
      note: 'Aktiv noch eine Stufe heller.' }],
    [`medo-${role}-on-solid`, { ref: `medo-${role}-solid`, kind: 'text',
      note: 'Alle vier Füllfarben tragen im Dunkeln dunkle Schrift — die helle Sonderregel für Warnung entfällt damit.' }],
  ]
}
