/* Every combination that stays under its WCAG 2.2 threshold needs an entry
   here — in the light theme just as in the dark one. analysis.mjs refuses to
   produce a report while one is missing: a shortfall may be a deliberate
   decision, never a silent one.

   Keys are `foreground|background` and one entry serves both themes. Where a
   combination falls short in both, it does so for the same reason — the entry
   has to carry that reason for both, not for one of them. */

export const JUSTIFICATIONS = {
  'medo-input-border|medo-input-bg': {
    title: 'Feldrahmen im Ruhezustand',
    text: 'Die zurückhaltende Feldkante ist eine gelockte Entscheidung des Design-Projekts: '
      + 'design-reference/CLAUDE.md hält zu input-border=stone-400 ausdrücklich fest '
      + '„user chose light on purpose". Im hellen Theme erreicht die Kante damit 2,23:1. Das '
      + 'dunkle Theme spiegelt dieselbe Absicht mit stone-600 und landet bei 2,65:1 — es steht '
      + 'der Schwelle also näher als das helle, dem es folgt. '
      + 'In beiden Themes trägt die Kante die Feldgrenze praktisch allein, weil sich die Fläche '
      + 'des Feldes kaum abhebt (hell Weiß gegen stone-50 ergibt 1,07:1, dunkel stone-1100 gegen '
      + 'stone-900 ergibt 1,33:1). Sobald das Feld bedient wird, übernimmt der Fokusring, der '
      + 'seit der Anhebung auf 75 % Deckkraft in beiden Themes deutlich über der Schwelle liegt. '
      + 'Eine Anhebung der Ruhekante auf stone-500 ergäbe im Dunkeln 5,75:1, gäbe aber die '
      + 'gelockte Zurückhaltung auf. Das wäre eine Änderung am hellen Beschluss und gehört als '
      + 'Änderungswunsch ins Design-Projekt, nicht in dieses Repository.',
  },
}
