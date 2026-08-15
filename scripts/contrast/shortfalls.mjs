/* Every dark combination that stays under its WCAG 2.2 threshold needs an entry
   here. analysis.mjs refuses to produce a report while one is missing — a
   shortfall may be a deliberate decision, never a silent one. */

export const JUSTIFICATIONS = {
  'medo-text-link|medo-state-pressed': {
    title: 'Textlink auf gedrückter Fläche',
    text: 'Der Link liegt hier auf stone-700, der hellsten der allgemeinen Flächen. Das helle Theme hat '
      + 'dieselbe Eigenschaft: teal-600 auf stone-200 erreicht dort 4,18:1 und damit ebenfalls keine 4,5. '
      + 'Der Vorschlag übernimmt diese Eigenschaft, statt eine neue einzuführen, und liegt beim '
      + 'verwandten Fall — Link auf Textmarkierung — mit 4,60:1 sogar über dem hellen Bestand, der dort '
      + 'bei 4,20:1 liegt. Hinzu kommt, dass state-pressed der Zustand während des Mausdrucks ist und '
      + 'nicht der Ruhezustand einer Zeile; die Kombination steht also nur für den Moment des Klicks. '
      + 'Wer die Unterschreitung dennoch nicht will, hebt text-link auf teal-300 — das bringt 5,25:1 auf '
      + 'der gedrückten Fläche, kostet aber Farbigkeit im Ruhezustand. Die Abwägung steht in Abschnitt 9.',
  },
  'medo-input-border|medo-input-bg': {
    title: 'Feldrahmen im Ruhezustand',
    text: 'Die zurückhaltende Feldkante ist eine gelockte Entscheidung des hellen Themes: '
      + 'design-reference/CLAUDE.md hält zu input-border=stone-400 ausdrücklich fest '
      + '„user chose light on purpose". Dort erreicht die Kante 2,23:1. Der Vorschlag spiegelt diese '
      + 'Absicht mit stone-600 und landet bei 2,65:1, also näher an der Grenze als das helle Theme. '
      + 'In beiden Themes trägt die Kante die Feldgrenze praktisch allein — die Fläche des Feldes hebt '
      + 'sich kaum ab (hell Weiß gegen stone-50 ergibt 1,07:1, dunkel stone-1100 gegen stone-900 ergibt '
      + '1,33:1). Im Fokus übernimmt ohnehin der Ring. Eine Anhebung auf stone-500 ergäbe 5,75:1, gäbe '
      + 'aber die gelockte Zurückhaltung auf; das wäre eine Änderung am hellen Beschluss und gehört '
      + 'damit als Änderungswunsch ins Design-Projekt, nicht in diesen Vorschlag.',
  },
}
