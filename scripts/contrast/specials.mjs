/* The nine values that are not a plain brand step: five translucent literals
   and four shadow definitions. Each carries its own argument. */

export const SPECIAL_CASES = [
  {
    token: '--medo-text-muted',
    light: '#24221ead',
    dark: '#f7f7f6ad',
    headline: 'stone-50 bei 68 % — Deckkraft unverändert, Grundfarbe gespiegelt',
    text: 'Die 68 % sind im hellen Theme eine gelockte Entscheidung (stone-1000 bei 68 %). Sie bleiben '
      + 'unangetastet; nur die Grundfarbe wechselt von der dunkelsten auf die hellste Neutralstufe. '
      + 'Dass hier überhaupt mit Deckkraft statt mit einer festen Stufe gearbeitet wird, hat im Dunkeln '
      + 'denselben Nutzen wie im Hellen: gedämpfter Text nimmt den Farbton der Fläche an, auf der er '
      + 'liegt, und bleibt damit auch auf getönten Flächen wie der ausgewählten Zeile stimmig. Eine '
      + 'feste Stufe würde dort einen Grauschleier hinterlassen.',
  },
  {
    token: '--medo-icon-muted',
    light: '#24221e8c',
    dark: '#f7f7f68c',
    headline: 'stone-50 bei 55 % — Deckkraft unverändert, Grundfarbe gespiegelt',
    text: 'Gleiche Herleitung wie bei text-muted. Die 55 % stammen aus dem hellen Beschluss '
      + '(stone-1000 bei 55 %) und bleiben stehen.',
  },
  {
    token: '--medo-focus-ring',
    light: '#00726559',
    dark: '#adccc88c',
    headline: 'teal-300 bei 55 % — die einzige Stelle, an der die Deckkraft steigt',
    text: 'Hier weicht der Vorschlag bewusst ab, und zwar nach oben. Der Ring des hellen Themes '
      + '(primary-600 bei 35 %) erreicht gegen Weiß nur 1,71:1 und bleibt damit deutlich unter den 3:1, '
      + 'die WCAG 2.2 für Bedienelemente verlangt. Eine reine Spiegelung würde diese Schwäche ins dunkle '
      + 'Theme übernehmen: teal-300 bei 35 % käme auf 2,34:1. Mit 55 % trägt der Ring auf allen vier '
      + 'Trägerflächen über 3:1 — die Zahlen stehen in Abwägung 2. Die 55 % sind dabei keine neue Größe '
      + 'im System: es ist dieselbe Deckkraft, die icon-muted bereits verwendet (Hex-Endung 8c). '
      + 'Geändert werden also zwei Dinge, die Grundfarbe zwingend und die Deckkraft aus '
      + 'Zugänglichkeitsgründen. Wer die 35 % erhalten will, findet die Gegenrechnung in Abschnitt 9.',
  },
  {
    token: '--medo-focus-ring-danger',
    light: '#ab091359',
    dark: '#e1bab58c',
    headline: 'red-300 bei 55 % — dieselbe Regel auf der Fehlerskala',
    text: 'Der gelockte Beschluss verlangt für die zerstörerische Variante denselben Ring in '
      + 'error-Farbe bei gleicher Deckkraft. Diese Kopplung bleibt bestehen: was für focus-ring gilt, '
      + 'gilt hier auf der roten Skala. Im hellen Bestand liegt dieser Ring bei 2,00:1, im Vorschlag '
      + 'auf allen Trägerflächen über 3:1.',
  },
  {
    token: '--medo-scrim',
    light: 'rgba(23,21,19,0.5)',
    dark: 'rgba(0,0,0,0.5)',
    headline: 'Schwarz bei 50 % — Deckkraft unverändert, Grundfarbe gewechselt',
    text: 'stone-1100 kann eine Seite, die selbst auf stone-1000 liegt, nicht mehr abdunkeln: der '
      + 'Verschleierer ist kaum dunkler als das Verschleierte. Schwarz ist die einzige Farbe im '
      + 'Bestand, die auf dieser Fläche überhaupt noch Wirkung hat — deshalb der Wechsel der '
      + 'Grundfarbe. Die Deckkraft dagegen bleibt bei 50 %, und das ist hergeleitet, nicht gesetzt. '
      + 'Gemessen wird, wie weit der Scrim den Inhalt dahinter zurücknimmt, also der Kontrast des '
      + 'verschleierten Textes gegen die verschleierte Fläche. Das helle Theme lässt dort 4,93:1 '
      + 'stehen. Schwarz bei 50 % trifft diesen Wert mit 4,52:1 am genauesten; bei 66 % fiele er auf '
      + '2,59:1 und drückte den Hintergrund deutlich stärker weg, als es das helle Theme tut.\n\n'
      + 'Was der Scrim im Dunkeln nicht mehr leisten kann, ist die Flächentrennung. Hell hebt er den '
      + 'Dialog auf 3,45:1 gegen die Seite ab; dunkel bleiben selbst bei voller Deckung 1,54:1, weil '
      + 'die Seite schon nahe am Schwarzpunkt liegt. Diese Aufgabe übernimmt im Vorschlag die '
      + 'Aufhellung von overlay auf stone-900. Die vollständige Kurve steht in der Tabelle unten.',
  },
]

export const SHADOW_CASE = {
  headline: 'Gleiche Geometrie, Grundfarbe Schwarz, jede Deckkraft mal vier',
  text: 'Ein Schatten wirkt, indem er die Fläche unter einem schwebenden Element abdunkelt. Auf Weiß '
    + 'ist dafür viel Raum, auf stone-1000 fast keiner — ein warmer Schatten aus rgba(31,29,26,0.06) '
    + 'ist dort schlicht unsichtbar. Daraus folgen zwei Entscheidungen.\n\n'
    + '**Erstens** trägt die Tiefenwirkung im dunklen Theme nicht mehr der Schatten, sondern die '
    + 'Flächenleiter. Jede Höhe ist eine Helligkeitsstufe: Grundfläche stone-1000, Karte und Menü '
    + 'stone-900, höhere Ebene stone-800. Genau deshalb weicht overlay vom hellen Theme ab, wo es mit '
    + 'surface identisch ist. **Zweitens** behält der Schatten trotzdem eine Aufgabe, nämlich die Naht '
    + 'direkt unter dem schwebenden Element zu verdunkeln, damit dessen Kante nicht mit einer gleich '
    + 'hellen Nachbarfläche verschmilzt.\n\n'
    + 'Dafür bleibt die Geometrie der vier Stufen unverändert — Versatz, Weichzeichnung und '
    + 'Zweischichtigkeit sind gelockte Werte. Die Grundfarbe wechselt von warmem Braungrau auf Schwarz, '
    + 'und jede Deckkraft wird mit vier multipliziert. Eine Regel für alle vier Stufen, keine '
    + 'Einzelabstimmung: 0,06 wird 0,24, 0,04 wird 0,16, und so fort.\n\n'
    + 'Zum Faktor vier gehört eine Offenlegung. Er ist die **einzige Setzung im gesamten Vorschlag** — '
    + 'alles andere ist entweder eine vorhandene Brand-Stufe oder aus dem hellen Bestand hergeleitet. '
    + 'Herleiten lässt er sich nicht, weil Gleichwertigkeit gar nicht erreichbar ist: die Messung unten '
    + 'zeigt, dass ein dunkler Schatten das Vier- bis Sechsfache der hellen Deckkraft bräuchte, um '
    + 'denselben Helligkeitssprung zu erzeugen, und dass die stärkste Schicht selbst bei voller Deckung '
    + 'nicht hinkommt. Solche Werte wären keine Schatten mehr, sondern schwarze Höfe. Vier ist deshalb '
    + 'bewusst konservativ gewählt: es hält alle vier Stufen in ihrer relativen Ordnung, macht die '
    + 'schwächste Schicht sichtbar und lässt die stärkste mit 0,64 klar unterhalb der Deckung. Wer die '
    + 'Schatten kräftiger will, hebt den Faktor — das ist eine Geschmacks- und keine '
    + 'Zugänglichkeitsfrage und gehört deshalb in Ihre Entscheidung.',
  perShadow: {
    'medo-shadow-sm': 'Karten in Ruhe. Trägt im Dunkeln am wenigsten — hier arbeitet fast '
      + 'ausschließlich die Flächenstufe.',
    'medo-shadow-md': 'Menüs und Auswahllisten. Der Schatten setzt die Unterkante ab, die Aufhellung '
      + 'auf stone-900 trägt die Höhe.',
    'medo-shadow-lg': 'Dialoge. Wirkt zusammen mit dem Scrim; die Trennung entsteht aus der '
      + 'Kombination, nicht aus dem Schatten allein.',
    'medo-shadow-xl': 'Höchste Ebene. Mit 0,64 in der zweiten Schicht bereits nahe an einem sichtbaren '
      + 'Hof — wenn eine Stufe im Abgleich zu kräftig wirkt, dann diese.',
  },
}
